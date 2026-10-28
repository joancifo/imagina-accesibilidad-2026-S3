// Laboratorio B · Etapa 1 · SOLUCIÓN · Navegación accesible en una SPA con React Router

const { useEffect, useRef } = React;
const { HashRouter, Routes, Route, NavLink } = ReactRouterDOM;

const PAGINAS = [
  { ruta: '/', texto: 'Canal de denuncias' },
  { ruta: '/reportar', texto: 'Reporta una denuncia' },
  { ruta: '/mis-denuncias', texto: 'Mis denuncias' },
];

// 1 · Enlaces de verdad (NavLink) · 2 · NavLink pone aria-current="page" al activo · 3 · nav con nombre
function Menu() {
  return (
    <nav className="menu" aria-label="Menú principal">
      <ul>
        {PAGINAS.map((p) => (
          <li key={p.ruta}>
            <NavLink to={p.ruta} end>{p.texto}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// 4 · Título de la pestaña por página · 5 · Foco al h1 al cambiar de página (no en la primera carga)
let primeraCarga = true;

function Pagina({ titulo, children }) {
  const encabezado = useRef(null);
  useEffect(() => {
    document.title = `${titulo} · Canal de denuncias`;
    if (primeraCarga) {
      primeraCarga = false;
    } else {
      encabezado.current.focus();
    }
  }, [titulo]);
  return (
    <>
      <h1 ref={encabezado} tabIndex={-1}>{titulo}</h1>
      {children}
    </>
  );
}

function Inicio() {
  return (
    <Pagina titulo="Canal de denuncias">
      <p>Comunica cualquier irregularidad de forma segura y, si quieres, anónima.</p>
    </Pagina>
  );
}

function Reportar() {
  return (
    <Pagina titulo="Reporta una denuncia">
      <p>Paso 1 de 3 · Identifícate o elige denunciar de forma anónima.</p>
      <button type="button" className="principal">Empezar</button>
    </Pagina>
  );
}

function MisDenuncias() {
  return (
    <Pagina titulo="Mis denuncias">
      <p>Tienes 3 denuncias: 1 resuelta y 2 pendientes.</p>
    </Pagina>
  );
}

// 6 · Enlace para saltar al contenido. Con HashRouter, href="#contenido" cambiaría de ruta:
//     movemos el foco nosotros y evitamos la navegación.
function SaltarAlContenido({ destino }) {
  const saltar = (e) => {
    e.preventDefault();
    destino.current.focus();
  };
  return <a className="saltar" href="#contenido" onClick={saltar}>Saltar al contenido principal</a>;
}

function App() {
  const principal = useRef(null);
  return (
    <HashRouter>
      <SaltarAlContenido destino={principal} />
      <header className="cabecera">
        <span className="logo">Logoipsum</span>
        <button type="button">Notificaciones</button>
        <button type="button">Mi perfil</button>
      </header>
      <div className="layout">
        <Menu />
        <main className="contenido" id="contenido" tabIndex={-1} ref={principal}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/reportar" element={<Reportar />} />
            <Route path="/mis-denuncias" element={<MisDenuncias />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
