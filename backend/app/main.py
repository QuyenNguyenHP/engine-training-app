"""MVP catalogue API. PostgreSQL in Compose; SQLite for local development."""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from sqlalchemy import JSON, String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column
from app.model_library import components_for_model, model_by_id, router as model_router


class Base(DeclarativeBase):
    pass


class Component(Base):
    __tablename__ = "components"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    data: Mapped[dict] = mapped_column(JSON)


engine = create_engine(os.getenv("DATABASE_URL", "sqlite:///./engine.db"))

PARTS = [
    ("block", "Engine block", "Structure", "EngineBlock", "Houses the cylinder and supports the rotating assembly.", "Cylinder bore and crankcase", "Check for cracks and coolant leaks.", [0, 0, 0], [0, 0, -2], "box", [1.8, 1.6, 1.3], "#566c83"),
    ("head", "Cylinder head", "Structure", "CylinderHead", "Seals the combustion chamber and carries the valves.", "Above the cylinder block", "Inspect sealing surfaces and valve seats.", [0, 1.05, 0], [0, 2.5, 0], "box", [1.9, 0.4, 1.4], "#8a9eb3"),
    ("piston", "Piston", "Crank system", "Piston", "Transfers combustion pressure to the connecting rod.", "Inside the cylinder", "Inspect rings and skirt for wear.", [0, 0.25, 0], [2.5, 0.8, 0], "cylinder", [0.48, 0.48, 0.48], "#c0cbd4"),
    ("rod", "Connecting rod", "Crank system", "ConnectingRod", "Connects the piston to the crankshaft.", "Between piston and crankshaft", "Inspect bearings and fasteners.", [0, -0.5, 0], [2.5, -0.3, 0], "box", [0.2, 0.9, 0.22], "#91a4b7"),
    ("crank", "Crankshaft", "Crank system", "Crankshaft", "Converts reciprocating motion into rotation.", "Lower crankcase", "Check journals and bearing clearances.", [0, -1.05, 0], [0, -1.8, 0], "shaft", [0.23, 0.23, 2.2], "#728ba3"),
    ("flywheel", "Flywheel", "Crank system", "Flywheel", "Stores rotational energy to smooth engine speed.", "End of the crankshaft", "Inspect the ring gear and mounting bolts.", [0, -1.05, 1.2], [0, -0.5, 2], "shaft", [0.72, 0.72, 0.22], "#3d566e"),
    ("pump", "Injection pump", "Fuel", "InjectionPump", "Pressurizes and meters fuel for injection.", "Side of the engine", "Inspect for leakage; follow manufacturer calibration procedures.", [-1.3, 0, 0], [-1.8, 0, 0], "box", [0.45, 0.75, 0.55], "#e5b954"),
    ("injector", "Fuel injector", "Fuel", "Injector_01", "Atomizes fuel into the combustion chamber.", "Mounted in the cylinder head", "Inspect nozzle deposits and test spray pattern using approved equipment.", [0, 1.5, 0], [0, 3, 0], "cylinder", [0.1, 0.16, 0.6], "#f1ca67"),
    ("coolant", "Coolant pump", "Cooling", "CoolantPump", "Circulates coolant through the engine cooling circuit.", "Front of the engine block", "Check seals and impeller condition.", [1.25, -0.1, 0], [1.8, 0, 0], "shaft", [0.35, 0.35, 0.4], "#67bfc1"),
    ("sump", "Oil sump", "Lubrication", "OilSump", "Collects lubricating oil beneath the crankcase.", "Bottom of the engine", "Check oil level and inspect for leaks.", [0, -1.65, 0], [0, -2.2, 0], "box", [1.75, 0.45, 1.3], "#648573"),
    ("exhaust", "Exhaust manifold", "Exhaust", "ExhaustManifold", "Collects and directs exhaust gas away from the cylinder.", "Side of the cylinder head", "Inspect joints for leaks and thermal cracking.", [1.2, 0.9, 0], [2, 1.3, 0], "box", [0.45, 0.35, 1.1], "#b28068"),
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        for i, name, system, obj, function, location, maintenance, pos, offset, shape, size, color in PARTS:
            if session.get(Component, i) is None:
                session.add(Component(id=i, data=dict(id=i, name=name, system=system,
                    modelObjectName=obj, function=function, location=location,
                    maintenance=maintenance, position=pos, explodeOffset=offset,
                    shape=shape, size=size, color=color)))
        session.commit()
    yield


app = FastAPI(title="Engine Training API", lifespan=lifespan)
app.include_router(model_router)


@app.get("/api/v1/health")
def health():
    with Session(engine) as session:
        session.execute(select(Component.id).limit(1))
    return {"status": "ok"}


@app.get("/api/v1/components")
def components(model_id: str | None = None):
    model_components = components_for_model(model_id)
    if model_components is not None:
        return model_components
    with Session(engine) as session:
        return list(session.scalars(select(Component.data).order_by(Component.id)))


@app.get("/api/v1/assets/engine-model")
def model_asset(model_id: str | None = None):
    local_model = model_by_id(model_id)
    if local_model:
        return local_model
    key = os.getenv("ENGINE_MODEL_KEY")
    if not key:
        return {"url": None, "mode": "schematic"}
    import boto3
    from botocore.config import Config
    from botocore.exceptions import BotoCoreError, ClientError
    try:
        client = boto3.client("s3", endpoint_url=os.getenv("S3_PUBLIC_ENDPOINT"),
                              region_name="us-east-1", config=Config(signature_version="s3v4"))
        url = client.generate_presigned_url("get_object", Params={"Bucket": os.getenv("S3_BUCKET", "engine-assets"), "Key": key}, ExpiresIn=900)
        return {"url": url, "mode": "glb"}
    except (BotoCoreError, ClientError) as exc:
        raise HTTPException(503, "Model storage is unavailable") from exc
