// Laboratorio A · Etapa 2 · SOLUCIÓN · Modales, foco y avisos

const { useState, useEffect, useRef, useId } = React;

// 3.8 · Trampa de foco: Tab y Mayús+Tab no salen del diálogo
const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function ConfirmarSalida({ onSeguir, onSalir, volverA }) {
  const idTitulo = useId();
  const idTexto = useId();
  const dialogo = useRef(null);

  // 3 · Al abrir, el foco entra en el diálogo (en la acción menos destructiva)
  // 6 · Al cerrar, el foco vuelve al botón que lo abrió
  useEffect(() => {
    dialogo.current.querySelector('button').focus();
    const disparador = volverA.current;
    return () => disparador && disparador.focus();
  }, []);

  const alPulsarTecla = (e) => {
    // 4 · Escape cierra
    if (e.key === 'Escape') {
      e.preventDefault();
      onSeguir();
      return;
    }
    // 5 · Trampa de foco
    if (e.key === 'Tab') {
      const elementos = dialogo.current.querySelectorAll(ENFOCABLES);
      const primero = elementos[0];
      const ultimo = elementos[elementos.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }
  };

  return (
    <div className="modal-fondo">
      {/* 1 y 2 · Rol, modalidad, nombre y descripción */}
      <div
        ref={dialogo}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        aria-describedby={idTexto}
        onKeyDown={alPulsarTecla}
      >
        <h2 id={idTitulo}>¿Seguro que quieres salir?</h2>
        <p id={idTexto}>Si sales ahora, se perderán los datos que has escrito en la denuncia.</p>
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
  const botonCancelar = useRef(null);

  const enviar = () => {
    // 8 · Solo cambiamos el texto de una región que ya existe
    setAviso('Tu denuncia D-0043 se ha enviado correctamente.');
    setTimeout(() => setAviso(''), 6000);
  };

  return (
    <>
      {/* 7 · Mientras el diálogo está abierto, el fondo es inerte: ni teclado ni lector
             (React 18: inert="" · React 19: inert={confirmando}) */}
      <div id="fondo" inert={confirmando ? '' : undefined} aria-hidden={confirmando || undefined}>
        <header className="cabecera"><span className="logo">Logoipsum</span></header>
        <main className="contenido">
          <h1>Reporta una denuncia</h1>
          <section className="tarjeta">
            <h2>Paso 3 de 3 · Adjunta documentos</h2>
            <p>Revisa los datos antes de enviar. Puedes adjuntar documentos en PDF o imagen (máximo 10 MB).</p>
            <div className="barra">
              <button type="button" ref={botonCancelar} onClick={() => setConfirmando(true)}>Cancelar</button>
              <button type="button" className="principal" onClick={enviar}>Enviar denuncia</button>
            </div>
          </section>
        </main>
      </div>

      {confirmando && (
        <ConfirmarSalida
          volverA={botonCancelar}
          onSeguir={() => setConfirmando(false)}
          onSalir={() => { setConfirmando(false); alert('Has salido del formulario.'); }}
        />
      )}

      {/* 8 · La región viva se monta una vez, vacía, y nunca se desmonta */}
      <div className="toast" role="status">{aviso}</div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
