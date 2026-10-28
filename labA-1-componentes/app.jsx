// Laboratorio A · Etapa 1 · Componentes accesibles con Hooks
// Canal de denuncias (versión React). Esta página tiene 7 barreras a propósito.
// Guía: laboratorios/laboratorio-A.md · Comprobador: «Laboratorio A · Etapa 1»

const { useState } = React;

const DENUNCIAS = [
  { codigo: 'D-0042', fecha: '12/10/2026', estado: 'En revisión' },
  { codigo: 'D-0037', fecha: '28/09/2026', estado: 'Resuelta' },
  { codigo: 'D-0031', fecha: '15/09/2026', estado: 'Enviada' },
];

function IconoDescarga() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 3v12M7 10l5 5 5-5M4 20h16" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// Barreras 1, 2 y 3 · Un acordeón hecho con un div y un id fijo
function Acordeon({ titulo, children }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div>
      <div className="acordeon-cabecera" onClick={() => setAbierto(!abierto)}>
        {titulo} <span>{abierto ? '−' : '+'}</span>
      </div>
      {abierto && (
        <div id="panel" className="acordeon-panel">
          {children}
        </div>
      )}
    </div>
  );
}

// Barrera 5 · Una casilla «personalizada» hecha con un div
function CasillaFalsa({ texto, marcada, onCambiar }) {
  return (
    <div className="check-falso" onClick={() => onCambiar(!marcada)}>
      <span className="caja">{marcada ? '✓' : ''}</span>
      {texto}
    </div>
  );
}

function Historial() {
  const [soloPendientes, setSoloPendientes] = useState(false);
  const [compacta, setCompacta] = useState(false);
  const filas = soloPendientes ? DENUNCIAS.filter((d) => d.estado !== 'Resuelta') : DENUNCIAS;

  return (
    <section className="tarjeta">
      <h2>Historial de denuncias</h2>
      <div className="barra">
        <CasillaFalsa texto="Solo pendientes" marcada={soloPendientes} onCambiar={setSoloPendientes} />

        {/* Barrera 6 · El estado solo se ve por el color */}
        <button type="button" className={compacta ? 'pulsado' : ''} onClick={() => setCompacta(!compacta)}>
          Vista compacta
        </button>

        {/* Barrera 4 · Botón de icono sin nombre */}
        <button type="button" className="icono" onClick={() => alert('Descargando…')}>
          <IconoDescarga />
        </button>

        {/* Barrera 7 · Parece desactivado, pero es un div */}
        <div className="boton desactivado" title="No hay denuncias resueltas para exportar">
          Exportar
        </div>
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
        <section className="tarjeta">
          <h2>Sobre el canal de denuncias</h2>
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
