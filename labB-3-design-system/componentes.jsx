// Laboratorio B · Etapa 3 · Biblioteca de componentes (nuestro mini Design System)
// Estos componentes se usan en TODA la aplicación: lo que arregles aquí se arregla en todas partes.
// Esta biblioteca tiene 8 anti-patrones a propósito. Solo hace falta tocar ESTE archivo.
// Guía: laboratorios/laboratorio-B.md · Comprobador: «Laboratorio B · Etapa 3»
//
// Ojo: aquí usamos React.useId, React.useState… (sin «const { … } = React») porque
// app.jsx ya declara esos nombres y los dos archivos comparten el mismo ámbito global.

// Barrera 2 (1 de 2) · El icono se lee como imagen sin nombre
function Icono({ nombre }) {
  const trazos = {
    lapiz: 'M4 20h4L19 9l-4-4L4 16v4z',
    papelera: 'M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13',
  };
  return (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path d={trazos[nombre]} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// Barrera 1 · Un «botón» que es un div: ni foco, ni Enter, ni Espacio, ni rol
function Boton({ children, onClick, variante = 'secundario' }) {
  return (
    <div className={`boton ${variante}`} onClick={onClick}>
      {children}
    </div>
  );
}

// Barrera 2 (2 de 2) · Botón de solo icono: recibe «etiqueta» pero no la usa
// Barrera 8 · Alguien quitó el contorno del foco «porque quedaba feo»
function BotonIcono({ icono, etiqueta, onClick }) {
  return (
    <button type="button" className="boton-icono" style={{ outline: 'none' }} onClick={onClick}>
      <Icono nombre={icono} />
    </button>
  );
}

// Barrera 3 · Un enlace sin href: no se puede alcanzar con Tab ni abrir en otra pestaña
function Enlace({ a, children }) {
  return (
    <a className="enlace" onClick={() => { window.location.hash = a; }}>
      {children}
    </a>
  );
}

// Barrera 4 · El título de la tarjeta parece un encabezado, pero es un div
function Tarjeta({ titulo, children }) {
  return (
    <section className="tarjeta">
      <div className="titulo-tarjeta">{titulo}</div>
      {children}
    </section>
  );
}

// Barrera 5 · Un interruptor que solo existe para quien mira la pantalla
function Interruptor({ etiqueta, activo, onCambiar }) {
  return (
    <div className="interruptor-fila">
      <span>{etiqueta}</span>
      <div className={activo ? 'interruptor on' : 'interruptor'} onClick={() => onCambiar(!activo)} />
    </div>
  );
}

// Barrera 6 · El placeholder hace de etiqueta (desaparece al escribir y no es un nombre fiable)
// Barrera 7 · tabIndex positivo: rompe el orden del foco de toda la página
function CampoBusqueda({ etiqueta, valor, onCambiar }) {
  return (
    <input
      type="text"
      className="busqueda"
      tabIndex={1}
      placeholder={etiqueta}
      value={valor}
      onChange={(e) => onCambiar(e.target.value)}
    />
  );
}
