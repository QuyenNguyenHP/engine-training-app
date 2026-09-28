import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ComponentDetails } from './components/ComponentDetails';
import { ModelComponents } from './components/ModelComponents';
import { ModelViewport } from './components/ModelViewport';
import { Part, useViewer } from './store';
import drumsLogo from '../DRUMS_logo.png';
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

  const selectPart = (part: Part) => {
    if (s.hidden.includes(part.id)) s.show(part.id);
    s.select(part.id);
  };
  const navigate = (offset: number) => {
    const index = parts.findIndex((part) => part.id === s.selected);
    selectPart(parts[(index + offset + parts.length) % parts.length]);
  };
  return <>
    <header><div className="brand"><img className="brand-logo" src={drumsLogo} alt="DRUMS" /><span>ENGINE<span className="accent">LAB</span></span><small>INTERACTIVE TRAINING</small></div><span className="badge">EXPLORE MODE</span></header>
    <div className="heading"><div><p className="eyebrow">01 / ENGINE FUNDAMENTALS</p><h1>Understand every component.</h1><p>Explore the assembly. Discover how its parts work together.</p></div></div>
    {error ? <div role="alert" className="error">{error}<button onClick={() => location.reload()}>Retry</button></div> : <main>
      <ModelComponents parts={parts} models={models} modelId={modelId} onModelChange={setModelId} />
      <ModelViewport parts={parts} url={url} mode={mode} modelName={modelName} cameraPreset={cameraPreset} />
      <ComponentDetails selected={selected} />
    </main>}
    <footer><div>{hiddenParts.length > 0 && <button onClick={s.showAll}>Show all</button>}</div><div><button disabled={!parts.length} onClick={() => navigate(-1)}>← Previous</button><button disabled={!parts.length} onClick={() => navigate(1)}>Next component →</button></div></footer>
    <p className="disclaimer">Illustrative training model. Follow the engine manufacturer’s documentation for actual maintenance procedures.</p>
  </>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
