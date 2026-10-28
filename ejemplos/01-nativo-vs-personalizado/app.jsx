// Ejemplo 1 · Nativo frente a personalizado (temario 3.4 y 3.9)
// Para la demostración en directo: pulsa Tab, Enter y Espacio en cada fila y mira el panel Accessibility (F12).

const { useState } = React;

function BotonDiv({ onClick, children }) {
  return <div className="boton" onClick={onClick}>{children}</div>;                    // ❌ ni foco, ni teclado, ni rol
}

function BotonDivParcheado({ onClick, children }) {
  const alPulsarTecla = (e) => {
    if (e.key === 'Enter') onClick();
    if (e.key === ' ') { e.preventDefault(); onClick(); }
  };
  return <div className="boton" role="button" tabIndex={0} onClick={onClick} onKeyDown={alPulsarTecla}>{children}</div>; // ⚠️ funciona, pero todo a mano
}

function BotonNativo({ onClick, children }) {
  return <button type="button" onClick={onClick}>{children}</button>;                  // ✅ todo gratis
}

function App() {
  const [veces, setVeces] = useState({ div: 0, parche: 0, nativo: 0 });
  const sumar = (k) => setVeces((v) => ({ ...v, [k]: v[k] + 1 }));
  return (
    <main className="contenido">
      <h1>Nativo frente a personalizado</h1>
      <table>
        <thead><tr><th scope="col">Versión</th><th scope="col">Control</th><th scope="col">Pulsaciones</th><th scope="col">Líneas para que sea accesible</th></tr></thead>
        <tbody>
          <tr><th scope="row">1 · div con onClick</th><td><BotonDiv onClick={() => sumar('div')}>Guardar borrador</BotonDiv></td><td>{veces.div}</td><td>No lo es</td></tr>
          <tr><th scope="row">2 · div «parcheado»</th><td><BotonDivParcheado onClick={() => sumar('parche')}>Guardar borrador</BotonDivParcheado></td><td>{veces.parche}</td><td>role + tabIndex + onKeyDown (Enter y Espacio)</td></tr>
          <tr><th scope="row">3 · button</th><td><BotonNativo onClick={() => sumar('nativo')}>Guardar borrador</BotonNativo></td><td>{veces.nativo}</td><td>Ninguna</td></tr>
        </tbody>
      </table>
      <p>Y aun así el «parcheado» no envía formularios, no respeta <code>disabled</code> y no se activa al soltar el Espacio como un botón real.</p>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
