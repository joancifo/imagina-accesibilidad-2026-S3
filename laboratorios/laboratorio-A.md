# Laboratorio A · Componentes, modales y teclado en React

**60 minutos · por grupos · temario 3.1 a 3.11 · tres etapas · 23 barreras · comprobador: «A · Etapa 1», «A · Etapa 2» y «A · Etapa 3»**

Tres pantallas del Canal de denuncias hechas en React. Cada una tiene barreras puestas a propósito. Vais a arreglarlas **en orden**: la etapa 1 es la base de la 2 y la 2 es la base de la 3.

| Etapa | Carpeta | Archivo que editáis | Barreras | Tiempo orientativo | Temario |
|---|---|---|---|---|---|
| A1 · Componentes accesibles | `labA-1-componentes` | `app.jsx` | 7 | 18 min | 3.1 – 3.4 · 3.9 – 3.10 |
| A2 · Modal, foco y avisos | `labA-2-modal` | `app.jsx` | 8 | 22 min | 3.5 – 3.8 |
| A3 · Pestañas y menú con teclado | `labA-3-teclado` | `app.jsx` | 8 | 20 min | 3.8 · 3.10 · 3.11 |

**Objetivo:** que cada componente diga **qué es, cómo se llama y en qué estado está** (4.1.2), que funcione **solo con teclado** (2.1.1) y que el **foco** vaya siempre a un sitio lógico (2.4.3).

> Si vuestro grupo va rápido: retos al final de cada etapa. Si va lento: no pasa nada, la etapa 3 es la que se puede quedar a medias. Lo importante es que **todo el grupo** tenga lo mismo y que la persona usuaria lo haya probado.

---

## Etapa A1 · Componentes accesibles (18 min)

Página «Ayuda y estado de tus denuncias»: un acordeón de preguntas frecuentes, un filtro, una vista compacta, un botón de descarga y un botón de exportar.

### Pasos

| Minuto | Paso | Quién |
|---|---|---|
| 0 – 1 | Repartid roles. Abrid `labA-1-componentes/index.html` con Live Server. | Portavoz |
| 1 – 4 | **El «antes».** Sin ratón: ¿podéis abrir «¿Quién puede denunciar?»? ¿Marcar «Solo pendientes»? ¿Qué dice el lector en el botón del icono? | Persona usuaria · Auditoría anota |
| 4 – 14 | **Arreglad** las barreras 1 a 7, de una en una. | Piloto explica · todos editan |
| 14 – 16 | **Comprobador** → «A · Etapa 1». | Auditoría |
| 16 – 18 | **El «después»** con teclado y lector. Chat: «Grupo N · A1 · X/7». | Persona usuaria · Portavoz |

### Barreras

| # | Barrera | Qué hacer | WCAG |
|---|---|---|---|
| 1 | La cabecera del acordeón es un `div` con `onClick` | `<h3><button type="button" …>` | 4.1.2 · 1.3.1 |
| 2 | No dice si está abierto o cerrado | `aria-expanded={abierto}` + `aria-controls` | 4.1.2 |
| 3 | El panel usa `id="panel"` fijo y desaparece al cerrarse | `const idPanel = useId();` y `hidden={!abierto}` | 4.1.2 |
| 4 | El botón de descarga no tiene nombre | `aria-label="Descargar historial"` + `aria-hidden="true"` en el svg | 1.1.1 · 4.1.2 |
| 5 | «Solo pendientes» es un `div` que imita una casilla | `<label><input type="checkbox" …/> Solo pendientes</label>` | 2.1.1 · 4.1.2 |
| 6 | «Vista compacta» solo cambia de color | `aria-pressed={compacta}` | 4.1.2 · 1.4.1 |
| 7 | «Exportar» parece desactivado, pero es un `div` | `<button type="button" disabled>` + motivo en texto visible | 4.1.2 |

### Chuleta

```jsx
function Acordeon({ titulo, nivel = 3, children }) {
  const [abierto, setAbierto] = useState(false);
  const idPanel = useId();                 // un id único por cada acordeón
  const Encabezado = `h${nivel}`;
  return (
    <div>
      <Encabezado>
        <button type="button" className="acordeon-cabecera"
                aria-expanded={abierto} aria-controls={idPanel}
                onClick={() => setAbierto(!abierto)}>
          {titulo} <span aria-hidden="true">{abierto ? '−' : '+'}</span>
        </button>
      </Encabezado>
      <div id={idPanel} className="acordeon-panel" hidden={!abierto}>{children}</div>
    </div>
  );
}
```

### Retos (+2 cada uno)

- **Para quien programa:** convertid `Acordeon` en un componente con la prop `nivel` (como en la chuleta) y explicad al grupo por qué el nivel no puede estar fijo dentro del componente.
- **Para quien no programa:** con el lector, decid en voz alta lo que oís en «Vista compacta» antes y después de `aria-pressed`. Apuntadlo en la hoja.

---

## Etapa A2 · Modal, foco y avisos (22 min)

Formulario «Reporta una denuncia»: al pulsar «Cancelar» sale un diálogo «¿Seguro que quieres salir?»; al pulsar «Enviar denuncia» aparece un aviso.

### Pasos

| Minuto | Paso | Quién |
|---|---|---|
| 0 – 1 | **Rotad roles.** Abrid `labA-2-modal/index.html`. | Portavoz |
| 1 – 4 | **El «antes».** Solo teclado: llegad a «Cancelar» y pulsad `Enter`. ¿Dónde está el foco? Pulsad `Tab` 5 veces: ¿dónde acabáis? ¿Cierra `Escape`? Pulsad «Enviar denuncia»: ¿lo dice el lector? | Persona usuaria · Auditoría anota |
| 4 – 18 | **Arreglad** las barreras 1 a 8 en este orden: **8, 1, 2, 3, 6, 4, 5, 7** (de lo más fácil a lo más difícil). | Piloto explica · todos editan |
| 18 – 20 | **Comprobador** → «A · Etapa 2». | Auditoría |
| 20 – 22 | **El «después».** Chat: «Grupo N · A2 · X/8». | Persona usuaria · Portavoz |

### Barreras

| # | Barrera | Qué hacer | WCAG |
|---|---|---|---|
| 1 | La ventana no es un diálogo | `role="dialog"` + `aria-modal="true"` | 4.1.2 · 1.3.1 |
| 2 | El diálogo no tiene nombre ni descripción | `aria-labelledby` (h2) + `aria-describedby` (párrafo) con `useId` | 4.1.2 |
| 3 | Al abrir, el foco se queda detrás | `useEffect` → foco al primer botón | 2.4.3 |
| 4 | `Escape` no cierra | `onKeyDown`: si `e.key === 'Escape'` → `onSeguir()` | 2.1.1 |
| 5 | `Tab` se escapa al fondo | Trampa de foco: del último al primero y al revés | 2.4.3 |
| 6 | Al cerrar, el foco se pierde | Guardar «Cancelar» en un `useRef` y devolverle el foco | 2.4.3 |
| 7 | El fondo sigue «vivo» para el lector | `inert` en el contenedor del fondo | 2.4.3 · 1.3.1 |
| 8 | El aviso de envío no se anuncia | `role="status"` **siempre montado**; solo cambia el texto | 4.1.3 |

### Chuleta

```jsx
function ConfirmarSalida({ onSeguir, onSalir, volverA }) {
  const idTitulo = useId();
  const idTexto = useId();
  const dialogo = useRef(null);

  useEffect(() => {
    const disparador = volverA.current;                 // «Cancelar», guardado con useRef en App
    dialogo.current.querySelector('button').focus();   // 3 · entrar
    return () => disparador.focus();                    // 6 · volver al cerrar
  }, []);

  const alPulsarTecla = (e) => {
    if (e.key === 'Escape') onSeguir();                 // 4 · Escape
    if (e.key !== 'Tab') return;                        // 5 · trampa de foco
    const botones = dialogo.current.querySelectorAll('button');
    const primero = botones[0];
    const ultimo = botones[botones.length - 1];
    if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  };

  return (
    <div className="modal-fondo">
      <div ref={dialogo} className="modal" role="dialog" aria-modal="true"
           aria-labelledby={idTitulo} aria-describedby={idTexto} onKeyDown={alPulsarTecla}>
        <h2 id={idTitulo}>¿Seguro que quieres salir?</h2>
        <p id={idTexto}>Si sales ahora, se perderán los datos que has escrito en la denuncia.</p>
        …
      </div>
    </div>
  );
}

// En App: const botonCancelar = useRef(null); <button ref={botonCancelar} …>Cancelar</button>
//         y <ConfirmarSalida volverA={botonCancelar} … />
<div id="fondo" inert={confirmando ? '' : undefined}>…</div>      // 7 (React 18; en React 19: inert={confirmando})
<div className="toast" role="status">{aviso}</div>                // 8 · siempre montado
```

> **Alternativa moderna:** `<dialog>` nativo abierto con `showModal()` resuelve 1, 4, 5 y 7 solo. Está en `soluciones/labA-2-modal/app-dialog-nativo.jsx`. Los nombres (2) y el foco al entrar y al volver (3 y 6) hay que seguir cuidándolos.

### Retos (+2 cada uno)

- **Para quien programa:** sacad la trampa de foco a un *hook* reutilizable `useTrampaDeFoco(ref)` y usadlo en el diálogo.
- **Para quien programa (pro):** cambiad vuestra solución por el `<dialog>` nativo sin mirar la alternativa. ¿Qué código os habéis podido borrar?
- **Para quien no programa:** decidid entre todos si el aviso «Tu denuncia se ha enviado» debe ser `status` o `alert`, y por qué. Escribid la frase en la hoja.

---

## Etapa A3 · Pestañas y menú con teclado (20 min)

Página «Mis denuncias»: unas pestañas «Todas · Pendientes · Resueltas» y un menú «Ordenar». Ahora mismo **solo funcionan con ratón**.

### Pasos

| Minuto | Paso | Quién |
|---|---|---|
| 0 – 1 | **Rotad roles.** Abrid `labA-3-teclado/index.html`. | Portavoz |
| 1 – 3 | **El «antes».** Solo teclado: ¿podéis llegar a «Pendientes»? ¿Y abrir «Ordenar»? | Persona usuaria |
| 3 – 6 | **Leed juntos** la tabla de teclas de abajo: es el contrato que vais a programar. | Portavoz lee · todos |
| 6 – 16 | **Arreglad** primero el menú (6, 7, 8) y después las pestañas (1 a 5). | Piloto explica · todos editan |
| 16 – 18 | **Comprobador** → «A · Etapa 3». | Auditoría |
| 18 – 20 | **El «después».** Chat: «Grupo N · A3 · X/8». | Persona usuaria · Portavoz |

### El contrato del teclado (APG, WAI-ARIA Authoring Practices)

| Componente | Tecla | Qué pasa |
|---|---|---|
| Pestañas | `Tab` | Entra en la pestaña **activa** (solo una parada) y el siguiente `Tab` va al panel |
| Pestañas | `→` / `←` | Pestaña siguiente / anterior (del final vuelve al principio) y la selecciona |
| Pestañas | `Inicio` / `Fin` | Primera / última pestaña |
| Menú | `Enter` o `Espacio` en «Ordenar» | Abre y lleva el foco a la primera opción |
| Menú | `Escape` | Cierra y devuelve el foco a «Ordenar» |
| Menú | `Enter` en una opción | Elige, cierra y devuelve el foco a «Ordenar» |

### Barreras

| # | Barrera | Qué hacer | WCAG |
|---|---|---|---|
| 1 | El grupo no es una lista de pestañas | `role="tablist"` + `aria-label="Filtrar denuncias"` | 1.3.1 · 4.1.2 |
| 2 | Cada pestaña es un `div` | `<button type="button" role="tab" aria-selected={seleccionada}>` | 4.1.2 |
| 3 | El panel no está unido a su pestaña | Pestaña: `id` + `aria-controls`. Panel: `role="tabpanel"` + `aria-labelledby` + `tabIndex={0}` | 1.3.1 · 4.1.2 |
| 4 | Todas las pestañas en el orden de `Tab` (o ninguna) | *Roving tabindex:* `tabIndex={seleccionada ? 0 : -1}` | 2.4.3 |
| 5 | Las flechas no hacen nada | `onKeyDown` con `ArrowRight`, `ArrowLeft` (con vuelta), `Home` y `End` | 2.1.1 |
| 6 | «Ordenar» es un `span` | `<button type="button" aria-expanded={abierto} aria-controls={idLista}>` | 4.1.2 · 2.1.1 |
| 7 | Al abrir, el foco no entra | `useEffect` → foco a la primera opción | 2.4.3 |
| 8 | `Escape` no cierra y el foco se pierde | `onKeyDown` en el contenedor + `disparador.current.focus()` | 2.1.1 · 2.4.3 |

### Chuleta

```jsx
// Pestañas: roving tabindex + flechas
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
  onCambiar(PESTANAS[destino]);
  refs.current[destino].focus();
};

<div role="tablist" aria-label="Filtrar denuncias">
  {PESTANAS.map((p, i) => (
    <button key={p} ref={(el) => { refs.current[i] = el; }} type="button" role="tab"
            id={`${idBase}-pestana-${i}`} aria-controls={`${idBase}-panel`}
            aria-selected={p === activa} tabIndex={p === activa ? 0 : -1}
            onClick={() => onCambiar(p)} onKeyDown={(e) => alPulsarTecla(e, i)}>{p}</button>
  ))}
</div>

// Menú: el patrón «disclosure» (botón que muestra y oculta una lista de botones)
useEffect(() => { if (abierto) lista.current.querySelector('button').focus(); }, [abierto]);
const cerrar = () => { setAbierto(false); disparador.current.focus(); };
```

### Retos (+2 cada uno)

- **Para quien programa:** en el menú, que `↓` y `↑` muevan el foco entre las opciones, y que al salir con `Tab` el menú se cierre.
- **Para quien programa (pro):** la opción elegida tiene que anunciarse como elegida. ¿`aria-current`, `aria-pressed` o `aria-selected`? Justificadlo (pista: mirad el CSS de la solución).
- **Para quien no programa:** recorred las pestañas con el lector. Apuntad **la frase exacta** que dice al llegar a «Pendientes» (por ejemplo: «Pendientes, pestaña, seleccionado, 2 de 3»).

---

## Si trabajáis con Angular

Lo mismo, con otras herramientas. Tenéis el detalle en `angular/equivalencias.md`.

| En React (hoy) | En Angular |
|---|---|
| `useId()` | Un contador propio (`'panel-' + siguiente++`); en la plantilla, `[id]` y `[attr.aria-controls]` |
| `aria-expanded={abierto}` | `[attr.aria-expanded]="abierto"` |
| `useRef` + `.focus()` | `viewChild('boton')` + `.nativeElement.focus()` o `FocusMonitor` del CDK |
| Trampa de foco hecha a mano | `cdkTrapFocus` (CDK `A11yModule`) |
| Diálogo completo | `MatDialog` / `Dialog` del CDK: rol, `aria-modal`, trampa y devolución del foco incluidos |
| Pestañas con flechas | `mat-tab-group` o `FocusKeyManager` del CDK para hacerlas a mano |
| `role="status"` siempre montado | `LiveAnnouncer.announce('…')` del CDK |

## Entregable

- `hoja-del-grupo.md`, apartado «Laboratorio A».
- Chat general al terminar **cada** etapa: «Grupo N · A1 / A2 / A3 · X + retos».
- **Puesta en común (1 minuto por grupo):** la barrera que más os ha costado y por qué.

## Si os atascáis

1. La pista del comprobador.
2. La solución de la misma etapa en `soluciones/` (comparad, no copiéis entera).
3. «Pedir ayuda» en Zoom.
