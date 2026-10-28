// Laboratorio A · Etapa 2 · SOLUCIÓN ALTERNATIVA con <dialog> nativo
// showModal() hace inerte el fondo, cierra con Escape y devuelve el foco al cerrar.
// Para probarla: copia este archivo encima de lab2-modal/app.jsx.

const { useState, useEffect, useRef, useId } = React;

// El <dialog> está siempre montado: se abre con showModal() y se cierra con close().
// Así el navegador puede devolver el foco al botón que lo abrió.
function ConfirmarSalida({ abierto, onSeguir, onSalir }) {
  const idTitulo = useId();
  const idTexto = useId();
  const dialogo = useRef(null);

  useEffect(() => {
    const d = dialogo.current;
    if (abierto && !d.open) d.showModal();     // modal de verdad: fondo inerte, foco dentro
    if (!abierto && d.open) d.close();         // al cerrar, el foco vuelve a quien lo abrió
  }, [abierto]);

  useEffect(() => {
    const d = dialogo.current;
    // Escape (o cualquier otro cierre) dispara «close»: avisamos a React para que el estado cuadre
    const alCerrar = () => onSeguir();
    d.addEventListener('close', alCerrar);
    return () => d.removeEventListener('close', alCerrar);
  }, []);

  return (
    <dialog ref={dialogo} className="modal" aria-labelledby={idTitulo} aria-describedby={idTexto}>
      <h2 id={idTitulo}>¿Seguro que quieres salir?</h2>
      <p id={idTexto}>Si sales ahora, se perderán los datos que has escrito en la denuncia.</p>
      <div className="modal-acciones">
        <button type="button" onClick={onSeguir}>Seguir rellenando</button>
        <button type="button" className="principal" onClick={onSalir}>Salir sin guardar</button>
      </div>
    </dialog>
  );
}

function App() {
  const [confirmando, setConfirmando] = useState(false);
  const [aviso, setAviso] = useState('');

  const enviar = () => {
    setAviso('Tu denuncia D-0043 se ha enviado correctamente.');
    setTimeout(() => setAviso(''), 6000);
  };

  return (
    <>
      <div id="fondo">
        <header className="cabecera"><span className="logo">Logoipsum</span></header>
        <main className="contenido">
          <h1>Reporta una denuncia</h1>
          <section className="tarjeta">
            <h2>Paso 3 de 3 · Adjunta documentos</h2>
            <p>Revisa los datos antes de enviar. Puedes adjuntar documentos en PDF o imagen (máximo 10 MB).</p>
            <div className="barra">
              <button type="button" onClick={() => setConfirmando(true)}>Cancelar</button>
              <button type="button" className="principal" onClick={enviar}>Enviar denuncia</button>
            </div>
          </section>
        </main>
      </div>

      <ConfirmarSalida
        abierto={confirmando}
        onSeguir={() => setConfirmando(false)}
        onSalir={() => { setConfirmando(false); alert('Has salido del formulario.'); }}
      />

      <div className="toast" role="status">{aviso}</div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
