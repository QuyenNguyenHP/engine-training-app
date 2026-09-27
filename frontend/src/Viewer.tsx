import React, { Suspense, useEffect, useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls, Grid, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Part, useViewer } from './store';

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
    <meshStandardMaterial color={s.selected===part.id?'#56e5cf':'#9aaebf'} metalness={0.35} roughness={0.45} transparent={s.xray} opacity={s.xray?0.25:1} depthWrite={!s.xray}/>
  </mesh>;
}

function Schematic({parts}:{parts:Part[]}) {
  const s=useViewer();
  return <group>{parts.filter(p=>!s.hidden.includes(p.id)&&(!s.isolated||!s.selected||s.selected===p.id)).map(p=>{
    const active=s.selected===p.id;
    const transparent=s.xray&&!active;
    const position=p.position.map((v,i)=>v+(s.exploded?p.explodeOffset[i]:0)) as [number,number,number];
    return <mesh key={p.id} position={position} rotation={p.shape==='shaft'?[Math.PI/2,0,0]:[0,0,0]} onClick={e=>{e.stopPropagation();s.select(p.id)}}>
      {p.shape==='box'?<boxGeometry args={p.size}/>:<cylinderGeometry args={[...p.size,32]}/>}
      <meshStandardMaterial color={active?'#56e5cf':p.color} metalness={0.45} roughness={0.35} transparent={transparent} opacity={transparent?0.15:1} depthWrite={!transparent}/>
    </mesh>;
  })}</group>;
}

function Imported({url,parts}:{url:string;parts:Part[]}) {
  const {scene}=useGLTF(url);
  const copy=useMemo(()=>{const c=scene.clone(true);c.traverse(o=>{if(o instanceof THREE.Mesh)o.material=Array.isArray(o.material)?o.material.map(m=>m.clone()):o.material.clone()});return c},[scene]);
  const s=useViewer();
  useEffect(()=>{
    const originals=new Map<THREE.Object3D,THREE.Vector3>();
    copy.traverse(o=>originals.set(o,o.position.clone()));
    for(const p of parts){const o=copy.getObjectByName(p.modelObjectName);if(!o)continue;
      o.visible=!s.hidden.includes(p.id)&&(!s.isolated||!s.selected||p.id===s.selected);
      if(s.exploded)o.position.add(new THREE.Vector3(...p.explodeOffset));
      o.traverse(child=>{if(child instanceof THREE.Mesh){for(const m of (Array.isArray(child.material)?child.material:[child.material])){if(m instanceof THREE.MeshStandardMaterial){m.emissive.set(p.id===s.selected?'#176656':'#000000');m.transparent=s.xray&&p.id!==s.selected;m.opacity=m.transparent?0.15:1;m.depthWrite=!m.transparent}}}});
    }
    return ()=>{originals.forEach((v,o)=>o.position.copy(v))};
  },[copy,parts,s.selected,s.isolated,s.hidden,s.exploded,s.xray]);
  return <primitive object={copy} onClick={(e:{stopPropagation:()=>void;object:THREE.Object3D})=>{let o:THREE.Object3D|null=e.object;while(o){const p=parts.find(p=>p.modelObjectName===o!.name);if(p){e.stopPropagation();s.select(p.id);break}o=o.parent}}}/>;
}

export class SceneBoundary extends React.Component<{children:React.ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true}}
  render(){return this.state.failed?<div className="scene-error">The 3D model could not be loaded. Check the model URL and browser WebGL support, then reload.</div>:this.props.children}
}

export function Viewer({parts,url,mode}:{parts:Part[];url:string|null;mode?:string}) {
  const resetKey=useViewer(s=>s.resetKey);
  return <SceneBoundary key={url}><Canvas key={resetKey} camera={{position:[6,4,7],fov:45}}><color attach="background" args={['#111e2b']}/><ambientLight intensity={1.4}/><directionalLight position={[5,8,5]} intensity={3}/><directionalLight position={[-5,2,-3]} intensity={2}/><Suspense fallback={null}>{url?(mode==='stl'?<STLModel url={url} part={parts[0]}/>:<Imported url={url} parts={parts}/>):<Schematic parts={parts}/>}</Suspense><Grid position={[0,-4,0]} args={[24,24]} cellColor="#243849" sectionColor="#30495c" fadeDistance={30}/><OrbitControls makeDefault minDistance={2} maxDistance={30}/></Canvas></SceneBoundary>;
}
