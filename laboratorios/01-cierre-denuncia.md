# Cierre · `denuncia.html` hasta 21 de 21

**20 minutos · por grupos · mismas salas y mismos grupos · carpeta `sesion-2` · comprobador de la sesión 2**

El lunes terminamos justo con los laboratorios 3 (formulario) y 4 (teclado y foco) en marcha y no hubo tiempo de revisarlos. Ahora los cerramos: **comprobar, arreglar lo que falte y escucharlo**.

> Esta guía es la única de hoy que trabaja con la carpeta **`sesion-2`**. Abrid su `comprobador.html` con Live Server.

## Pasos

| Minuto | Paso | Quién |
|---|---|---|
| 0 – 2 | **¿Dónde estamos?** Comprobador → «Laboratorio 3» y «Laboratorio 4». Apuntad las dos puntuaciones en la hoja. | Auditoría |
| 2 – 12 | **Arreglad lo pendiente**, empezando por lo que el comprobador marca con ❌. Usad la pista; si en 3 minutos no sale, comparad con la solución. | Piloto explica · todos editan |
| 12 – 14 | **Comprobador** → «Todo denuncia.html». Objetivo: **21 de 21** en la copia de todo el grupo. | Auditoría |
| 14 – 18 | **La prueba de verdad**, solo teclado y lector (ver abajo). | Persona usuaria · Auditoría anota |
| 18 – 20 | **Preparad 1 minuto** para la puesta en común con las dos preguntas del final. | Portavoz |

## Si os quedasteis muy atrás

Copiad `sesion-2/soluciones/denuncia-etapa-3-formulario.html` encima de vuestro `denuncia.html` y haced solo el laboratorio 4 (barreras 16 a 21, todo HTML y CSS): **buen momento para que pilote alguien que no programa**.

## Recordatorio rápido

| Lab | # | Barrera | Qué hacer | WCAG |
|---|---|---|---|---|
| 3 | 8 | Solo placeholder | `<label for>` visible | 1.3.1 · 3.3.2 |
| 3 | 9 | «Los campos en rojo son obligatorios» | Asterisco con `aria-hidden` + `required` | 1.4.1 · 3.3.2 |
| 3 | 10 | Ayuda del teléfono suelta | `aria-describedby="ayuda-telefono"` | 1.3.1 |
| 3 | 11 | Radios sin grupo | `<fieldset>` + `<legend>` | 1.3.1 |
| 3 | 12 | Sin `autocomplete` | `given-name`, `family-name`, `email`, `tel` | 1.3.5 |
| 3 | 13 | Interruptor hecho con `div` | `<input type="checkbox" role="switch">` con su `label` | 2.1.1 · 4.1.2 |
| 3 | 14 | «Campo incorrecto» | Mensaje concreto + `aria-invalid` + `aria-describedby` | 3.3.1 · 3.3.3 |
| 3 | 15 | El foco no se mueve al fallar | Foco al primer campo con error | 3.3.1 |
| 4 | 16 | `tabindex` positivos | Quitadlos | 2.4.3 |
| 4 | 17 | `outline: none` | `:focus-visible` de 3 px | 2.4.7 |
| 4 | 18 | `row-reverse` | Orden del código = orden visual | 2.4.3 · 1.3.2 |
| 4 | 19 | Sin enlace para saltar | `<a class="saltar" href="#contenido">` + `<main tabindex="-1">` | 2.4.1 |
| 4 | 20 | «Cancelar» es un `span` | `<button type="button">` | 2.1.1 · 4.1.2 |
| 4 | 21 | El foco queda bajo la cabecera fija | `html { scroll-padding-top: 72px; }` | 2.4.11 |

## La prueba de verdad (persona usuaria)

1. Recargad. `Tab` una vez: ¿aparece «Saltar al contenido principal»? Pulsad `Enter`. **¿Cuántos `Tab` hasta «Nombre»?** (antes eran 9).
2. Con el lector encendido, `Tab` por todo el formulario. ¿Dice nombre, «obligatorio» y la ayuda del teléfono?
3. Escribid el teléfono mal y pulsad «Siguiente». **¿Adónde va el foco y qué dice el lector?**
4. Activad «denuncia anónima» con `Espacio`. ¿Dice «activado»?

## Para la puesta en común (1 minuto)

1. **Vuestro récord de `Tab`** hasta «Nombre», antes y después.
2. **La frase exacta** que dice el lector al fallar el teléfono.

## Entregable

- `sesion-3/laboratorios/hoja-del-grupo.md`, apartado «Cierre de `denuncia.html`».
- Chat general: **«Grupo N · denuncia · X/21 · récord Y Tab»**.
