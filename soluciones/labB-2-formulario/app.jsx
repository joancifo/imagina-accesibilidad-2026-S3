// Laboratorio B · Etapa 2 · SOLUCIÓN · Formularios y errores en React

const { useState, useId, useRef } = React;

const MENSAJES = {
  nombre: 'Debes rellenar este campo.',
  email: 'Introduce un email válido. Ejemplo: maria@empresa.com',
  telefono: 'Introduce un teléfono de 9 dígitos, sin espacios.',
};

function validar(datos) {
  const errores = {};
  if (!datos.nombre.trim()) errores.nombre = MENSAJES.nombre;
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(datos.email)) errores.email = MENSAJES.email;
  if (!/^[0-9]{9}$/.test(datos.telefono)) errores.telefono = MENSAJES.telefono;
  return errores;
}

// Un componente de campo reutilizable: el contrato de accesibilidad vive aquí, una sola vez
const Campo = React.forwardRef(function Campo({ etiqueta, nombre, tipo = 'text', ayuda, autoComplete, valor, onCambiar, error }, ref) {
  const id = useId();                       // 1 · etiqueta asociada con htmlFor + id único
  const idAyuda = `${id}-ayuda`;
  const idError = `${id}-error`;
  const describe = [ayuda && idAyuda, error && idError].filter(Boolean).join(' ') || undefined;
  return (
    <div className="campo">
      <label htmlFor={id}>{etiqueta} <span aria-hidden="true">*</span></label>
      {ayuda && <p className="ayuda" id={idAyuda}>{ayuda}</p>}
      <input
        ref={ref}
        id={id}
        type={tipo}
        name={nombre}
        autoComplete={autoComplete}
        required                                  // 2 · obligatorio, también para el lector
        aria-invalid={error ? true : undefined}   // 3 · marcado como no válido
        aria-describedby={describe}               // 4 · ayuda + error asociados
        value={valor}
        onChange={(e) => onCambiar(nombre, e.target.value)}
      />
      {error && <p className="error" id={idError}>⚠ {error}</p>}
    </div>
  );
});

function App() {
  const [datos, setDatos] = useState({ nombre: '', email: '', telefono: '' });
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState('');
  const refs = { nombre: useRef(null), email: useRef(null), telefono: useRef(null) };

  const cambiar = (nombre, valor) => setDatos({ ...datos, [nombre]: valor });

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = validar(datos);
    setErrores(nuevos);
    const primero = ['nombre', 'email', 'telefono'].find((n) => nuevos[n]);
    if (primero) {
      refs[primero].current.focus();          // 5 · el foco va al primer campo con error
      setEstado('');
    } else {
      setEstado('Datos guardados. Puedes pasar al paso 2.');
    }
  };

  return (
    <>
      <header className="cabecera"><span className="logo">Logoipsum</span></header>
      <main className="contenido">
        <h1>Reporta una denuncia</h1>
        <form className="tarjeta" noValidate onSubmit={enviar} aria-labelledby="titulo-paso">
          <h2 id="titulo-paso">Identifícate</h2>
          <p>Los campos marcados con asterisco (*) son obligatorios.</p>
          <Campo ref={refs.nombre} etiqueta="Nombre" nombre="nombre" autoComplete="given-name" valor={datos.nombre} onCambiar={cambiar} error={errores.nombre} />
          <Campo ref={refs.email} etiqueta="Email" nombre="email" tipo="email" autoComplete="email" ayuda="Ejemplo: maria@empresa.com" valor={datos.email} onCambiar={cambiar} error={errores.email} />
          <Campo ref={refs.telefono} etiqueta="Teléfono" nombre="telefono" tipo="tel" autoComplete="tel" ayuda="9 dígitos, sin espacios." valor={datos.telefono} onCambiar={cambiar} error={errores.telefono} />

          {/* 6 · El botón siempre está activo: al pulsarlo, la persona descubre qué falta */}
          <button type="submit" className="principal">Siguiente</button>

          {/* 7 · Región viva montada desde el principio */}
          <p className="estado" role="status">{estado}</p>
        </form>
      </main>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
