// Laboratorio B · Etapa 1 · Navegación accesible en una SPA con React Router
// Tres páginas del Canal de denuncias. Esta aplicación tiene 6 barreras a propósito.
// Guía: laboratorios/laboratorio-B.md · Comprobador: «Laboratorio B · Etapa 1»

const { HashRouter, Routes, Route, useNavigate, useLocation } = ReactRouterDOM;

const PAGINAS = [
  { ruta: '/', texto: 'Canal de denuncias' },
  { ruta: '/reportar', texto: 'Reporta una denuncia' },
  { ruta: '/mis-denuncias', texto: 'Mis denuncias' },
];

// Barreras 1, 2 y 3 · Un menú hecho con span y sin nombre
function Menu() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <div className="menu">
      <ul>
        {PAGINAS.map((p) => (
          <li key={p.ruta}>
            <span className={pathname === p.ruta ? 'item activo' : 'item'} onClick={() => navigate(p.ruta)}>
              {p.texto}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Barreras 4 y 5 · Cambia el contenido, pero ni el título de la pestaña ni el foco se enteran
function Pagina({ titulo, children }) {
  return (
    <>
      <h1>{titulo}</h1>
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

// Barrera 6 · No hay forma de saltarse la cabecera y el menú
function App() {
  return (
    <HashRouter>
      <header className="cabecera">
        <span className="logo">Logoipsum</span>
        <button type="button">Notificaciones</button>
        <button type="button">Mi perfil</button>
      </header>
      <div className="layout">
        <Menu />
        <main className="contenido">
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
