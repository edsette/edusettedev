// Mockups abstratos de landing page na paleta do site (sem imagens de clientes).
const KINDS = {
  portfolio: { bg: '#5E6339', page: '#FBFAF6', ink: '#1E1E1A', cta: '#5E6339', cols: ['#C9A97E', '#454A2A', '#B08D57'] },
  restaurant: { bg: '#C9A97E', page: '#2F331D', ink: '#F3EFE6', cta: '#B08D57', cols: ['#5E6339', '#B08D57', '#454A2A'] },
  local: { bg: '#E4DDCD', page: '#5E6339', ink: '#F3EFE6', cta: '#F3EFE6', cols: ['#454A2A', '#C9A97E', '#2F331D'] },
};

export default function TemplatePreview({ kind = 'portfolio', mini = false }) {
  const k = KINDS[kind] || KINDS.portfolio;
  return (
    <span className="mock" aria-hidden="true" style={{ background: k.bg, ...(mini ? { padding: '14% 10% 0' } : null) }}>
      <span className="mock__page" style={{ background: k.page, color: k.ink }}>
        {!mini && (
          <span className="mock__bar">
            <i />
            <i />
            <i />
          </span>
        )}
        <span className="mock__hero">
          <span className="mock__h" style={{ width: '72%' }} />
          <span className="mock__h" style={{ width: '48%' }} />
          {!mini && <span className="mock__t" style={{ width: '60%', marginTop: 4 }} />}
          <span className="mock__cta" style={{ background: k.cta }} />
        </span>
        <span className="mock__cols">
          {k.cols.map(c => (
            <i key={c} style={{ background: c }} />
          ))}
        </span>
      </span>
    </span>
  );
}
