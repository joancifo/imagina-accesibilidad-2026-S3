# Equivalencias React → Angular

Hoy los laboratorios están en React porque así no hay que instalar nada. Pero **los criterios WCAG y el comportamiento esperado son exactamente los mismos en Angular**: cambia la herramienta, no el contrato. Esta guía traduce cada patrón de la sesión.

> Ejemplos con Angular 17 o superior (componentes *standalone*, `@if` / `@for`, *signals*). El CDK es `@angular/cdk`; los componentes de Material, `@angular/material`.

## 0. Lo que se escribe distinto

| Qué | React (JSX) | Angular (plantilla) |
|---|---|---|
| Clase | `className="boton"` | `class="boton"` |
| Atributo ARIA dinámico | `aria-expanded={abierto}` | `[attr.aria-expanded]="abierto()"` |
| Quitar un atributo | `aria-invalid={error ? true : undefined}` | `[attr.aria-invalid]="error() ? true : null"` (con `null` desaparece) |
| Id único | `useId()` | Un contador propio: `id = 'panel-' + siguiente++` |
| Referencia a un elemento | `useRef` | `viewChild<ElementRef>('nombre')` o `@ViewChild` |
| Efecto | `useEffect` | `effect()`, `ngAfterViewInit`, o tras el cambio que lo provoca |
| Evento de tecla | `onKeyDown` + `e.key === 'Escape'` | `(keydown.escape)="cerrar()"` |

## 1. Componentes accesibles (Lab A · Etapa 1)

```html
<!-- Acordeón: botón dentro de un encabezado, estado y panel unido -->
<h3>
  <button type="button" class="acordeon-cabecera"
          [attr.aria-expanded]="abierto()" [attr.aria-controls]="idPanel"
          (click)="abierto.set(!abierto())">
    {{ titulo() }} <span aria-hidden="true">{{ abierto() ? '−' : '+' }}</span>
  </button>
</h3>
<div [id]="idPanel" class="acordeon-panel" [hidden]="!abierto()">
  <ng-content />
</div>

<!-- Botón conmutador y botón de icono -->
<button type="button" [attr.aria-pressed]="compacta()" (click)="compacta.set(!compacta())">Vista compacta</button>
<button type="button" aria-label="Descargar historial">
  <svg aria-hidden="true" focusable="false">…</svg>
</button>
```

**Nativo antes que personalizado:** `<input type="checkbox">`, `<button>`, `<a href>`, `<select>`… En Angular Material, `mat-checkbox`, `mat-slide-toggle` o `mat-button` ya traen rol, nombre, estado y teclado.

## 2. Modales, foco y avisos (Lab A · Etapa 2)

### La vía rápida: `MatDialog` (o `Dialog` del CDK)

```ts
const ref = this.dialog.open(ConfirmarSalidaComponent, {
  ariaDescribedBy: 'texto-salir',   // el nombre lo pone mat-dialog-title
  autoFocus: 'first-tabbable',      // 3 · el foco entra
  restoreFocus: true,               // 6 · el foco vuelve a «Cancelar» (es el valor por defecto)
});
```

```html
<h2 mat-dialog-title>¿Seguro que quieres salir?</h2>
<mat-dialog-content><p id="texto-salir">Si sales ahora, se perderán los datos…</p></mat-dialog-content>
<mat-dialog-actions>
  <button mat-button mat-dialog-close>Seguir rellenando</button>
  <button mat-flat-button [mat-dialog-close]="true">Salir sin guardar</button>
</mat-dialog-actions>
```

`MatDialog` pone `role="dialog"`, `aria-modal="true"` y `aria-labelledby`, atrapa el foco, cierra con `Escape` y oculta el resto de la página al lector. **Lo que no hace por ti:** que el título y el texto sean claros.

### Hecho a mano: `cdkTrapFocus`

```html
<div class="modal" role="dialog" aria-modal="true"
     [attr.aria-labelledby]="idTitulo" [attr.aria-describedby]="idTexto"
     cdkTrapFocus [cdkTrapFocusAutoCapture]="true"
     (keydown.escape)="seguir()">
  …
</div>
```

`cdkTrapFocusAutoCapture` lleva el foco dentro al aparecer y lo devuelve al elemento anterior al desaparecer (importad `A11yModule` de `@angular/cdk/a11y`). El fondo inerte: `[attr.inert]="confirmando() ? '' : null"`.

### Avisos: `LiveAnnouncer`

```ts
private anunciador = inject(LiveAnnouncer);
enviar() {
  this.anunciador.announce('Tu denuncia D-0043 se ha enviado correctamente.', 'polite');
}
```

`LiveAnnouncer` mantiene una región viva siempre montada: es la versión Angular de nuestro `<div role="status">` fijo.

## 3. Teclado en componentes complejos (Lab A · Etapa 3)

- **Pestañas listas:** `<mat-tab-group>` ya cumple el patrón (roles, `aria-selected`, flechas, `Inicio`/`Fin`).
- **Hechas a mano:** `FocusKeyManager` del CDK gestiona las flechas y el *roving tabindex*.

```ts
@ViewChildren(PestanaDirective) pestanas!: QueryList<PestanaDirective>;  // cada una implementa FocusableOption
private teclas!: FocusKeyManager<PestanaDirective>;

ngAfterViewInit() {
  this.teclas = new FocusKeyManager(this.pestanas).withHorizontalOrientation('ltr').withWrap().withHomeAndEnd();
}
alPulsarTecla(evento: KeyboardEvent) {
  this.teclas.onKeydown(evento);                                  // → ← Inicio Fin
  this.seleccionar(this.teclas.activeItemIndex ?? 0);             // activación automática
}
```

- **Menú desplegable:** `mat-menu` (patrón *menu*, con `role="menu"`), o el patrón *disclosure* de hoy: `[attr.aria-expanded]` en el botón y `(keydown.escape)` que cierre y devuelva el foco al botón. Sin trampa de foco: un menú no es modal.

## 4. Navegación en una SPA (Lab B · Etapa 1)

```ts
// app.routes.ts · 4 · título por ruta
export const routes: Routes = [
  { path: '', component: InicioComponent, title: 'Canal de denuncias' },
  { path: 'reportar', component: ReportarComponent, title: 'Reporta una denuncia · Canal de denuncias' },
  { path: 'mis-denuncias', component: MisDenunciasComponent, title: 'Mis denuncias · Canal de denuncias' },
];
```

```html
<!-- 1, 2 y 3 · enlaces, aria-current y nav con nombre -->
<nav aria-label="Menú principal">
  <ul>
    <li><a routerLink="/" routerLinkActive="activo" [routerLinkActiveOptions]="{ exact: true }" ariaCurrentWhenActive="page">Canal de denuncias</a></li>
    <li><a routerLink="/reportar" routerLinkActive="activo" ariaCurrentWhenActive="page">Reporta una denuncia</a></li>
  </ul>
</nav>
```

```ts
// 5 · foco al h1 al cambiar de ruta (no en la primera carga)
constructor() {
  inject(Router).events
    .pipe(filter((e) => e instanceof NavigationEnd), skip(1), takeUntilDestroyed())
    .subscribe(() => setTimeout(() => document.querySelector<HTMLElement>('main h1')?.focus()));
}
```

**6 · Saltar al contenido.** Con `<base href="/">`, un `href="#contenido"` suelto puede llevar a la raíz de la aplicación. Igual que hoy con `HashRouter`: `(click)="saltar($event)"` → `evento.preventDefault()` y foco al `<main id="contenido" tabindex="-1">`.

## 5. Formularios y errores (Lab B · Etapa 2)

Con Material, `<mat-form-field>` asocia `<mat-label>`, `<mat-hint>` y `<mat-error>` al campo y marca `aria-invalid` solo. En HTML con formularios reactivos:

```html
<label [for]="id">Email <span aria-hidden="true">*</span></label>
<p class="ayuda" [id]="id + '-ayuda'">Ejemplo: maria@empresa.com</p>
<input [id]="id" type="email" formControlName="email" autocomplete="email" required
       [attr.aria-invalid]="mostrarError('email') ? true : null"
       [attr.aria-describedby]="id + '-ayuda' + (mostrarError('email') ? ' ' + id + '-error' : '')">
@if (mostrarError('email')) {
  <p class="error" [id]="id + '-error'">⚠ Introduce un email válido. Ejemplo: maria@empresa.com</p>
}
<button type="submit">Siguiente</button>   <!-- nunca [disabled]="form.invalid" -->
```

```ts
enviar() {
  this.form.markAllAsTouched();
  if (this.form.invalid) {
    // 6 · foco al primer campo con error, cuando la vista ya se ha actualizado
    setTimeout(() => this.host.nativeElement.querySelector('[aria-invalid="true"]')?.focus());
  } else {
    this.anunciador.announce('Datos guardados. Puedes pasar al paso 2.');   // 7
  }
}
```

## 6. Biblioteca de componentes (Lab B · Etapa 3)

```ts
@Component({
  selector: 'app-boton-icono',
  template: `
    <button type="button" class="boton-icono" [attr.aria-label]="etiqueta()" (click)="pulsado.emit()">
      <app-icono [nombre]="icono()" />   <!-- el svg lleva aria-hidden="true" -->
    </button>`,
})
export class BotonIconoComponent {
  icono = input.required<string>();
  etiqueta = input.required<string>();   // sin etiqueta, no compila: el contrato lo impone el compilador
  pulsado = output<void>();
}
```

- **Encabezado configurable:** `nivel = input<2 | 3 | 4>(2)` y en la plantilla `<div role="heading" [attr.aria-level]="nivel()">`, o un `@switch` con `h2`, `h3`, `h4` (mejor: elementos nativos).
- **Interruptor:** `mat-slide-toggle`, o un `<button role="switch" [attr.aria-checked]="activo()">` con su etiqueta.
- **Anti-patrones que vigilar en Angular:** `(click)` en un `div` o en un `<a>` sin `routerLink`/`href`, `tabindex` positivos, `outline: none` en estilos globales, `[attr.aria-hidden]="true"` en algo que contiene botones, y componentes que aceptan la etiqueta como opcional.
