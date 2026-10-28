# Laboratorio B · Rutas, formularios y biblioteca de componentes

**50 minutos · por grupos · temario 3.12 a 3.18 · tres etapas · 21 barreras · comprobador: «B · Etapa 1», «B · Etapa 2» y «B · Etapa 3»**

Ahora el Canal de denuncias como **aplicación de una sola página (SPA)**: navegación con React Router, el formulario «Identifícate» y, al final, la **biblioteca de componentes** con la que se construye todo lo demás.

| Etapa | Carpeta | Archivo que editáis | Barreras | Tiempo orientativo | Temario |
|---|---|---|---|---|---|
| B1 · Navegación en una SPA | `labB-1-rutas` | `app.jsx` | 6 | 12 min | 3.12 – 3.13 |
| B2 · Formularios y errores | `labB-2-formulario` | `app.jsx` | 7 | 18 min | 3.14 – 3.15 |
| B3 · Biblioteca de componentes | `labB-3-design-system` | **`componentes.jsx`** | 8 | 20 min | 3.16 – 3.18 |

**Objetivo:** que al cambiar de página la persona sepa **dónde ha llegado**, que el formulario **diga qué falta y dónde**, y que los componentes compartidos **no repitan los mismos errores en cien sitios**.

---

## Etapa B1 · Navegación en una SPA (12 min)

Tres páginas: «Canal de denuncias», «Reporta una denuncia» y «Mis denuncias». El menú cambia el contenido sin recargar.

### Pasos

| Minuto | Paso | Quién |
|---|---|---|
| 0 – 1 | Repartid roles. Abrid `labB-1-rutas/index.html`. | Portavoz |
| 1 – 3 | **El «antes».** Solo teclado: ¿llegáis al menú? Con ratón, id a «Mis denuncias»: ¿cambia el título de la pestaña del navegador? ¿Qué dice el lector? | Persona usuaria · Auditoría anota |
| 3 – 9 | **Arreglad** las barreras 1 a 6. | Piloto explica · todos editan |
| 9 – 10 | **Comprobador** → «B · Etapa 1». | Auditoría |
| 10 – 12 | **El «después».** Chat: «Grupo N · B1 · X/6». | Persona usuaria · Portavoz |

### Barreras

| # | Barrera | Qué hacer | WCAG |
|---|---|---|---|
| 1 | Las opciones del menú son `span` con `onClick` | `<NavLink to={p.ruta} end>` | 2.1.1 · 4.1.2 |
| 2 | La página actual solo se ve por el color | `NavLink` pone `aria-current="page"` solo (con `end` en «/») | 1.3.1 |
| 3 | El menú es un `div` sin nombre | `<nav aria-label="Menú principal">` | 1.3.1 · 2.4.1 |
| 4 | El título de la pestaña no cambia | `` document.title = `${titulo} · Canal de denuncias` `` en un `useEffect` | 2.4.2 |
| 5 | Al cambiar de página, el foco se queda en el menú | `<h1 ref tabIndex={-1}>` y `.focus()` (salvo en la primera carga) | 2.4.3 · 4.1.3 |
| 6 | No hay forma de saltar cabecera y menú | Enlace «Saltar al contenido»: `preventDefault()` + foco al `<main tabIndex={-1}>` | 2.4.1 |

### Chuleta

```jsx
let primeraCarga = true;
function Pagina({ titulo, children }) {
  const encabezado = useRef(null);
  useEffect(() => {
    document.title = `${titulo} · Canal de denuncias`;            // 4
    if (primeraCarga) primeraCarga = false;
    else encabezado.current.focus();                               // 5
  }, [titulo]);
  return <><h1 ref={encabezado} tabIndex={-1}>{titulo}</h1>{children}</>;
}

// 6 · Con HashRouter, href="#contenido" cambiaría de ruta: movemos el foco nosotros
function SaltarAlContenido({ destino }) {
  const saltar = (e) => { e.preventDefault(); destino.current.focus(); };
  return <a className="saltar" href="#contenido" onClick={saltar}>Saltar al contenido principal</a>;
}
```

### Retos (+2 cada uno)

- **Para quien programa:** en vez de mover el foco, anunciad el cambio de página con una región `role="status"` («Página: Mis denuncias»). ¿Qué ventaja y qué inconveniente tiene frente a mover el foco?
- **Para quien no programa:** pulsad el botón «Atrás» del navegador después de navegar. ¿Cambia el título? ¿Dónde queda el foco? Apuntadlo.

---

## Etapa B2 · Formularios y errores (18 min)

Paso «Identifícate»: nombre, email y teléfono.

### Pasos

| Minuto | Paso | Quién |
|---|---|---|
| 0 – 1 | **Rotad roles.** Abrid `labB-2-formulario/index.html`. | Portavoz |
| 1 – 4 | **El «antes».** Con el lector, `Tab` por los campos. ¿Dice el nombre de cada uno? Intentad pulsar «Siguiente» con todo vacío: ¿se puede? | Persona usuaria · Auditoría anota |
| 4 – 14 | **Arreglad** las barreras 1 a 7. Truco: casi todo se arregla **una vez** dentro del componente `Campo`. | Piloto explica · todos editan |
| 14 – 16 | **Comprobador** → «B · Etapa 2». | Auditoría |
| 16 – 18 | **El «después»:** «Siguiente» con el email mal. ¿Adónde va el foco y qué dice el lector? Chat: «Grupo N · B2 · X/7». | Persona usuaria · Portavoz |

### Barreras

| # | Barrera | Qué hacer | WCAG |
|---|---|---|---|
| 1 | La etiqueta es un `span` suelto | `const id = useId();` + `<label htmlFor={id}>` + `<input id={id}>` | 1.3.1 · 3.3.2 |
| 2 | No dice que es obligatorio | `required` + el `*` con `aria-hidden="true"` | 3.3.2 |
| 3 | «Siguiente» desactivado hasta que todo está bien | Quitad `disabled`: al pulsarlo, la persona descubre qué falta | 3.3.1 |
| 4 | El campo con error no se marca | `aria-invalid={error ? true : undefined}` | 3.3.1 · 4.1.2 |
| 5 | «Campo incorrecto» y sin asociar | Mensaje que dice qué hacer + `aria-describedby` (ayuda + error) | 3.3.1 · 3.3.3 |
| 6 | Con errores, el foco no se mueve | `forwardRef` en `Campo` y foco al primer campo con error | 3.3.1 · 2.4.3 |
| 7 | «Datos guardados» no se anuncia | `<p className="estado" role="status">{estado}</p>` siempre montado | 4.1.3 |

### Chuleta

```jsx
const Campo = React.forwardRef(function Campo({ etiqueta, nombre, tipo = 'text', ayuda, valor, onCambiar, error }, ref) {
  const id = useId();
  const describe = [ayuda && `${id}-ayuda`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <div className="campo">
      <label htmlFor={id}>{etiqueta} <span aria-hidden="true">*</span></label>
      {ayuda && <p className="ayuda" id={`${id}-ayuda`}>{ayuda}</p>}
      <input ref={ref} id={id} type={tipo} name={nombre} required
             aria-invalid={error ? true : undefined} aria-describedby={describe}
             value={valor} onChange={(e) => onCambiar(nombre, e.target.value)} />
      {error && <p className="error" id={`${id}-error`}>⚠ {error}</p>}
    </div>
  );
});

// Al enviar:
const primero = ['nombre', 'email', 'telefono'].find((n) => nuevos[n]);
if (primero) refs[primero].current.focus();
```

### Retos (+2 cada uno)

- **Para quien programa:** añadid `autoComplete` (`given-name`, `email`, `tel`) y explicad qué criterio cumple (1.3.5) y a quién ayuda.
- **Para quien programa (pro):** un resumen de errores encima del formulario con enlaces a cada campo. ¿Recibe el foco o es una región viva? Decidid y defendedlo.
- **Para quien no programa:** reescribid los tres mensajes de error para que digan **qué hacer** y con un ejemplo. Apuntadlos en la hoja.

---

## Etapa B3 · Biblioteca de componentes (20 min)

Página «Mi espacio», construida **solo** con los componentes de `componentes.jsx`: `Boton`, `BotonIcono`, `Icono`, `Enlace`, `Tarjeta`, `Interruptor` y `CampoBusqueda`. **No toquéis `app.jsx`.** Cada arreglo en un componente arregla **todos** sus usos de golpe: eso es un Design System.

Es la etapa ideal para que **pilote alguien que no programa** (con copiloto): son cambios pequeños y muy visibles.

### Pasos

| Minuto | Paso | Quién |
|---|---|---|
| 0 – 1 | **Rotad roles.** Abrid `labB-3-design-system/index.html` y, en VSCode, `componentes.jsx`. | Portavoz |
| 1 – 5 | **Validación funcional del «antes»** (ver la lista de abajo). Apuntad cada fallo en la hoja. | Persona usuaria · Auditoría anota |
| 5 – 15 | **Arreglad** los 8 anti-patrones en `componentes.jsx`. | Piloto (o copiloto) · todos editan |
| 15 – 17 | **Comprobador** → «B · Etapa 3». | Auditoría |
| 17 – 20 | **Validación funcional del «después»** con la misma lista. Chat: «Grupo N · B3 · X/8». | Persona usuaria · Portavoz |

### Validación funcional en 8 pasos (3.18)

Es la prueba que hace una persona, no una herramienta. Hacedla **antes y después**.

1. **Tab desde el principio:** ¿el orden sigue el de la pantalla? ¿Veis **siempre** dónde está el foco?
2. **Ayuda** y **Política de privacidad:** ¿se llega con `Tab`? ¿Se abren con `Enter`?
3. **Buscar borrador:** ¿el lector dice el nombre del campo? ¿Y cuando ya habéis escrito algo?
4. **Editar y eliminar:** ¿el lector dice **qué** borrador editáis o elimináis?
5. **Nuevo borrador** y **Guardar preferencias:** ¿funcionan con `Enter` y con `Espacio`?
6. **Interruptores:** ¿se activan con `Espacio`? ¿Dice «activado» / «desactivado»?
7. **Encabezados:** con el lector, tecla `H`. ¿Aparecen los títulos de las dos tarjetas?
8. **Mensajes:** al eliminar un borrador, ¿lo anuncia el lector?

### Los 8 anti-patrones (3.17)

| # | Anti-patrón | Qué hacer en el componente | WCAG |
|---|---|---|---|
| 1 | `Boton` pinta un `div` | `<button type="button">` | 2.1.1 · 4.1.2 |
| 2 | `BotonIcono` recibe `etiqueta` y no la usa; el svg se lee | `aria-label={etiqueta}` en el botón y `aria-hidden="true" focusable="false"` en el svg de `Icono` | 1.1.1 · 4.1.2 |
| 3 | `Enlace` sin `href` | `` <a href={`#${a}`}> `` sin `onClick` | 2.1.1 · 4.1.2 |
| 4 | El título de `Tarjeta` es un `div` | Encabezado con nivel configurable: `` const Encabezado = `h${nivel}`; `` | 1.3.1 · 2.4.6 |
| 5 | `Interruptor` es un `div` | `<button role="switch" aria-checked={activo} aria-labelledby={id}>` | 4.1.2 · 2.1.1 |
| 6 | `CampoBusqueda` usa el placeholder como etiqueta | `<label htmlFor={id}>{etiqueta}</label>` | 1.3.1 · 3.3.2 · 2.5.3 |
| 7 | `tabIndex={1}` en la búsqueda | Quitadlo | 2.4.3 |
| 8 | `style={{ outline: 'none' }}` en `BotonIcono` | Quitadlo (el foco visible ya lo pone `estilos.css`) | 2.4.7 |

> **Ojo en este archivo:** usad `React.useId()` y `React.useState()` en lugar de `const { useId } = React;`. Los dos archivos comparten ámbito y `app.jsx` ya declara esos nombres: repetirlos rompe la página.

### Chuleta

```jsx
function Interruptor({ etiqueta, activo, onCambiar }) {
  const id = React.useId();
  return (
    <div className="interruptor-fila">
      <span id={id}>{etiqueta}</span>
      <button type="button" role="switch" aria-checked={activo} aria-labelledby={id}
              className={activo ? 'interruptor on' : 'interruptor'}
              onClick={() => onCambiar(!activo)} />
    </div>
  );
}

function Tarjeta({ titulo, nivel = 2, children }) {
  const Encabezado = `h${nivel}`;          // quien usa la tarjeta decide el nivel
  return <section className="tarjeta"><Encabezado className="titulo-tarjeta">{titulo}</Encabezado>{children}</section>;
}
```

### Retos (+2 cada uno)

- **Para quien programa:** que `BotonIcono` **avise en consola** si alguien lo usa sin `etiqueta` (`console.error`). ¿Qué ventaja tiene que el componente lo exija?
- **Para quien programa (pro):** escribid en la hoja el **contrato de accesibilidad** de `BotonIcono` como si fuera su documentación: props obligatorias, rol, nombre, teclado y foco.
- **Para quien no programa:** elegid dos componentes y escribid su **anotación de accesibilidad** para el equipo de diseño: nombre accesible, rol, estados y teclas. Una línea por cosa.

---

## Si trabajáis con Angular

| En React (hoy) | En Angular |
|---|---|
| `<NavLink>` + `aria-current` | `routerLink` + `routerLinkActive="activo"` + `ariaCurrentWhenActive="page"` |
| `document.title` en un `useEffect` | `title: 'Mis denuncias'` en la ruta (o un `TitleStrategy` propio) |
| Foco al `h1` al cambiar de ruta | Escuchar `NavigationEnd` del `Router` y enfocar el `h1` (`tabindex="-1"`) |
| `useId` + `htmlFor` | `<mat-form-field>` + `<mat-label>` lo asocian solos; en HTML puro, `[id]` y `for` |
| `aria-invalid` y errores | `<mat-error>` (se asocia solo); en HTML puro, `[attr.aria-invalid]` y `[attr.aria-describedby]` |
| Biblioteca de componentes | `etiqueta = input.required<string>();` (o `@Input({ required: true })`) → el compilador obliga a ponerla |

Más detalle en `angular/equivalencias.md`.

## Entregable

- `hoja-del-grupo.md`, apartado «Laboratorio B», con la **validación funcional** antes y después.
- Chat general al terminar **cada** etapa: «Grupo N · B1 / B2 / B3 · X + retos».
- **Puesta en común (1 minuto por grupo):** un anti-patrón de B3 que hayáis visto en un proyecto real.

## Si os atascáis

1. La pista del comprobador.
2. La solución de la misma etapa en `soluciones/`.
3. «Pedir ayuda» en Zoom.
