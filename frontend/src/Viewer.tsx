import React, { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls, Grid, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Part, useViewer } from './store';

type CameraPreset = { position: [number, number, number]; target: [number, number, number] };
const SELECTED_COLOR = '#0b3d91';

function CameraPresetController({preset,controlsRef}:{preset:CameraPreset|null;controlsRef:React.RefObject<any>}) {
  const camera=useThree((state)=>state.camera);
  useEffect(()=>{
    if(!preset||!controlsRef.current)return;
    camera.position.set(...preset.position);
    controlsRef.current.target.set(...preset.target);
    controlsRef.current.update();
  },[camera,controlsRef,preset]);
  return null;
}

function STLModel({url,part}:{url:string;part:Part}) {
  const original=useLoader(STLLoader,url);
  const geometry=useMemo(()=>{
    const geometry=original.clone();
    geometry.computeBoundingBox();
    const size=geometry.boundingBox!.getSize(new THREE.Vector3());
    const extent=Math.max(size.x,size.y,size.z);
    if(!Number.isFinite(extent)||extent<=0)throw Error('Empty or invalid STL');
    geometry.center();
    geometry.scale(4/extent,4/extent,4/extent);
    geometry.computeVertexNormals();
    return geometry;
  },[original]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  const s=useViewer();
  return <mesh geometry={geometry} visible={!s.hidden.includes(part.id)} onClick={e=>{e.stopPropagation();s.select(part.id)}}>
    <meshStandardMaterial color={s.selected===part.id?SELECTED_COLOR:'#1d1ac0'} metalness={0.35} roughness={0.45} transparent={s.xray} opacity={s.xray?0.25:1} depthWrite={!s.xray}/>
  </mesh>;
}

function Schematic({parts}:{parts:Part[]}) {
  const s=useViewer();
  return <group>{parts.filter(p=>!s.hidden.includes(p.id)&&(!s.isolated||!s.selected||s.selected===p.id)).map(p=>{
    const active=s.selected===p.id;
    const transparent=s.xray&&!active;
    const position=p.position.map((v,i)=>v+(p.explodeOffset[i]*s.explodeAmount)) as [number,number,number];
    return <mesh key={p.id} position={position} rotation={p.shape==='shaft'?[Math.PI/2,0,0]:[0,0,0]} onClick={e=>{e.stopPropagation();s.select(p.id)}}>
      {p.shape==='box'?<boxGeometry args={p.size}/>:<cylinderGeometry args={[...p.size,32]}/>}
      <meshStandardMaterial color={active?SELECTED_COLOR:p.color} metalness={0.45} roughness={0.35} transparent={transparent} opacity={transparent?0.15:1} depthWrite={!transparent}/>
    </mesh>;
  })}</group>;
}

function Imported({url,parts,controlsRef}:{url:string;parts:Part[];controlsRef:React.RefObject<any>}) {
  const {scene}=useGLTF(url);
  const copy=useMemo(()=>{const c=scene.clone(true);c.traverse(o=>{if(o instanceof THREE.Mesh)o.material=Array.isArray(o.material)?o.material.map(m=>m.clone()):o.material.clone()});return c},[scene]);
  const s=useViewer();
  const camera=useThree((state)=>state.camera);
  const applyVisibility=()=>{
    copy.traverse(object=>{
      const part=ownerFor(object);
      if(!part)return;
      const visible=!s.hidden.includes(part.id)&&(!s.isolated||!s.selected||part.id===s.selected);
      object.visible=visible;
      if(object instanceof THREE.Mesh){for(const material of (Array.isArray(object.material)?object.material:[object.material])){if(material instanceof THREE.MeshStandardMaterial){material.emissive.set(part.id===s.selected?SELECTED_COLOR:'#000000');material.transparent=s.xray&&part.id!==s.selected;material.opacity=material.transparent?0.15:1;material.depthWrite=!material.transparent}}}
    });
  };
  const ownerFor=(object:THREE.Object3D)=>{
    let current:THREE.Object3D|null=object;
    while(current){const part=parts.find(part=>part.modelObjectName===current!.name);if(part)return part;current=current.parent}
    return undefined;
  };
  useFrame(applyVisibility);
  useLayoutEffect(()=>{
    const originals=new Map<THREE.Object3D,THREE.Vector3>();
    copy.traverse(o=>originals.set(o,o.position.clone()));
    applyVisibility();
    for(const p of parts){const o=copy.getObjectByName(p.modelObjectName);if(!o)continue;
      if(s.explodeAmount)o.position.add(new THREE.Vector3(...p.explodeOffset).multiplyScalar(s.explodeAmount));
    }
    return ()=>{originals.forEach((v,o)=>o.position.copy(v))};
  },[copy,parts,s.selected,s.isolated,s.hidden,s.explodeAmount,s.xray]);
  useEffect(()=>{
    if(!s.isolated||!s.selected||!controlsRef.current)return;
    const component=parts.find(part=>part.id===s.selected);
    if(!component)return;
    const object=copy.getObjectByName(component.modelObjectName);
    if(!object)return;
    const center=new THREE.Box3().setFromObject(object).getCenter(new THREE.Vector3());
    if(!Number.isFinite(center.x)||!Number.isFinite(center.y)||!Number.isFinite(center.z))return;
    const controls=controlsRef.current;
    const offset=camera.position.clone().sub(controls.target);
    controls.target.copy(center);
    camera.position.copy(center.clone().add(offset));
    controls.update();
  },[camera,controlsRef,copy,parts,s.isolated,s.selected]);
  return <primitive object={copy} onClick={(e:{stopPropagation:()=>void;object:THREE.Object3D})=>{let o:THREE.Object3D|null=e.object;while(o){const p=parts.find(p=>p.modelObjectName===o!.name);if(p){e.stopPropagation();if(!s.isolated||!s.selected||p.id===s.selected)s.select(p.id);break}o=o.parent}}}/>;
}

export class SceneBoundary extends React.Component<{children:React.ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true}}
  render(){return this.state.failed?<div className="scene-error">The 3D model could not be loaded. Check the model URL and browser WebGL support, then reload.</div>:this.props.children}
}

export function Viewer({parts,url,mode,isFullscreen,cameraPreset}:{parts:Part[];url:string|null;mode?:string;isFullscreen?:boolean;cameraPreset?:CameraPreset|null}) {
  const resetKey=useViewer(s=>s.resetKey);
  const select=useViewer(s=>s.select);
  const controlsRef=useRef<any>(null);
  return <SceneBoundary key={url}><Canvas key={resetKey} onPointerMissed={() => { if (isFullscreen) select(null); }} camera={{position:[6,4,7],fov:45}}><color attach="background" args={['#111e2b']}/><ambientLight intensity={1.8}/><hemisphereLight args={['#dceeff','#5b7790',1.35]}/><directionalLight position={[5,8,5]} intensity={2.6}/><directionalLight position={[-6,3,-5]} intensity={2.1}/><directionalLight position={[0,-7,3]} intensity={2.4}/><pointLight position={[0,-3,-6]} intensity={1.6} distance={20}/><pointLight position={[6,0,-2]} intensity={1.2} distance={18}/><Suspense fallback={null}>{url?(mode==='stl'?<STLModel url={url} part={parts[0]}/>:<Imported url={url} parts={parts} controlsRef={controlsRef}/>):<Schematic parts={parts}/>}</Suspense><Grid position={[0,-4,0]} args={[24,24]} cellColor="#243849" sectionColor="#30495c" fadeDistance={30}/><OrbitControls ref={controlsRef} makeDefault minDistance={0.35} maxDistance={30}/><CameraPresetController preset={cameraPreset||null} controlsRef={controlsRef}/></Canvas></SceneBoundary>;
}
