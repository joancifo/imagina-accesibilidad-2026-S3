// Laboratorio B · Etapa 3 · SOLUCIÓN · Biblioteca de componentes accesible
// Cada componente lleva su «contrato de accesibilidad»: quien lo usa no puede olvidarse de él.

// 2 · El icono es decorativo: el nombre lo pone el botón
function Icono({ nombre }) {
  const trazos = {
    lapiz: 'M4 20h4L19 9l-4-4L4 16v4z',
    papelera: 'M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13',
  };
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path d={trazos[nombre]} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// 1 · Un <button> de verdad: foco, Enter, Espacio y rol gratis
function Boton({ children, onClick, variante = 'secundario', tipo = 'button' }) {
  return (
    <button type={tipo} className={`boton ${variante}`} onClick={onClick}>
      {children}
    </button>
  );
}

// 2 · La etiqueta es obligatoria y se convierte en el nombre accesible
// 8 · Sin style={{ outline: 'none' }}: el foco visible lo pone estilos.css (:focus-visible)
function BotonIcono({ icono, etiqueta, onClick }) {
  if (!etiqueta) console.error('BotonIcono necesita «etiqueta»: es su nombre accesible.');
  return (
    <button type="button" className="boton-icono" aria-label={etiqueta} onClick={onClick}>
      <Icono nombre={icono} />
    </button>
  );
}

// 3 · Un enlace con href: se alcanza con Tab, se abre con Enter y en otra pestaña
function Enlace({ a, children }) {
  return (
    <a className="enlace" href={`#${a}`}>
      {children}
    </a>
  );
}

// 4 · El título es un encabezado de verdad; el nivel se elige al usarlo (por defecto, h2)
function Tarjeta({ titulo, nivel = 2, children }) {
  const Encabezado = `h${nivel}`;
  return (
    <section className="tarjeta">
      <Encabezado className="titulo-tarjeta">{titulo}</Encabezado>
      {children}
    </section>
  );
}

// 5 · Un interruptor de verdad: botón con role="switch", aria-checked y nombre
function Interruptor({ etiqueta, activo, onCambiar }) {
  const id = React.useId();
  return (
    <div className="interruptor-fila">
      <span id={id}>{etiqueta}</span>
      <button
        type="button"
        role="switch"
        aria-checked={activo}
        aria-labelledby={id}
        className={activo ? 'interruptor on' : 'interruptor'}
        onClick={() => onCambiar(!activo)}
      />
    </div>
  );
}

// 6 · Etiqueta visible asociada (el placeholder, si acaso, solo como ejemplo)
// 7 · Sin tabIndex: el orden del foco lo marca el orden del código
function CampoBusqueda({ etiqueta, valor, onCambiar }) {
  const id = React.useId();
  return (
    <div className="campo">
      <label htmlFor={id}>{etiqueta}</label>
      <input
        id={id}
        type="search"
        className="busqueda"
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
      />
    </div>
  );
}
