import type { ReactNode } from 'react';
import { vietnameseModels } from '../vietnamese';
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
    'Tổng quan': 'detail-heading detail-heading--overview',
    'Chức năng chính': 'detail-heading detail-heading--functions',
    'Nguyên lý hoạt động': 'detail-heading detail-heading--principle',
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
  vietnamese,
}: { vietnamese: boolean } & Pick<ComponentDetailsProps, 'modelName' | 'modelOverview'>) {
  return (
    <div className="empty">
      <div>◎</div>
      <span className="category">{vietnamese ? 'TỔNG QUAN MÔ HÌNH' : 'MODEL OVERVIEW'}</span>
      <h2>{modelName || (vietnamese ? 'Mô hình động cơ' : 'Engine model')}</h2>
      <p>{modelOverview || (vietnamese ? 'Thông tin tổng quát về mô hình sẽ được bổ sung tại đây.' : 'General information about this model will be added here.')}</p>
      <p className="details-hint">
        {vietnamese ? 'Chọn một bộ phận để xem nội dung học tập.' : 'Select a component to view its learning details.'}
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
  const language = viewer.language;
  const vietnamese = language === 'vi';
  const hasVietnamese = Boolean(selected?.overviewVi);
  const part = selected && vietnamese && hasVietnamese ? {
    ...selected,
    name: selected.nameVi || selected.name,
    overview: selected.overviewVi,
    mainFunctions: selected.mainFunctionsVi,
    workingPrinciple: selected.workingPrincipleVi,
  } : selected;
  const modelTranslation = vietnamese ? vietnameseModels[modelName] : undefined;
  const informationHeader = (
    <>
      <p className="eyebrow">MODEL INFORMATION</p>
      <label className="information-language">
        <span>{vietnamese ? 'Ngôn ngữ' : 'Language'}</span>
        <select value={language} onChange={(event) => {
          const next = event.target.value === 'vi' ? 'vi' : 'en';
          viewer.setLanguage(next);
        }}>
          <option value="en">English</option>
          <option value="vi">Tiếng Việt</option>
        </select>
      </label>
    </>
  );

  if (!part) {
    return (
      <aside className="details" lang={language}>
        {informationHeader}
        <ModelOverview vietnamese={vietnamese} modelName={modelTranslation?.name || modelName} modelOverview={modelTranslation?.overview || modelOverview} />
      </aside>
    );
  }

  const isHidden = viewer.hidden.includes(part.id);

  return (
    <aside className="details" lang={language}>
      {informationHeader}
      <p className="eyebrow component-details-label">{vietnamese ? 'THÔNG TIN BỘ PHẬN' : 'COMPONENT DETAILS'}</p>
      {vietnamese && !hasVietnamese && <p className="details-hint">Chưa có bản dịch tiếng Việt cho bộ phận này. Nội dung tiếng Anh được hiển thị bên dưới.</p>}

      {part.system && <span className="category">{part.system}</span>}
      <h2>{part.name}</h2>

      <DetailSection title={part.overview ? (vietnamese ? 'Tổng quan' : 'Overview') : (vietnamese ? 'Chức năng' : 'Function')}>
        <p>{part.overview || part.function}</p>
      </DetailSection>

      <DetailSection title={part.mainFunctions ? (vietnamese ? 'Chức năng chính' : 'Main Functions') : (vietnamese ? 'Vị trí' : 'Location')}>
        {part.mainFunctions ? (
          <MainFunctions items={part.mainFunctions} />
        ) : (
          <p>{part.location}</p>
        )}
      </DetailSection>

      <DetailSection
        title={part.workingPrinciple ? (vietnamese ? 'Nguyên lý hoạt động' : 'Working Principle') : (vietnamese ? 'Tổng quan bảo dưỡng' : 'Maintenance overview')}
      >
        <p>{part.workingPrinciple || part.maintenance}</p>
      </DetailSection>

      <button className="primary" onClick={() => viewer.toggle('isolated')}>
        {viewer.isolated ? (vietnamese ? 'Hiện toàn bộ cụm' : 'Show assembly') : (vietnamese ? 'Tách riêng bộ phận' : 'Isolate component')} ↗
      </button>

      <button onClick={() => isHidden ? viewer.show(part.id) : viewer.hide()}>
        {isHidden ? (vietnamese ? 'Hiện bộ phận' : 'Show component') : (vietnamese ? 'Ẩn bộ phận' : 'Hide component')}
      </button>
    </aside>
  );
}
