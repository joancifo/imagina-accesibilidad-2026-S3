// Laboratorio A · Etapa 2 · Modales, foco y avisos
// Paso final de «Reporta una denuncia». Esta página tiene 8 barreras a propósito.
// Guía: laboratorios/laboratorio-A.md · Comprobador: «Laboratorio A · Etapa 2»

const { useState } = React;

// Barreras 1 a 6 · Una «ventana» que solo es un div encima de todo
function ConfirmarSalida({ onSeguir, onSalir }) {
  return (
    <div className="modal-fondo">
      <div className="modal">
        <h2>¿Seguro que quieres salir?</h2>
        <p>Si sales ahora, se perderán los datos que has escrito en la denuncia.</p>
        <div className="modal-acciones">
          <button type="button" onClick={onSeguir}>Seguir rellenando</button>
          <button type="button" className="principal" onClick={onSalir}>Salir sin guardar</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [confirmando, setConfirmando] = useState(false);
  const [aviso, setAviso] = useState('');

  const enviar = () => {
    // Barrera 8 · El aviso se crea a la vez que su mensaje
    setAviso('Tu denuncia D-0043 se ha enviado correctamente.');
    setTimeout(() => setAviso(''), 6000);
  };

  return (
    <>
      {/* Barrera 7 · El fondo sigue «vivo» para el teclado y el lector mientras la ventana está abierta */}
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

      {confirmando && (
        <ConfirmarSalida
          onSeguir={() => setConfirmando(false)}
          onSalir={() => { setConfirmando(false); alert('Has salido del formulario.'); }}
        />
      )}

      {aviso && <div className="toast">{aviso}</div>}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
