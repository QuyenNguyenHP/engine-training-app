import { useEffect, useRef, useState } from 'react';
import { Viewer } from '../Viewer';
import { Part, useViewer } from '../store';

type CameraPreset = { position: [number, number, number]; target: [number, number, number] };

type ModelViewportProps = {
  parts: Part[];
  url: string | null;
  mode: string;
  modelName: string;
  cameraPreset: CameraPreset | null;
};

export function ModelViewport({ parts, url, mode, modelName, cameraPreset }: ModelViewportProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const viewer = useViewer();
  const selected = parts.find((part) => part.id === viewer.selected);

  useEffect(() => {
    const syncFullscreen = () => {
      setIsFullscreen(document.fullscreenElement === viewportRef.current);
      requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    };
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await viewportRef.current?.requestFullscreen();
  };

  return <div className="viewport" ref={viewportRef}>
    <div className="view-label"><span className="live" /> {viewer.exploded ? 'EXPLODED ASSEMBLY' : (modelName || 'ENGINE ASSEMBLY')}</div>
    <div className="view-toolbar">
      <button className={'play-toggle ' + (viewer.autoRotate ? 'active' : '')} aria-label={viewer.autoRotate ? 'Pause model rotation' : 'Play model rotation'} title={viewer.autoRotate ? 'Pause rotation' : 'Play rotation'} aria-pressed={viewer.autoRotate} onClick={() => viewer.setAutoRotate(!viewer.autoRotate)}>{viewer.autoRotate ? 'Ⅱ' : '▶'}</button>
      <button onClick={viewer.reset}>↺ Reset</button>
      <button disabled={!viewer.selected && !viewer.isolated} aria-pressed={viewer.isolated} className={viewer.isolated ? 'active' : ''} onClick={() => viewer.toggle('isolated')}>Isolate</button>
      <label className="explode-slider">Explode <input aria-label="Exploded view amount" type="range" min="0" max="100" step="1" disabled={mode === 'stl'} value={Math.round(viewer.explodeAmount * 100)} onChange={(event) => viewer.setExplodeAmount(Number(event.target.value) / 100)} /><output>{Math.round(viewer.explodeAmount * 100)}%</output></label>
      <button aria-pressed={viewer.xray} className={viewer.xray ? 'active' : ''} onClick={() => viewer.toggle('xray')}>X-ray</button>
    </div>
    <button className="fullscreen-toggle" onClick={toggleFullscreen}>{isFullscreen ? 'Exit full screen' : 'Full screen'}</button>
    <div className="canvas-shell" onPointerDown={() => viewer.setAutoRotate(false)}>{parts.length ? <Viewer parts={parts} url={url} mode={mode} cameraPreset={cameraPreset} /> : <p className="loading">Loading components…</p>}</div>
    {isFullscreen && selected && <article className="fullscreen-info" onClick={(event) => event.stopPropagation()}><button className="popup-close" aria-label="Close component information" onClick={() => viewer.select(null)}>×</button>{selected.system && <p className="eyebrow">{selected.system}</p>}<h2>{selected.name}</h2><h3>Function</h3><p>{selected.function}</p><h3>Location</h3><p>{selected.location}</p></article>}
    <div className="view-help">Drag to rotate · Scroll to zoom · Right-drag to pan</div>
  </div>;
}

