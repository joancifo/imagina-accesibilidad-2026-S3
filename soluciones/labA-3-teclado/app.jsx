// Laboratorio A · Etapa 3 · SOLUCIÓN · Teclado en componentes complejos: pestañas y menú desplegable
// Patrones del APG (WAI-ARIA Authoring Practices): «Tabs» con activación automática y «Disclosure».

const { useState, useId, useRef, useEffect } = React;

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

// 1 · role="tablist" con nombre · 2 · role="tab" + aria-selected
// 4 · «Roving tabindex»: solo la pestaña activa está en el orden de Tab
// 5 · Flechas izquierda/derecha (con vuelta), Inicio y Fin
function Pestanas({ activa, onCambiar, idBase }) {
  const refs = useRef([]);

  const alPulsarTecla = (e, i) => {
    const ultimo = PESTANAS.length - 1;
    let destino = null;
    if (e.key === 'ArrowRight') destino = i === ultimo ? 0 : i + 1;
    if (e.key === 'ArrowLeft') destino = i === 0 ? ultimo : i - 1;
    if (e.key === 'Home') destino = 0;
    if (e.key === 'End') destino = ultimo;
    if (destino === null) return;
    e.preventDefault();
    onCambiar(PESTANAS[destino]);       // activación automática: mover = seleccionar
    refs.current[destino].focus();
  };

  return (
    <div className="pestanas" role="tablist" aria-label="Filtrar denuncias">
      {PESTANAS.map((p, i) => {
        const seleccionada = p === activa;
        return (
          <button
            key={p}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="tab"
            id={`${idBase}-pestana-${i}`}
            aria-selected={seleccionada}
            aria-controls={`${idBase}-panel`}
            tabIndex={seleccionada ? 0 : -1}
            className={seleccionada ? 'pestana activa' : 'pestana'}
            onClick={() => onCambiar(p)}
            onKeyDown={(e) => alPulsarTecla(e, i)}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}

// 6 · Un <button> con aria-expanded y aria-controls
// 7 · Al abrir, el foco va a la primera opción
// 8 · Escape cierra y devuelve el foco al botón (y también al elegir una opción)
function MenuOrdenar({ orden, onElegir }) {
  const [abierto, setAbierto] = useState(false);
  const idLista = useId();
  const disparador = useRef(null);
  const lista = useRef(null);

  useEffect(() => {
    if (abierto) lista.current.querySelector('button').focus();
  }, [abierto]);

  const cerrar = () => {
    setAbierto(false);
    disparador.current.focus();
  };

  const alPulsarTecla = (e) => {
    if (e.key === 'Escape' && abierto) {
      e.preventDefault();
      cerrar();
    }
  };

  return (
    <div className="desplegable" onKeyDown={alPulsarTecla}>
      <button
        ref={disparador}
        type="button"
        className="boton"
        aria-expanded={abierto}
        aria-controls={idLista}
        onClick={() => setAbierto(!abierto)}
      >
        Ordenar: {orden} <span aria-hidden="true">▾</span>
      </button>
      <ul id={idLista} className="opciones" hidden={!abierto} ref={lista}>
        {ORDENES.map((o) => (
          <li key={o}>
            <button type="button" aria-current={o === orden ? 'true' : undefined} onClick={() => { onElegir(o); cerrar(); }}>
              {o}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [pestana, setPestana] = useState('Todas');
  const [orden, setOrden] = useState('Más recientes');
  const idBase = useId();
  const filas = ordenar(filtrar(DENUNCIAS, pestana), orden);
  const indice = PESTANAS.indexOf(pestana);

  return (
    <>
      <header className="cabecera"><span className="logo">Logoipsum</span></header>
      <main className="contenido">
        <h1>Mis denuncias</h1>
        <div className="barra">
          <Pestanas activa={pestana} onCambiar={setPestana} idBase={idBase} />
          <MenuOrdenar orden={orden} onElegir={setOrden} />
        </div>

        {/* 3 · El panel es un tabpanel unido a su pestaña (y se puede alcanzar con Tab) */}
        <div className="tarjeta" role="tabpanel" id={`${idBase}-panel`} aria-labelledby={`${idBase}-pestana-${indice}`} tabIndex={0}>
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
