// Ejemplo 2 · Un hook reutilizable para anunciar mensajes (temario 3.3, 3.7 y 3.16)
// La región viva se monta UNA vez, al cargar la aplicación. Los componentes solo llaman a anunciar().

const { useState, useRef, useCallback, createContext, useContext } = React;

const ContextoAnuncios = createContext(() => {});

function ProveedorDeAnuncios({ children }) {
  const [educado, setEducado] = useState('');
  const [urgente, setUrgente] = useState('');
  const temporizador = useRef(null);

  const anunciar = useCallback((mensaje, prioridad = 'educado') => {
    const poner = prioridad === 'urgente' ? setUrgente : setEducado;
    poner('');                                             // vaciar primero: así se repite aunque el texto sea igual
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => poner(mensaje), 100);
  }, []);

  return (
    <ContextoAnuncios.Provider value={anunciar}>
      {children}
      <div className="sr-only" role="status">{educado}</div>
      <div className="sr-only" role="alert">{urgente}</div>
    </ContextoAnuncios.Provider>
  );
}

const useAnunciar = () => useContext(ContextoAnuncios);

function Borradores() {
  const anunciar = useAnunciar();
  const [lista, setLista] = useState(['B-118', 'B-121', 'B-124']);
  const eliminar = (codigo) => {
    setLista(lista.filter((c) => c !== codigo));
    anunciar(`Borrador ${codigo} eliminado. Quedan ${lista.length - 1}.`);
  };
  return (
    <section className="tarjeta">
      <h2>Borradores</h2>
      <ul>
        {lista.map((c) => (
          <li key={c}>{c} <button type="button" onClick={() => eliminar(c)}>Eliminar {c}</button></li>
        ))}
      </ul>
      <button type="button" onClick={() => anunciar('No se ha podido conectar con el servidor.', 'urgente')}>Simular error de conexión</button>
    </section>
  );
}

function App() {
  return (
    <ProveedorDeAnuncios>
      <main className="contenido">
        <h1>useAnunciar: una región viva para toda la aplicación</h1>
        <Borradores />
      </main>
    </ProveedorDeAnuncios>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
