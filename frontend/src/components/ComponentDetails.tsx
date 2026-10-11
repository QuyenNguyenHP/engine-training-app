import type { ReactNode } from 'react';
import { useViewer } from '../store';
import type { Part } from '../store';

type ComponentDetailsProps = {
  selected?: Part;
  modelName: string;
  modelOverview?: string;
};

type DetailSectionProps = {
  title: string;
  children?: ReactNode;
};

function DetailSection({ title, children }: DetailSectionProps) {
  if (!children) return null;

  const headingClasses: Record<string, string> = {
    Overview: 'detail-heading detail-heading--overview',
    'Main Functions': 'detail-heading detail-heading--functions',
    'Working Principle': 'detail-heading detail-heading--principle',
  };
  const headingClass = headingClasses[title] || 'detail-heading';

  return (
    <section>
      <h3 className={headingClass}>{title}</h3>
      {children}
    </section>
  );
}

function ModelOverview({
  modelName,
  modelOverview,
}: Pick<ComponentDetailsProps, 'modelName' | 'modelOverview'>) {
  return (
    <div className="empty">
      <div>◎</div>
      <span className="category">MODEL OVERVIEW</span>
      <h2>{modelName || 'Engine model'}</h2>
      <p>{modelOverview || 'General information about this model will be added here.'}</p>
      <p className="details-hint">
        Select a component to view its learning details.
      </p>
    </div>
  );
}

function MainFunctions({ items }: { items: string[] }) {
  return (
    <ul className="main-functions">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function ComponentDetails({
  selected,
  modelName,
  modelOverview,
}: ComponentDetailsProps) {
  const viewer = useViewer();

  if (!selected) {
    return (
      <aside className="details">
        <p className="eyebrow">MODEL INFORMATION</p>
        <ModelOverview modelName={modelName} modelOverview={modelOverview} />
      </aside>
    );
  }

  const isHidden = viewer.hidden.includes(selected.id);

  return (
    <aside className="details">
      <p className="eyebrow">COMPONENT DETAILS</p>

      {selected.system && <span className="category">{selected.system}</span>}
      <h2>{selected.name}</h2>

      <DetailSection title={selected.overview ? 'Overview' : 'Function'}>
        <p>{selected.overview || selected.function}</p>
      </DetailSection>

      <DetailSection title={selected.mainFunctions ? 'Main Functions' : 'Location'}>
        {selected.mainFunctions ? (
          <MainFunctions items={selected.mainFunctions} />
        ) : (
          <p>{selected.location}</p>
        )}
      </DetailSection>

      <DetailSection
        title={selected.workingPrinciple ? 'Working Principle' : 'Maintenance overview'}
      >
        <p>{selected.workingPrinciple || selected.maintenance}</p>
      </DetailSection>

      <button className="primary" onClick={() => viewer.toggle('isolated')}>
        {viewer.isolated ? 'Show assembly' : 'Isolate component'} ↗
      </button>

      <button onClick={() => isHidden ? viewer.show(selected.id) : viewer.hide()}>
        {isHidden ? 'Show component' : 'Hide component'}
      </button>
    </aside>
  );
}
