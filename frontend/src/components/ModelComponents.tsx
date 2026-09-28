import { useEffect, useState } from 'react';
import { Part, useViewer } from '../store';

type ModelOption = { id: string; name: string; available: boolean };

type ModelComponentsProps = {
  parts: Part[];
  models: ModelOption[];
  modelId: string;
  onModelChange: (modelId: string) => void;
};

export function ModelComponents({ parts, models, modelId, onModelChange }: ModelComponentsProps) {
  const [collapsedSystems, setCollapsedSystems] = useState<Set<string>>(() => new Set());
  const viewer = useViewer();
  const hiddenParts = parts.filter((part) => viewer.hidden.includes(part.id));
  const systems = [...new Set(parts.map((part) => part.system || 'Components'))];

  useEffect(() => {
    setCollapsedSystems(new Set());
  }, [modelId]);

  const selectPart = (part: Part) => {
    if (viewer.hidden.includes(part.id)) viewer.show(part.id);
    viewer.select(part.id);
  };

  const toggleSystem = (system: string) => {
    setCollapsedSystems((current) => {
      const next = new Set(current);
      if (next.has(system)) next.delete(system);
      else next.add(system);
      return next;
    });
  };

  return <aside className="component-library">
    <p className="eyebrow">MODEL &amp; COMPONENTS <span>{parts.length}</span></p>
    <label className="model-picker">MODEL
      <select aria-label="Select model" value={modelId} onChange={(event) => onModelChange(event.target.value)}>
        {models.map((model) => <option key={model.id} value={model.id} disabled={!model.available}>{model.name}{model.available ? '' : ' (missing file)'}</option>)}
      </select>
    </label>
    {systems.map((system) => {
      const systemParts = parts.filter((part) => (part.system || 'Components') === system);
      const collapsed = collapsedSystems.has(system);
      const panelId = `system-${system.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      return <section className="system-group" key={system}>
        <h3><button className="system-toggle" type="button" aria-expanded={!collapsed} aria-controls={panelId} onClick={() => toggleSystem(system)}><span>{system}</span><span className="system-count">{systemParts.length}</span><span className={'system-chevron ' + (collapsed ? '' : 'expanded')}>⌄</span></button></h3>
        <div id={panelId} hidden={collapsed}>{systemParts.map((part) => <button className={'part ' + (part.id === viewer.selected ? 'active' : '')} key={part.id} onClick={() => selectPart(part)}><span className="dot" style={{ background: part.color }} />{part.name}<span className="arrow">{viewer.hidden.includes(part.id) ? 'hidden' : '↗'}</span></button>)}</div>
      </section>;
    })}
    {hiddenParts.length > 0 && <section className="hidden-list"><h3>HIDDEN COMPONENTS</h3>{hiddenParts.map((part) => <button className="part" key={part.id} onClick={() => selectPart(part)}><span className="dot" style={{ background: part.color }} />{part.name}<span className="arrow">Show</span></button>)}</section>}
  </aside>;
}

