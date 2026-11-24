import { useRef } from 'react';

// Ícone 3D "EdST": uma peça com espessura (camadas empilhadas em Z) que flutua girando
// e inclina na direção do mouse. Com movimento reduzido fica parada.
const DEPTH = 14;

export default function Monogram3D({ size = 64 }) {
  const ref = useRef(null);

  const onMove = e => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--tx', `${(-y * 30).toFixed(1)}deg`);
    el.style.setProperty('--ty', `${(x * 40).toFixed(1)}deg`);
  };
  const onLeave = () => {
    ref.current?.style.removeProperty('--tx');
    ref.current?.style.removeProperty('--ty');
  };

  return (
    <span className="mono" ref={ref} style={{ '--size': `${size}px` }} onPointerMove={onMove} onPointerLeave={onLeave} aria-hidden="true">
      <span className="mono__tilt">
        <span className="mono__spin">
          {Array.from({ length: DEPTH }, (_, i) => (
            <span key={i} className="mono__layer mono__layer--side" style={{ '--z': `${-i - 1}px`, '--i': i / DEPTH }} />
          ))}
          <span className="mono__layer mono__layer--back" style={{ '--z': `${-DEPTH - 1}px` }} />
          <span className="mono__layer mono__layer--front" style={{ '--z': '0px' }}>
            <span className="mono__text">
              Ed<em>ST</em>
            </span>
          </span>
        </span>
      </span>
      <span className="mono__shadow" />
    </span>
  );
}
