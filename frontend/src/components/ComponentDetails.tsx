import { Part, useViewer } from '../store';

type ComponentDetailsProps = { selected?: Part };

export function ComponentDetails({ selected }: ComponentDetailsProps) {
  const viewer = useViewer();

  return <aside className="details">
    <p className="eyebrow">COMPONENT DETAILS</p>
    {selected ? <>
      {selected.system && <span className="category">{selected.system}</span>}
      <h2>{selected.name}</h2>
      <h3>Function</h3><p>{selected.function}</p>
      <h3>Location</h3><p>{selected.location}</p>
      <h3>Maintenance overview</h3><p>{selected.maintenance}</p>
      <button className="primary" onClick={() => viewer.toggle('isolated')}>{viewer.isolated ? 'Show assembly' : 'Isolate component'} ↗</button>
      <button onClick={() => viewer.hidden.includes(selected.id) ? viewer.show(selected.id) : viewer.hide()}>{viewer.hidden.includes(selected.id) ? 'Show component' : 'Hide component'}</button>
    </> : <div className="empty"><div>◎</div><h2>Explore the engine</h2><p>Select a part in the model or component library to discover its function.</p><p>Use X-ray or exploded view to reveal internal parts.</p></div>}
  </aside>;
}

