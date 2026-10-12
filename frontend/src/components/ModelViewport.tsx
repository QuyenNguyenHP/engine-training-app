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
  const vietnamese = viewer.language === 'vi';
  const displayedPart = selected && vietnamese && selected.overviewVi ? {
    ...selected,
    name: selected.nameVi || selected.name,
    overview: selected.overviewVi,
    mainFunctions: selected.mainFunctionsVi,
    workingPrinciple: selected.workingPrincipleVi,
  } : selected;
  const systemTranslations: Record<string, string> = {
    Turbocharger: 'Bộ tăng áp',
    'Lubricating oil system': 'Hệ thống dầu bôi trơn',
  };
  const displayedSystem = vietnamese && selected?.system
    ? (systemTranslations[selected.system] || selected.system)
    : selected?.system;

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
    {isFullscreen && displayedPart && <article className="fullscreen-info" lang={viewer.language} onClick={(event) => event.stopPropagation()}><button className="popup-close" aria-label={vietnamese ? 'Đóng thông tin bộ phận' : 'Close component information'} onClick={() => viewer.select(null)}>×</button>{displayedSystem && <p className="eyebrow">{displayedSystem}</p>}<h2>{displayedPart.name}</h2>{displayedPart.overview ? <><h3 className="detail-heading detail-heading--overview">{vietnamese ? 'Tổng quan' : 'Overview'}</h3><p>{displayedPart.overview}</p><h3 className="detail-heading detail-heading--functions">{vietnamese ? 'Chức năng chính' : 'Main Functions'}</h3><ul className="main-functions">{displayedPart.mainFunctions?.map((item) => <li key={item}>{item}</li>)}</ul><h3 className="detail-heading detail-heading--principle">{vietnamese ? 'Nguyên lý hoạt động' : 'Working Principle'}</h3><p>{displayedPart.workingPrinciple}</p></> : <><h3>{vietnamese ? 'Chức năng' : 'Function'}</h3><p>{displayedPart.function}</p><h3>{vietnamese ? 'Vị trí' : 'Location'}</h3><p>{displayedPart.location}</p></>}</article>}
    <div className="view-help">Drag to rotate · Scroll to zoom · Right-drag to pan</div>
  </div>;
}

