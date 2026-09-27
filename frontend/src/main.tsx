import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Viewer } from './Viewer';
import { Part, useViewer } from './store';
import './style.css';

type Model = { id: string; name: string; available: boolean };
type CameraPreset = { position: [number, number, number]; target: [number, number, number] };

function App() {
  const [parts, setParts] = useState<Part[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [modelId, setModelId] = useState('');
  const [url, setUrl] = useState<string | null>(null);
  const [mode, setMode] = useState('schematic');
  const [modelName, setModelName] = useState('');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset | null>(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const s = useViewer();
  const selected = parts.find((part) => part.id === s.selected);
  const hiddenParts = parts.filter((part) => s.hidden.includes(part.id));

  useEffect(() => {
    fetch('/api/v1/models')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => {
        setModels(data.models);
        setModelId(data.active || data.models.find((model: Model) => model.available)?.id || '');
      })
      .catch(() => setError('Cannot load the model library.'));
  }, []);

  useEffect(() => {
    if (!modelId) return;
    s.reset();
    const suffix = `?model_id=${encodeURIComponent(modelId)}`;
    Promise.all(['/api/v1/components', '/api/v1/assets/engine-model'].map(async (path) => {
      const response = await fetch(path + suffix);
      if (!response.ok) throw Error('API unavailable');
      return response.json();
    })).then(([componentData, asset]) => {
      setMode(asset.mode);
      setModelName(asset.name || '');
      setCameraPreset(asset.camera || null);
      setParts(asset.mode === 'stl' ? [{
        id: asset.id || 'stl-model', name: asset.name || 'STL model', system: 'Imported STL',
        modelObjectName: '', function: 'Imported STL geometry. Component metadata has not been configured.',
        location: 'Original CAD assembly', maintenance: 'Refer to manufacturer documentation.',
        position: [0, 0, 0], explodeOffset: [0, 0, 0], shape: '', size: [1, 1, 1], color: '#9aaebf',
      }] : componentData);
      setUrl(asset.url);
      setError('');
    }).catch(() => setError('Cannot load the selected model.'));
  }, [modelId]);

  useEffect(() => {
    const syncFullscreen = () => {
      setIsFullscreen(document.fullscreenElement === viewportRef.current);
      requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    };
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);

  const selectPart = (part: Part) => {
    if (s.hidden.includes(part.id)) s.show(part.id);
    s.select(part.id);
  };
  const navigate = (offset: number) => {
    const index = parts.findIndex((part) => part.id === s.selected);
    selectPart(parts[(index + offset + parts.length) % parts.length]);
  };
  const toggleFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await viewportRef.current?.requestFullscreen();
  };

  return <>
    <header><div className="brand">◈ <span>ENGINE<span className="accent">LAB</span></span><small>INTERACTIVE TRAINING</small></div><span className="badge">EXPLORE MODE</span></header>
    <div className="heading"><div><p className="eyebrow">01 / ENGINE FUNDAMENTALS</p><h1>Understand every component.</h1><p>Explore the assembly. Discover how its parts work together.</p></div>
      <label className="model-picker">MODEL<select aria-label="Select model" value={modelId} onChange={(event) => setModelId(event.target.value)}>{models.map((model) => <option key={model.id} value={model.id} disabled={!model.available}>{model.name}{model.available ? '' : ' (missing file)'}</option>)}</select></label>
    </div>
    {error ? <div role="alert" className="error">{error}<button onClick={() => location.reload()}>Retry</button></div> : <main>
      <aside><p className="eyebrow">COMPONENT LIBRARY <span>{parts.length}</span></p><input aria-label="Search components" placeholder="Search components…" value={query} onChange={(event) => setQuery(event.target.value)} />
        {[...new Set(parts.map((part) => part.system))].map((system) => <section key={system}><h3>{system}</h3>{parts.filter((part) => part.system === system && part.name.toLowerCase().includes(query.toLowerCase())).map((part) => <button className={'part ' + (part.id === s.selected ? 'active' : '')} key={part.id} onClick={() => selectPart(part)}><span className="dot" style={{ background: part.color }} />{part.name}<span className="arrow">{s.hidden.includes(part.id) ? 'hidden' : '↗'}</span></button>)}</section>)}
        {hiddenParts.length > 0 && <section className="hidden-list"><h3>HIDDEN COMPONENTS</h3>{hiddenParts.map((part) => <button className="part" key={part.id} onClick={() => selectPart(part)}><span className="dot" style={{ background: part.color }} />{part.name}<span className="arrow">Show</span></button>)}</section>}
      </aside>
      <div className="viewport" ref={viewportRef}><div className="view-label"><span className="live" /> {s.exploded ? 'EXPLODED ASSEMBLY' : (modelName || 'ENGINE ASSEMBLY')}</div><button className="fullscreen-toggle" onClick={toggleFullscreen}>{isFullscreen ? 'Exit full screen' : 'Full screen'}</button><div className="canvas-shell">{parts.length ? <Viewer parts={parts} url={url} mode={mode} isFullscreen={isFullscreen} cameraPreset={cameraPreset} /> : <p className="loading">Loading components…</p>}</div>{isFullscreen && selected && <article className="fullscreen-info" onClick={(event) => event.stopPropagation()}><button className="popup-close" aria-label="Close component information" onClick={() => s.select(null)}>×</button><p className="eyebrow">{selected.system}</p><h2>{selected.name}</h2><h3>Function</h3><p>{selected.function}</p><h3>Location</h3><p>{selected.location}</p></article>}<div className="view-help">Drag to rotate · Scroll to zoom · Right-drag to pan</div></div>
      <aside className="details"><p className="eyebrow">COMPONENT DETAILS</p>{selected ? <><span className="category">{selected.system}</span><h2>{selected.name}</h2><h3>Function</h3><p>{selected.function}</p><h3>Location</h3><p>{selected.location}</p><h3>Maintenance overview</h3><p>{selected.maintenance}</p><button className="primary" onClick={() => s.toggle('isolated')}>{s.isolated ? 'Show assembly' : 'Isolate component'} ↗</button><button onClick={() => s.hidden.includes(selected.id) ? s.show(selected.id) : s.hide()}>{s.hidden.includes(selected.id) ? 'Show component' : 'Hide component'}</button></> : <div className="empty"><div>◎</div><h2>Explore the engine</h2><p>Select a part in the model or component library to discover its function.</p><p>Use X-ray or exploded view to reveal internal parts.</p></div>}</aside>
    </main>}
    <footer><div><button onClick={s.reset}>↺ Reset all</button>{hiddenParts.length > 0 && <button onClick={s.showAll}>Show all</button>}<button disabled={!s.selected} aria-pressed={s.isolated} className={s.isolated ? 'active' : ''} onClick={() => s.toggle('isolated')}>Isolate</button><label className="explode-slider">Explode <input aria-label="Exploded view amount" type="range" min="0" max="100" step="1" disabled={mode === 'stl'} value={Math.round(s.explodeAmount * 100)} onChange={(event) => s.setExplodeAmount(Number(event.target.value) / 100)} /><output>{Math.round(s.explodeAmount * 100)}%</output></label><button aria-pressed={s.xray} className={s.xray ? 'active' : ''} onClick={() => s.toggle('xray')}>X-ray</button></div><div><button disabled={!parts.length} onClick={() => navigate(-1)}>← Previous</button><button disabled={!parts.length} onClick={() => navigate(1)}>Next component →</button></div></footer>
    <p className="disclaimer">Illustrative training model. Follow the engine manufacturer’s documentation for actual maintenance procedures.</p>
  </>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
