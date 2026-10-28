// Laboratorio B · Etapa 2 · Formularios y errores en React
// Paso «Identifícate» de «Reporta una denuncia». Este formulario tiene 7 barreras a propósito.
// Guía: laboratorios/laboratorio-B.md · Comprobador: «Laboratorio B · Etapa 2»

const { useState } = React;

function validar(datos) {
  const errores = {};
  if (!datos.nombre.trim()) errores.nombre = true;
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(datos.email)) errores.email = true;
  if (!/^[0-9]{9}$/.test(datos.telefono)) errores.telefono = true;
  return errores;
}

// Barreras 1 y 2 · La etiqueta es un span suelto y el campo no dice que es obligatorio
// Barreras 4 y 5 · El campo no se marca como no válido y el error es genérico y no está asociado
function Campo({ etiqueta, nombre, tipo = 'text', valor, onCambiar, error }) {
  return (
    <div className="campo">
      <span className="etiqueta">{etiqueta} *</span>
      <input type={tipo} name={nombre} value={valor} onChange={(e) => onCambiar(nombre, e.target.value)} />
      {error && <span className="error">Campo incorrecto</span>}
    </div>
  );
}

function App() {
  const [datos, setDatos] = useState({ nombre: '', email: '', telefono: '' });
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const cambiar = (nombre, valor) => setDatos({ ...datos, [nombre]: valor });
  const hayErrores = Object.keys(validar(datos)).length > 0;

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = validar(datos);
    setErrores(nuevos);
    // Barrera 6 · Con errores, el foco se queda donde estaba: el lector no dice nada
    if (Object.keys(nuevos).length === 0) setEnviado(true);
  };

  return (
    <>
      <header className="cabecera"><span className="logo">Logoipsum</span></header>
      <main className="contenido">
        <h1>Reporta una denuncia</h1>
        <form className="tarjeta" noValidate onSubmit={enviar}>
          <h2>Identifícate</h2>
          <p>Los campos marcados con asterisco (*) son obligatorios.</p>
          <Campo etiqueta="Nombre" nombre="nombre" valor={datos.nombre} onCambiar={cambiar} error={errores.nombre} />
          <Campo etiqueta="Email" nombre="email" tipo="email" valor={datos.email} onCambiar={cambiar} error={errores.email} />
          <Campo etiqueta="Teléfono" nombre="telefono" tipo="tel" valor={datos.telefono} onCambiar={cambiar} error={errores.telefono} />

          {/* Barrera 3 · El botón está desactivado hasta que todo es válido: nadie sabe qué falta */}
          <button type="submit" className="principal" disabled={hayErrores}>Siguiente</button>

          {/* Barrera 7 · El mensaje de éxito aparece de golpe y el lector no lo anuncia */}
          {enviado && <p className="estado">Datos guardados. Puedes pasar al paso 2.</p>}
        </form>
      </main>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
