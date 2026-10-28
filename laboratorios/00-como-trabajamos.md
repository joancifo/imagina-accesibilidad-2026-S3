# Cómo trabajamos en los laboratorios

Hoy trabajaréis más de dos horas **en grupo, en salas de Zoom**: primero cerramos los laboratorios 3 y 4 de `denuncia.html` y después vienen dos laboratorios largos de React, A y B, de tres etapas cada uno. En cada grupo hay personas que programan a diario y personas que no. Está hecho a propósito: cada rol es imprescindible y ninguno exige saber programar, salvo el de piloto.

> Abre esta guía en VSCode y pulsa `Ctrl + Mayús + V` (Mac: `Cmd + Mayús + V`) para verla con formato.

## Los cuatro roles

| Rol | Quién | Qué hace |
|---|---|---|
| 🧑‍💻 **Piloto** | Alguien que programa | Comparte pantalla en la sala, hace cada cambio en su copia y **explica por qué**. Espera a que todo el grupo lo tenga antes de pasar al siguiente. |
| 🦮 **Persona usuaria** | No hace falta programar | Después de cada cambio, lo prueba en **su** copia **sin ratón** y con el **lector de pantalla**, y dice en voz alta qué oye. Da el «OK» o el «otra vez». |
| 🔎 **Auditoría** | No hace falta programar | Pasa el **comprobador** en su copia, apunta en `hoja-del-grupo.md` cada barrera resuelta, su criterio WCAG y cómo se ha comprobado. |
| 🎙️ **Portavoz y reloj** | No hace falta programar | Lee la guía en voz alta, avisa del tiempo, decide cuándo pasar al reto y presenta el resultado en la puesta en común (1 minuto). |

- **Sois 3:** la persona de auditoría hace también de portavoz.
- **Sois 5:** dos personas usuarias, una con teclado y otra con lector.
- **Rotación:** en **cada etapa**, cambiad los roles de usuaria, auditoría y portavoz. En el cierre de `denuncia.html` (solo HTML y CSS) y en la **etapa B3** (biblioteca de componentes), quien no programa puede hacer de piloto con quien programa de **copiloto**: el copiloto dicta, pero no toca el teclado.

## La regla del grupo

1. **Todo el mundo edita su propia copia.** El piloto enseña el cambio y los demás lo copian en la suya. Nadie se queda mirando.
2. **Un cambio solo cuenta cuando la persona usuaria lo ha probado** con el teclado o el lector, en su ordenador.
3. **El piloto no pasa a la siguiente barrera** hasta que todo el grupo tiene la anterior.

## Puntos

| Qué | Puntos |
|---|---|
| Cada comprobación superada en el comprobador (en la copia de la auditoría) | 1 |
| Todo el grupo tiene la misma puntuación en su copia | +3 |
| Cada reto completado (hay retos para quien programa y para quien no) | +2 |
| La portavoz presenta en 1 minuto o menos | +1 |

Al terminar cada **etapa**, la portavoz escribe en el chat general: **«Grupo N · A2 · 8/8 + 1 reto»**. Así veo en directo por dónde va cada sala.

## El comprobador

1. Clic derecho en `comprobador.html` (de la carpeta `sesion-3`) → **Open with Live Server**.
2. Elige la etapa (A1, A2, A3, B1, B2, B3) y pulsa **Comprobar**.
3. Verás cada barrera como ✅ **Superada** o ❌ **Pendiente**, con su criterio WCAG y una pista.

El comprobador solo mira el código. Por eso existe la persona usuaria: el teclado y el lector son los que dicen la última palabra.

## Cómo se abre cada etapa (React sin instalar nada)

Cada etapa es una carpeta con un `index.html` y un `app.jsx`. **No hay que hacer `npm install`**: React, React Router y Babel están en la carpeta `vendor`.

1. Abrid en VSCode la carpeta `sesion-3` entera (no solo una etapa).
2. Clic derecho en el `index.html` de la etapa → **Open with Live Server**.
3. Editad **`app.jsx`** (en B3, `componentes.jsx`). Al guardar, Live Server recarga la página.

**¿La página sale en blanco?** Casi siempre es un error de JSX (una etiqueta sin cerrar, una llave de más). Pulsad `F12` → **Console**: el error dice el archivo y la línea. Deshaced el último cambio con `Ctrl + Z` y volved a intentarlo.

**En JSX se escribe distinto:** `className` (no `class`), `htmlFor` (no `for`), `tabIndex` (no `tabindex`), `aria-*` igual que en HTML, y los valores que cambian van entre llaves: `aria-expanded={abierto}`.

## Si os atascáis

1. Mirad la **pista** del comprobador.
2. Abrid la solución de la carpeta `soluciones/` (misma etapa) y comparad (en VSCode: clic derecho en los dos archivos → «Seleccionar para comparar» y «Comparar con seleccionado»).
3. Pulsad **«Pedir ayuda»** en Zoom y el profesor entra en vuestra sala.

## Atajos que vais a necesitar

| Qué | Windows | Mac |
|---|---|---|
| Ver esta guía con formato | `Ctrl + Mayús + V` | `Cmd + Mayús + V` |
| Guardar | `Ctrl + S` | `Cmd + S` |
| Seleccionar la siguiente palabra igual | `Ctrl + D` | `Cmd + D` |
| Consola (errores de JSX) | `F12` → Console | `Cmd + Opción + J` |
| Panel Accessibility | `F12` → Elements → Accessibility | `Cmd + Opción + I` |
| NVDA: encender / callar | `Ctrl + Alt + N` / `Ctrl` | — |
| VoiceOver: encender / callar | — | `Cmd + F5` / `Ctrl` |
| Lector: siguiente encabezado · zona · tabla · formulario | NVDA: `H` · `D` · `T` · `F` | Rotor: `Ctrl + Opción + U` |
