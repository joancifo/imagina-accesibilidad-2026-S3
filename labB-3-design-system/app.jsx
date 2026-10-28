// Laboratorio B · Etapa 3 · Página «Mi espacio», construida SOLO con la biblioteca de componentes.
// No hace falta tocar este archivo: las barreras están en componentes.jsx.

const { useState } = React;

const BORRADORES_INICIALES = [
  { codigo: 'B-118', asunto: 'Horas extra sin registrar' },
  { codigo: 'B-121', asunto: 'Acceso a datos de clientes' },
  { codigo: 'B-124', asunto: 'Regalos de un proveedor' },
];

function App() {
  const [busqueda, setBusqueda] = useState('');
  const [borradores, setBorradores] = useState(BORRADORES_INICIALES);
  const [avisos, setAvisos] = useState({ email: true, sms: false });
  const [estado, setEstado] = useState('');

  const visibles = borradores.filter((b) =>
    `${b.codigo} ${b.asunto}`.toLowerCase().includes(busqueda.toLowerCase()));

  const eliminar = (codigo) => {
    setBorradores(borradores.filter((b) => b.codigo !== codigo));
    setEstado(`Borrador ${codigo} eliminado.`);
  };

  const nuevo = () => {
    const codigo = `B-${130 + borradores.length}`;
    setBorradores([...borradores, { codigo, asunto: 'Borrador sin título' }]);
    setEstado(`Borrador ${codigo} creado.`);
  };

  return (
    <>
      <header className="cabecera">
        <span className="logo">Logoipsum</span>
        <Enlace a="/ayuda">Ayuda</Enlace>
      </header>
      <main className="contenido">
        <h1>Mi espacio</h1>

        <Tarjeta titulo="Borradores sin enviar">
          <CampoBusqueda etiqueta="Buscar borrador" valor={busqueda} onCambiar={setBusqueda} />
          <ul className="lista-borradores">
            {visibles.map((b) => (
              <li key={b.codigo}>
                <span>{b.codigo} · {b.asunto}</span>
                <BotonIcono icono="lapiz" etiqueta={`Editar ${b.codigo}`} onClick={() => setEstado(`Editando ${b.codigo}.`)} />
                <BotonIcono icono="papelera" etiqueta={`Eliminar ${b.codigo}`} onClick={() => eliminar(b.codigo)} />
              </li>
            ))}
          </ul>
          <Boton variante="principal" onClick={nuevo}>Nuevo borrador</Boton>
        </Tarjeta>

        <Tarjeta titulo="Preferencias de aviso">
          <Interruptor etiqueta="Avisarme por email" activo={avisos.email} onCambiar={(v) => setAvisos({ ...avisos, email: v })} />
          <Interruptor etiqueta="Avisarme por SMS" activo={avisos.sms} onCambiar={(v) => setAvisos({ ...avisos, sms: v })} />
          <Boton onClick={() => setEstado('Preferencias guardadas.')}>Guardar preferencias</Boton>
        </Tarjeta>

        <p className="pie"><Enlace a="/privacidad">Política de privacidad</Enlace></p>

        {/* Esto ya está bien: región viva montada desde el principio */}
        <p className="estado" role="status">{estado}</p>
      </main>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
