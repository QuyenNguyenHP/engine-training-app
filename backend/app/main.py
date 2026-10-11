"""Stateless API backed by the JSON model library."""
import os

from fastapi import FastAPI, HTTPException

from app.model_library import components_for_model, model_by_id, router as model_router


app = FastAPI(title="Engine Training API")
app.include_router(model_router)


@app.get("/api/v1/health")
def health():
    return {"status": "ok"}


@app.get("/api/v1/components")
def components(model_id: str | None = None):
    model_components = components_for_model(model_id)
    return model_components if model_components is not None else []


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
        client = boto3.client(
            "s3",
            endpoint_url=os.getenv("S3_PUBLIC_ENDPOINT"),
            region_name="us-east-1",
            config=Config(signature_version="s3v4"),
        )
        url = client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": os.getenv("S3_BUCKET", "engine-assets"),
                "Key": key,
            },
            ExpiresIn=900,
        )
        return {"url": url, "mode": "glb"}
    except (BotoCoreError, ClientError) as exc:
        raise HTTPException(503, "Model storage is unavailable") from exc
