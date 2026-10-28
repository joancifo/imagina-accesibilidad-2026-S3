# Sesión 3 · Accesibilidad en React y Angular

Material de la sesión 3 del curso **Accesibilidad Web WCAG 2.2 para Desarrolladores React y Angular** · Joan Cifo · Imagina Formación.

## Cómo se usa (sin instalar nada)

1. Abre la carpeta `sesion-3` entera en VSCode.
2. Instala la extensión **Live Server** si no la tienes.
3. Clic derecho en el `index.html` de una etapa → **Open with Live Server**.
4. Edita su `app.jsx` (en la etapa B3, `componentes.jsx`). Al guardar, la página se recarga.
5. Comprueba con `comprobador.html` (también con Live Server).

React 18, React Router 6 y Babel están en `vendor/`: **no hace falta `npm install`** ni conexión. El JSX se traduce en el navegador; solo para aprender, nunca para producción.

> ¿Página en blanco? `F12` → Console. Casi siempre es una etiqueta JSX sin cerrar.

## Qué hay

| Carpeta | Qué es | Temario |
|---|---|---|
| `laboratorios/` | Guías de trabajo en grupo, roles, puntos y hoja del grupo | — |
| `labA-1-componentes/` | Acordeón, casilla, botón conmutador, botón de icono, botón desactivado · 7 barreras | 3.1 – 3.4 · 3.9 – 3.10 |
| `labA-2-modal/` | Diálogo de confirmación y aviso de envío · 8 barreras | 3.5 – 3.8 |
| `labA-3-teclado/` | Pestañas y menú desplegable con teclado · 8 barreras | 3.8 · 3.10 – 3.11 |
| `labB-1-rutas/` | SPA con React Router: menú, título, foco y saltar al contenido · 6 barreras | 3.12 – 3.13 |
| `labB-2-formulario/` | Formulario «Identifícate» con validación · 7 barreras | 3.14 – 3.15 |
| `labB-3-design-system/` | Biblioteca de componentes con anti-patrones · 8 barreras | 3.16 – 3.18 |
| `soluciones/` | Una solución por etapa (y una alternativa con `<dialog>` nativo en A2) | — |
| `ejemplos/` | Demos de la explicación: nativo frente a personalizado y el hook `useAnunciar` | 3.4 · 3.7 · 3.16 |
| `angular/equivalencias.md` | Cada patrón de la sesión traducido a Angular, CDK y Material | 3.1 – 3.18 |
| `comprobador.html` | Comprueba cada etapa en el navegador | — |

## Guías

1. `laboratorios/00-como-trabajamos.md` · roles, regla del grupo, puntos y atajos.
2. `laboratorios/01-cierre-denuncia.md` · terminar `denuncia.html` (carpeta `sesion-2`) hasta 21 de 21.
3. `laboratorios/laboratorio-A.md` · 60 minutos · etapas A1, A2 y A3.
4. `laboratorios/laboratorio-B.md` · 50 minutos · etapas B1, B2 y B3.
5. `laboratorios/hoja-del-grupo.md` · la rellena la persona de auditoría.

## El comprobador

Carga cada etapa en un `iframe`, espera a que React la pinte y comprueba sus barreras: el DOM y lo que pasa al hacer clic o pulsar `Escape`, `Tab`, las flechas o enviar el formulario. Cada etapa empieza en 0 y su solución da el máximo.

**El comprobador no sustituye a la prueba con teclado y lector**: por eso cada grupo tiene una persona usuaria.

## Referencias

- [WCAG 2.2 (W3C, en inglés)](https://www.w3.org/TR/WCAG22/) · [Traducciones de WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/translations/)
- [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/): patrones *Dialog (Modal)*, *Tabs*, *Disclosure*, *Switch*
- [React · Accesibilidad en react-dom (aria-*, htmlFor)](https://react.dev/reference/react-dom/components/common)
- [Angular CDK · Accessibility](https://material.angular.io/cdk/a11y)
- [Angular · Accesibilidad](https://angular.dev/best-practices/a11y)
