// Laboratorio A · Etapa 1 · SOLUCIÓN · Componentes accesibles con Hooks

const { useState, useId } = React;

const DENUNCIAS = [
  { codigo: 'D-0042', fecha: '12/10/2026', estado: 'En revisión' },
  { codigo: 'D-0037', fecha: '28/09/2026', estado: 'Resuelta' },
  { codigo: 'D-0031', fecha: '15/09/2026', estado: 'Enviada' },
];

// El icono es decorativo: el nombre lo pone el botón
function IconoDescarga() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3v12M7 10l5 5 5-5M4 20h16" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// 1 · El disparador es un <button> dentro de un encabezado (no al revés)
// 2 · aria-expanded sale del estado: React lo mantiene al día
// 3 · useId da un id único a cada instancia; el panel existe siempre (hidden)
function Acordeon({ titulo, children, nivel = 3 }) {
  const [abierto, setAbierto] = useState(false);
  const idPanel = useId();
  const Encabezado = `h${nivel}`;
  return (
    <div>
      <Encabezado>
        <button
          type="button"
          className="acordeon-cabecera"
          aria-expanded={abierto}
          aria-controls={idPanel}
          onClick={() => setAbierto(!abierto)}
        >
          {titulo} <span aria-hidden="true">{abierto ? '−' : '+'}</span>
        </button>
      </Encabezado>
      <div id={idPanel} className="acordeon-panel" hidden={!abierto}>
        {children}
      </div>
    </div>
  );
}

function Historial() {
  const [soloPendientes, setSoloPendientes] = useState(false);
  const [compacta, setCompacta] = useState(false);
  const filas = soloPendientes ? DENUNCIAS.filter((d) => d.estado !== 'Resuelta') : DENUNCIAS;

  return (
    <section className="tarjeta" aria-labelledby="titulo-historial">
      <h2 id="titulo-historial">Historial de denuncias</h2>
      <div className="barra">
        {/* 5 · Lo nativo: una casilla de verdad, con su etiqueta */}
        <label className="check-falso">
          <input type="checkbox" checked={soloPendientes} onChange={(e) => setSoloPendientes(e.target.checked)} />
          Solo pendientes
        </label>

        {/* 6 · El estado se anuncia: «Vista compacta, botón, pulsado» */}
        <button type="button" aria-pressed={compacta} onClick={() => setCompacta(!compacta)}>
          Vista compacta
        </button>

        {/* 4 · Nombre accesible en el botón de icono */}
        <button type="button" className="icono" aria-label="Descargar historial" onClick={() => alert('Descargando…')}>
          <IconoDescarga />
        </button>

        {/* 7 · Un botón de verdad, desactivado, con el motivo visible */}
        <button type="button" disabled aria-describedby="motivo-exportar">Exportar</button>
        <span id="motivo-exportar" className="ayuda">No hay denuncias resueltas para exportar.</span>
      </div>

      <table className={compacta ? 'compacta' : ''}>
        <thead>
          <tr><th scope="col">Código</th><th scope="col">Fecha de reporte</th><th scope="col">Estado</th></tr>
        </thead>
        <tbody>
          {filas.map((d) => (
            <tr key={d.codigo}><th scope="row">{d.codigo}</th><td>{d.fecha}</td><td>{d.estado}</td></tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function App() {
  return (
    <>
      <header className="cabecera"><span className="logo">Logoipsum</span></header>
      <main className="contenido">
        <h1>Canal de denuncias</h1>
        <section className="tarjeta" aria-labelledby="titulo-sobre">
          <h2 id="titulo-sobre">Sobre el canal de denuncias</h2>
          <Acordeon titulo="¿Quién puede denunciar?">
            <p>Cualquier persona que trabaje o haya trabajado en la empresa, y también proveedores y clientes.</p>
          </Acordeon>
          <Acordeon titulo="¿Qué puedo denunciar?">
            <p>Acoso laboral, robo o hurto, conducta indebida y agresión.</p>
          </Acordeon>
        </section>
        <Historial />
      </main>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
