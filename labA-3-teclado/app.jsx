// Laboratorio A · Etapa 3 · Teclado en componentes complejos: pestañas y menú desplegable
// «Mis denuncias» del Canal de denuncias. Esta página tiene 8 barreras a propósito.
// Guía: laboratorios/laboratorio-A.md · Comprobador: «Laboratorio A · Etapa 3»

const { useState } = React;

const DENUNCIAS = [
  { codigo: 'D-2041', asunto: 'Uso indebido de material', fecha: '2026-10-12', estado: 'Pendiente' },
  { codigo: 'D-2038', asunto: 'Trato inadecuado en una reunión', fecha: '2026-10-05', estado: 'Resuelta' },
  { codigo: 'D-2033', asunto: 'Gastos sin justificar', fecha: '2026-09-28', estado: 'Pendiente' },
  { codigo: 'D-2027', asunto: 'Conflicto de intereses', fecha: '2026-09-15', estado: 'Resuelta' },
];

const PESTANAS = ['Todas', 'Pendientes', 'Resueltas'];
const ORDENES = ['Más recientes', 'Más antiguas', 'Por código'];

function filtrar(lista, pestana) {
  if (pestana === 'Pendientes') return lista.filter((d) => d.estado === 'Pendiente');
  if (pestana === 'Resueltas') return lista.filter((d) => d.estado === 'Resuelta');
  return lista;
}

function ordenar(lista, orden) {
  const copia = [...lista];
  if (orden === 'Más recientes') copia.sort((a, b) => b.fecha.localeCompare(a.fecha));
  if (orden === 'Más antiguas') copia.sort((a, b) => a.fecha.localeCompare(b.fecha));
  if (orden === 'Por código') copia.sort((a, b) => a.codigo.localeCompare(b.codigo));
  return copia;
}

// Barrera 1 · El grupo de pestañas no es una lista de pestañas y no tiene nombre
// Barrera 2 · Cada pestaña es un div: no tiene rol ni dice cuál está seleccionada
// Barrera 4 · Con Tab no se llega a ninguna pestaña
// Barrera 5 · Las flechas no hacen nada
function Pestanas({ activa, onCambiar }) {
  return (
    <div className="pestanas">
      {PESTANAS.map((p) => (
        <div key={p} className={p === activa ? 'pestana activa' : 'pestana'} onClick={() => onCambiar(p)}>
          {p}
        </div>
      ))}
    </div>
  );
}

// Barrera 6 · El botón que abre el menú es un span y no dice si está abierto
// Barrera 7 · Al abrir el menú, el foco no entra en las opciones
// Barrera 8 · Escape no cierra el menú y el foco no vuelve al botón
function MenuOrdenar({ orden, onElegir }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="desplegable">
      <span className="boton" onClick={() => setAbierto(!abierto)}>
        Ordenar: {orden} ▾
      </span>
      {abierto && (
        <ul className="opciones">
          {ORDENES.map((o) => (
            <li key={o}>
              <button type="button" onClick={() => { onElegir(o); setAbierto(false); }}>{o}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function App() {
  const [pestana, setPestana] = useState('Todas');
  const [orden, setOrden] = useState('Más recientes');
  const filas = ordenar(filtrar(DENUNCIAS, pestana), orden);

  return (
    <>
      <header className="cabecera"><span className="logo">Logoipsum</span></header>
      <main className="contenido">
        <h1>Mis denuncias</h1>
        <div className="barra">
          <Pestanas activa={pestana} onCambiar={setPestana} />
          <MenuOrdenar orden={orden} onElegir={setOrden} />
        </div>

        {/* Barrera 3 · El panel no está unido a su pestaña */}
        <div className="tarjeta">
          <table>
            <caption className="sr-only">Denuncias · {pestana}</caption>
            <thead>
              <tr><th scope="col">Código</th><th scope="col">Asunto</th><th scope="col">Fecha</th><th scope="col">Estado</th></tr>
            </thead>
            <tbody>
              {filas.map((d) => (
                <tr key={d.codigo}><td>{d.codigo}</td><td>{d.asunto}</td><td>{d.fecha}</td><td>{d.estado}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
