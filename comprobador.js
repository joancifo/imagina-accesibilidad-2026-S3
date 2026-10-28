/*
 * Comprobador de laboratorios · Sesión 3 · Accesibilidad en React
 * Joan Cifo · Imagina Formación
 *
 * Carga cada laboratorio (React) en un iframe, espera a que se pinte y comprueba sus barreras:
 * lo que hay en el DOM y lo que pasa al hacer clic, pulsar Escape, Tab o enviar el formulario.
 * Un cambio cuenta de verdad cuando, además, la persona usuaria del grupo lo ha probado.
 */
(function (global) {
  'use strict';

  // ───────── Utilidades ─────────
  const limpiar = (t) => (t || '').replace(/\s+/g, ' ').trim();

  function textoAccesible(nodo) {
    if (!nodo) return '';
    if (nodo.nodeType === 3) return nodo.textContent;
    if (nodo.nodeType !== 1) return '';
    if (nodo.getAttribute('aria-hidden') === 'true' || nodo.hidden) return '';
    const etiqueta = nodo.tagName.toLowerCase();
    if (etiqueta === 'svg') {
      const titulo = nodo.querySelector('title');
      return titulo ? titulo.textContent : '';
    }
    if (etiqueta === 'img') return nodo.getAttribute('alt') || '';
    if (etiqueta === 'style' || etiqueta === 'script') return '';
    return Array.from(nodo.childNodes).map(textoAccesible).join('');
  }

  function textoDeIds(ids, doc) {
    return limpiar((ids || '').split(/\s+/).filter(Boolean).map((id) => doc.getElementById(id)).filter(Boolean).map((n) => n.textContent).join(' '));
  }

  function etiquetasDe(control, doc) {
    if (control.labels && control.labels.length) return Array.from(control.labels);
    const lista = [];
    if (control.id) doc.querySelectorAll('label[for="' + control.id + '"]').forEach((l) => lista.push(l));
    const envolvente = control.closest('label');
    if (envolvente && !lista.includes(envolvente)) lista.push(envolvente);
    return lista;
  }

  function nombre(el, doc, soloAria) {
    if (!el) return '';
    const porId = textoDeIds(el.getAttribute('aria-labelledby'), doc);
    if (porId) return porId;
    const aria = limpiar(el.getAttribute('aria-label'));
    if (aria) return aria;
    if (soloAria) return '';
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) return limpiar(etiquetasDe(el, doc).map(textoAccesible).join(' '));
    return limpiar(textoAccesible(el));
  }

  const exacto = (doc, selector, texto, dentro) =>
    Array.from((dentro || doc).querySelectorAll(selector)).find((el) => limpiar(el.textContent) === texto);
  const empieza = (doc, selector, texto) =>
    Array.from(doc.querySelectorAll(selector)).find((el) => limpiar(el.textContent).startsWith(texto));

  const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const enfocables = (raiz) => Array.from(raiz.querySelectorAll(ENFOCABLES)).filter((el) => !el.closest('[hidden], [inert]'));

  const esperar = (win, ms) => new Promise((ok) => win.setTimeout(ok, ms));
  const tecla = (win, el, key, extra) =>
    el.dispatchEvent(new win.KeyboardEvent('keydown', Object.assign({ key, bubbles: true, cancelable: true }, extra || {})));

  function escribir(win, input, valor) {
    const setter = Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value').set;
    setter.call(input, valor);
    input.dispatchEvent(new win.Event('input', { bubbles: true }));
  }

  function enviarFormulario(win, form) {
    if (form.requestSubmit) form.requestSubmit();
    else form.dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }));
  }

  // ───────── Definición de cada laboratorio ─────────
  const LABS = {
    A1: {
      pagina: 'labA-1-componentes/index.html',
      nombre: 'Laboratorio A · Etapa 1 · Componentes accesibles',
      checks: [
        { id: '1', titulo: 'El acordeón se abre con un <button> dentro de un encabezado', criterio: '4.1.2 Nombre, función, valor (A) · 1.3.1 (A)',
          pista: '<h3><button type="button" aria-expanded={abierto} …>{titulo}</button></h3>' },
        { id: '2', titulo: 'aria-expanded cambia con el estado y el panel se muestra', criterio: '4.1.2 (A)',
          pista: 'aria-expanded={abierto} y aria-controls con el id del panel. El panel usa hidden={!abierto}.' },
        { id: '3', titulo: 'Cada acordeón tiene su propio id (useId) y el panel existe aunque esté cerrado', criterio: '4.1.2 (A)',
          pista: 'const idPanel = useId(); y en lugar de {abierto && …}, <div id={idPanel} hidden={!abierto}>.' },
        { id: '4', titulo: 'El botón de descargar tiene nombre y el icono está oculto', criterio: '1.1.1 (A) · 4.1.2 (A)',
          pista: 'aria-label="Descargar historial" en el botón y aria-hidden="true" focusable="false" en el svg.' },
        { id: '5', titulo: '«Solo pendientes» es una casilla nativa que filtra la tabla', criterio: '2.1.1 Teclado (A) · 4.1.2 (A)',
          pista: '<label><input type="checkbox" checked={soloPendientes} onChange={(e) => setSoloPendientes(e.target.checked)} /> Solo pendientes</label>' },
        { id: '6', titulo: '«Vista compacta» anuncia si está pulsado', criterio: '4.1.2 (A) · 1.4.1 Uso del color (A)',
          pista: 'aria-pressed={compacta} en el botón.' },
        { id: '7', titulo: '«Exportar» es un botón desactivado de verdad', criterio: '4.1.2 (A)',
          pista: '<button type="button" disabled>Exportar</button> y el motivo en texto visible.' },
      ],
      async ejecutar(doc, win) {
        const r = {};
        const botonAcordeon = () => Array.from(doc.querySelectorAll('button')).find((b) => limpiar(b.textContent).startsWith('¿Quién puede denunciar?'));
        const b = botonAcordeon();
        r['1'] = Boolean(b && b.closest('h2, h3, h4, h5, h6'));
        const acordeones = Array.from(doc.querySelectorAll('button[aria-controls]')).filter((x) => /¿(Quién|Qué)/.test(x.textContent));
        const ids = acordeones.map((x) => x.getAttribute('aria-controls'));
        r['3'] = acordeones.length >= 2 && new Set(ids).size === ids.length && ids.every((id) => doc.getElementById(id));
        if (b && b.getAttribute('aria-expanded') === 'false') {
          b.click();
          await esperar(win, 80);
          const panel = doc.getElementById(b.getAttribute('aria-controls') || '');
          r['2'] = b.getAttribute('aria-expanded') === 'true' && Boolean(panel) && !panel.hidden && limpiar(panel.textContent).length > 0;
          b.click();
          await esperar(win, 60);
          r['2'] = r['2'] && b.getAttribute('aria-expanded') === 'false';
        } else {
          r['2'] = false;
        }
        const descargar = Array.from(doc.querySelectorAll('button')).find((x) => x.querySelector('svg'));
        r['4'] = Boolean(descargar && nombre(descargar, doc) && descargar.querySelector('svg').getAttribute('aria-hidden') === 'true');
        const casilla = Array.from(doc.querySelectorAll('input[type="checkbox"]')).find((i) => /Solo pendientes/.test(nombre(i, doc)));
        if (casilla) {
          const antes = doc.querySelectorAll('tbody tr').length;
          casilla.click();
          await esperar(win, 80);
          const despues = doc.querySelectorAll('tbody tr').length;
          r['5'] = casilla.checked && despues < antes;
          casilla.click();
          await esperar(win, 60);
        } else {
          r['5'] = false;
        }
        const compacta = exacto(doc, 'button', 'Vista compacta');
        if (compacta && compacta.getAttribute('aria-pressed') === 'false') {
          compacta.click();
          await esperar(win, 80);
          r['6'] = compacta.getAttribute('aria-pressed') === 'true';
          compacta.click();
          await esperar(win, 60);
        } else {
          r['6'] = false;
        }
        const exportar = exacto(doc, 'button, div, span, a', 'Exportar');
        r['7'] = Boolean(exportar && exportar.tagName === 'BUTTON' && (exportar.disabled || exportar.getAttribute('aria-disabled') === 'true'));
        return r;
      },
    },

    A2: {
      pagina: 'labA-2-modal/index.html',
      nombre: 'Laboratorio A · Etapa 2 · Modales, foco y avisos',
      checks: [
        { id: '1', titulo: 'La ventana es un diálogo modal', criterio: '4.1.2 (A) · 1.3.1 (A)',
          pista: 'role="dialog" y aria-modal="true" en el contenedor de la ventana (o un <dialog> abierto con showModal()).' },
        { id: '2', titulo: 'El diálogo tiene nombre y descripción', criterio: '4.1.2 (A)',
          pista: 'aria-labelledby con el id del h2 y aria-describedby con el id del párrafo (useId).' },
        { id: '3', titulo: 'Al abrir, el foco entra en el diálogo', criterio: '2.4.3 Orden del foco (A)',
          pista: 'useEffect(() => { dialogo.current.querySelector(\'button\').focus(); }, []);' },
        { id: '4', titulo: 'Escape cierra el diálogo', criterio: '2.1.1 Teclado (A)',
          pista: 'onKeyDown={(e) => { if (e.key === \'Escape\') onSeguir(); }} en el diálogo.' },
        { id: '5', titulo: 'Tab no sale del diálogo (trampa de foco)', criterio: '2.4.3 (A)',
          pista: 'Si se pulsa Tab en el último elemento, preventDefault() y foco al primero (y Mayús+Tab al revés).' },
        { id: '6', titulo: 'Al cerrar, el foco vuelve a «Cancelar»', criterio: '2.4.3 (A)',
          pista: 'Guarda el botón con useRef y devuélvele el foco en la limpieza del useEffect del diálogo.' },
        { id: '7', titulo: 'El fondo es inerte mientras el diálogo está abierto', criterio: '2.4.3 (A) · 1.3.1 (A)',
          pista: '<div id="fondo" inert={confirmando ? \'\' : undefined}> (en React 19: inert={confirmando}).' },
        { id: '8', titulo: 'El aviso «se ha enviado» se anuncia', criterio: '4.1.3 Mensajes de estado (AA)',
          pista: '<div className="toast" role="status">{aviso}</div> siempre montado; solo cambia su texto.' },
      ],
      async ejecutar(doc, win) {
        const r = {};
        const contenedor = () => {
          const h = Array.from(doc.querySelectorAll('h2, h3')).find((x) => limpiar(x.textContent) === '¿Seguro que quieres salir?');
          return h ? (h.closest('[role="dialog"], [role="alertdialog"], dialog, .modal') || h.parentElement) : null;
        };
        const abrir = async () => {
          const c = exacto(doc, 'button', 'Cancelar');
          if (c) { c.focus(); c.click(); }   // como con el teclado: el foco está en «Cancelar» al pulsarlo
          await esperar(win, 200);
          return contenedor();
        };
        const abiertoAhora = () => { const c = contenedor(); return Boolean(c && c.isConnected && c.getClientRects().length > 0); };
        const esModalNativo = (d) => Boolean(d && d.tagName === 'DIALOG' && d.matches(':modal'));

        // 8 · el aviso (antes de tocar el diálogo)
        const regiones = Array.from(doc.querySelectorAll('[role="status"], [role="alert"], [aria-live="polite"], [aria-live="assertive"]'));
        const vacias = regiones.filter((x) => limpiar(x.textContent) === '');
        const enviar = exacto(doc, 'button', 'Enviar denuncia');
        if (enviar) {
          enviar.click();
          await esperar(win, 150);
        }
        r['8'] = vacias.length > 0 && vacias.some((x) => x.isConnected && /se ha enviado/i.test(x.textContent));

        // 1, 2, 3 y 7 · con el diálogo abierto
        let d = await abrir();
        const dlg = d && d.closest('[role="dialog"], [role="alertdialog"], dialog');
        r['1'] = Boolean(dlg && (dlg.getAttribute('aria-modal') === 'true' || esModalNativo(dlg)));
        r['2'] = Boolean(dlg && /¿Seguro que quieres salir\?/.test(nombre(dlg, doc, true)) && textoDeIds(dlg.getAttribute('aria-describedby'), doc));
        r['3'] = Boolean(d && d.contains(doc.activeElement));
        const fondo = doc.getElementById('fondo');
        r['7'] = Boolean(esModalNativo(dlg) || (fondo && (fondo.hasAttribute('inert') || fondo.getAttribute('aria-hidden') === 'true')));

        // 6 · cerrar con «Seguir rellenando» y ver adónde va el foco
        const seguir = d && exacto(doc, 'button', 'Seguir rellenando', d);
        if (d && r['3'] && seguir) {
          seguir.click();
          await esperar(win, 200);
          const activo = doc.activeElement;
          r['6'] = !abiertoAhora() && Boolean(activo) && limpiar(activo.textContent) === 'Cancelar';
        } else {
          r['6'] = false;
          if (seguir) { seguir.click(); await esperar(win, 150); }
        }

        // 4 · Escape
        d = await abrir();
        if (d) {
          const dlg4 = d.closest('dialog');
          if (esModalNativo(dlg4)) {
            r['4'] = true;
            dlg4.close();
            await esperar(win, 150);
          } else {
            tecla(win, d.contains(doc.activeElement) ? doc.activeElement : d, 'Escape');
            await esperar(win, 200);
            r['4'] = !abiertoAhora();
          }
        } else {
          r['4'] = false;
        }
        if (abiertoAhora()) {
          const s = exacto(doc, 'button', 'Seguir rellenando');
          if (s) { s.click(); await esperar(win, 150); }
        }

        // 5 · Trampa de foco
        d = await abrir();
        if (d) {
          const dlg5 = d.closest('dialog');
          if (esModalNativo(dlg5)) {
            r['5'] = true;
          } else {
            const lista = enfocables(d);
            if (lista.length >= 2) {
              lista[lista.length - 1].focus();
              tecla(win, lista[lista.length - 1], 'Tab');
              await esperar(win, 80);
              const adelante = doc.activeElement === lista[0];
              lista[0].focus();
              tecla(win, lista[0], 'Tab', { shiftKey: true });
              await esperar(win, 80);
              const atras = doc.activeElement === lista[lista.length - 1];
              r['5'] = adelante && atras;
            } else {
              r['5'] = false;
            }
          }
          const s = exacto(doc, 'button', 'Seguir rellenando');
          if (s) { s.click(); await esperar(win, 150); }
        } else {
          r['5'] = false;
        }
        return r;
      },
    },

    A3: {
      pagina: 'labA-3-teclado/index.html',
      nombre: 'Laboratorio A · Etapa 3 · Pestañas y menú con teclado',
      checks: [
        { id: '1', titulo: 'Las pestañas están en un role="tablist" con nombre', criterio: '1.3.1 (A) · 4.1.2 (A)',
          pista: '<div className="pestanas" role="tablist" aria-label="Filtrar denuncias">' },
        { id: '2', titulo: 'Cada pestaña tiene role="tab" y dice si está seleccionada', criterio: '4.1.2 Nombre, función, valor (A)',
          pista: '<button type="button" role="tab" aria-selected={seleccionada} …>{p}</button>' },
        { id: '3', titulo: 'El panel es un role="tabpanel" unido a su pestaña', criterio: '1.3.1 (A) · 4.1.2 (A)',
          pista: 'Pestaña: id y aria-controls={idPanel}. Panel: role="tabpanel" id={idPanel} aria-labelledby={idPestañaActiva}.' },
        { id: '4', titulo: 'Solo la pestaña activa está en el orden de Tab', criterio: '2.4.3 Orden del foco (A)',
          pista: '«Roving tabindex»: tabIndex={seleccionada ? 0 : -1} en cada pestaña.' },
        { id: '5', titulo: 'Las flechas mueven el foco y seleccionan (con vuelta al principio)', criterio: '2.1.1 Teclado (A)',
          pista: 'onKeyDown: ArrowRight → siguiente (del último al primero), ArrowLeft → anterior. onCambiar(…) y refs.current[destino].focus().' },
        { id: '6', titulo: '«Ordenar» es un botón que dice si el menú está abierto', criterio: '4.1.2 (A) · 2.1.1 (A)',
          pista: '<button type="button" aria-expanded={abierto} aria-controls={idLista}>' },
        { id: '7', titulo: 'Al abrir el menú, el foco va a la primera opción', criterio: '2.4.3 (A)',
          pista: 'useEffect(() => { if (abierto) lista.current.querySelector(\'button\').focus(); }, [abierto]);' },
        { id: '8', titulo: 'Escape cierra el menú y el foco vuelve a «Ordenar»', criterio: '2.1.1 (A) · 2.4.3 (A)',
          pista: 'onKeyDown en el contenedor: si e.key === \'Escape\', setAbierto(false) y disparador.current.focus().' },
      ],
      async ejecutar(doc, win) {
        const r = {};
        const TEXTOS = ['Todas', 'Pendientes', 'Resueltas'];
        const pestana = (t) => exacto(doc, '[role="tab"]', t) || exacto(doc, 'button, div, span, a, li', t);
        const filas = () => doc.querySelectorAll('tbody tr').length;
        let tabs = TEXTOS.map(pestana);
        const lista = doc.querySelector('[role="tablist"]');
        r['1'] = Boolean(lista && nombre(lista, doc, true));
        const sonTabs = tabs.every((t) => t && t.getAttribute('role') === 'tab');
        r['2'] = sonTabs && tabs[0].getAttribute('aria-selected') === 'true' && tabs.slice(1).every((t) => t.getAttribute('aria-selected') === 'false');
        const panel = doc.querySelector('[role="tabpanel"]');
        r['3'] = Boolean(sonTabs && panel && panel.id && tabs[0].getAttribute('aria-controls') === panel.id &&
          (panel.getAttribute('aria-labelledby') || '').split(/\s+/).includes(tabs[0].id) && tabs[0].id);
        r['4'] = sonTabs && tabs[0].tabIndex === 0 && tabs.slice(1).every((t) => t.tabIndex === -1);

        // 5 · flechas
        if (sonTabs) {
          tabs[0].focus();
          tecla(win, tabs[0], 'ArrowRight');
          await esperar(win, 120);
          tabs = TEXTOS.map(pestana);
          const paso1 = doc.activeElement === tabs[1] && tabs[1].getAttribute('aria-selected') === 'true' && filas() === 2;
          tecla(win, tabs[1], 'ArrowLeft');
          await esperar(win, 120);
          tabs = TEXTOS.map(pestana);
          const paso2 = doc.activeElement === tabs[0];
          tecla(win, tabs[0], 'ArrowLeft');
          await esperar(win, 120);
          tabs = TEXTOS.map(pestana);
          const paso3 = doc.activeElement === tabs[2] && tabs[2].getAttribute('aria-selected') === 'true';
          r['5'] = paso1 && paso2 && paso3;
          tabs[0].click();
          await esperar(win, 80);
        } else {
          r['5'] = false;
        }

        // 6, 7 y 8 · menú «Ordenar»
        const disparador = () => empieza(doc, 'button', 'Ordenar') || empieza(doc, 'span, a', 'Ordenar');
        const opcion = () => exacto(doc, 'button', 'Más recientes');
        const visible = (el) => Boolean(el && el.isConnected && el.getClientRects().length > 0);
        const d = disparador();
        r['6'] = false; r['7'] = false; r['8'] = false;
        if (d) {
          const antes = d.getAttribute('aria-expanded');
          d.focus && d.focus();
          d.click();
          await esperar(win, 150);
          const d2 = disparador();
          r['6'] = d2.tagName === 'BUTTON' && antes === 'false' && d2.getAttribute('aria-expanded') === 'true';
          const a = doc.activeElement;
          r['7'] = Boolean(a && a.tagName === 'BUTTON' && ['Más recientes', 'Más antiguas', 'Por código'].includes(limpiar(a.textContent).replace(/^✓\s*/, '')) &&
            limpiar(a.textContent).endsWith('Más recientes'));
          tecla(win, doc.activeElement && doc.activeElement !== doc.body ? doc.activeElement : d2, 'Escape');
          await esperar(win, 150);
          const d3 = disparador();
          r['8'] = !visible(opcion()) && doc.activeElement === d3 && d3.tagName === 'BUTTON';
          if (visible(opcion())) { opcion().click(); await esperar(win, 100); }
        }
        return r;
      },
    },

    B1: {
      pagina: 'labB-1-rutas/index.html#/',
      nombre: 'Laboratorio B · Etapa 1 · Navegación en una SPA',
      checks: [
        { id: '1', titulo: 'Las opciones del menú son enlaces', criterio: '2.1.1 Teclado (A) · 4.1.2 (A)',
          pista: '<NavLink to={p.ruta} end>{p.texto}</NavLink> en lugar del span con onClick.' },
        { id: '2', titulo: 'La página actual está marcada con aria-current="page"', criterio: '1.3.1 (A)',
          pista: 'NavLink lo pone solo en el enlace activo. Con «end» en la ruta «/».' },
        { id: '3', titulo: 'El menú es un <nav> con nombre', criterio: '1.3.1 (A) · 2.4.1 (A)',
          pista: '<nav className="menu" aria-label="Menú principal">' },
        { id: '4', titulo: 'El título de la pestaña cambia en cada página', criterio: '2.4.2 Titulado de páginas (A)',
          pista: 'useEffect(() => { document.title = `${titulo} · Canal de denuncias`; }, [titulo]);' },
        { id: '5', titulo: 'Al cambiar de página, el foco va al título', criterio: '2.4.3 (A) · 4.1.3 (AA)',
          pista: '<h1 ref={encabezado} tabIndex={-1}> y encabezado.current.focus() en el useEffect (salvo en la primera carga).' },
        { id: '6', titulo: 'Hay un enlace para saltar al contenido y no rompe la ruta', criterio: '2.4.1 Evitar bloques (A)',
          pista: 'Primer elemento: <a className="saltar" href="#contenido" onClick={saltar}>. En saltar(): preventDefault() y foco al <main tabIndex={-1}>.' },
      ],
      async ejecutar(doc, win) {
        const r = {};
        const zona = doc.querySelector('nav') || doc.querySelector('.menu') || doc;
        const items = ['Canal de denuncias', 'Reporta una denuncia', 'Mis denuncias'].map((t) => exacto(doc, 'a, span, button, div, li', t, zona));
        const items2 = items.map((el) => (el && el.tagName === 'LI' ? el.querySelector('a, span, button') || el : el));
        r['1'] = items2.every((el) => el && el.tagName === 'A' && el.getAttribute('href'));
        r['2'] = Boolean(items2[0] && items2[0].getAttribute('aria-current') === 'page' && items2.slice(1).every((el) => el && el.getAttribute('aria-current') !== 'page'));
        const nav = doc.querySelector('nav');
        r['3'] = Boolean(nav && nombre(nav, doc, true));

        // 4 y 5 · ir a «Reporta una denuncia» desde el menú
        if (items2[1]) {
          items2[1].focus && items2[1].focus();
          items2[1].click();
          await esperar(win, 300);
        }
        r['4'] = /Reporta una denuncia/.test(doc.title);
        const activo = doc.activeElement;
        r['5'] = Boolean(activo && (activo.tagName === 'H1' || activo.tagName === 'MAIN') && /Reporta una denuncia/.test(activo.textContent));

        // 6 · enlace para saltar
        const primero = enfocables(doc)[0];
        if (primero && primero.tagName === 'A' && /saltar/i.test(primero.textContent)) {
          const ruta = win.location.hash;
          primero.click();
          await esperar(win, 200);
          const a = doc.activeElement;
          r['6'] = win.location.hash === ruta && Boolean(a && (a.tagName === 'MAIN' || a.closest('main') === a));
        } else {
          r['6'] = false;
        }
        return r;
      },
    },

    B2: {
      pagina: 'labB-2-formulario/index.html',
      nombre: 'Laboratorio B · Etapa 2 · Formularios y errores',
      checks: [
        { id: '1', titulo: 'Cada campo tiene una <label> asociada', criterio: '1.3.1 (A) · 3.3.2 Etiquetas o instrucciones (A)',
          pista: 'const id = useId(); <label htmlFor={id}>… <input id={id} …>' },
        { id: '2', titulo: 'Los campos dicen que son obligatorios', criterio: '3.3.2 (A)',
          pista: 'required en cada input y el * con aria-hidden="true".' },
        { id: '3', titulo: '«Siguiente» no está desactivado', criterio: '3.3.1 Identificación de errores (A)',
          pista: 'Quita disabled={hayErrores}: al pulsar «Siguiente», la persona descubre qué falta.' },
        { id: '4', titulo: 'Al enviar con errores, los campos quedan marcados como no válidos', criterio: '3.3.1 (A) · 4.1.2 (A)',
          pista: 'aria-invalid={error ? true : undefined} en el input.' },
        { id: '5', titulo: 'Cada error dice qué hacer y está asociado a su campo', criterio: '3.3.1 (A) · 3.3.3 Sugerencias (AA)',
          pista: 'Mensajes concretos y aria-describedby con el id del error (y de la ayuda).' },
        { id: '6', titulo: 'El foco va al primer campo con error', criterio: '3.3.1 (A) · 2.4.3 (A)',
          pista: 'Un useRef por campo (forwardRef en Campo) y refs[primero].current.focus() al validar.' },
        { id: '7', titulo: '«Datos guardados» se anuncia', criterio: '4.1.3 Mensajes de estado (AA)',
          pista: '<p className="estado" role="status">{estado}</p> siempre montado.' },
      ],
      async ejecutar(doc, win) {
        const r = {};
        const campo = (n) => doc.querySelector(`input[name="${n}"]`);
        const nombres = ['nombre', 'email', 'telefono'];
        r['1'] = nombres.every((n) => campo(n) && etiquetasDe(campo(n), doc).some((l) => limpiar(textoAccesible(l))));
        r['2'] = nombres.every((n) => campo(n) && (campo(n).required || campo(n).getAttribute('aria-required') === 'true'));
        const boton = exacto(doc, 'button', 'Siguiente');
        r['3'] = Boolean(boton && !boton.disabled && boton.getAttribute('aria-disabled') !== 'true');
        const regiones = Array.from(doc.querySelectorAll('[role="status"], [role="alert"], [aria-live="polite"], [aria-live="assertive"]'));
        const vacias = regiones.filter((x) => limpiar(x.textContent) === '');

        const antes = {};
        nombres.forEach((n) => { antes[n] = campo(n) ? textoDeIds(campo(n).getAttribute('aria-describedby'), doc) : ''; });
        const form = doc.querySelector('form');
        if (form) {
          enviarFormulario(win, form);
          await esperar(win, 250);
        }
        r['4'] = nombres.every((n) => campo(n) && campo(n).getAttribute('aria-invalid') === 'true');
        r['5'] = nombres.every((n) => {
          const texto = campo(n) ? textoDeIds(campo(n).getAttribute('aria-describedby'), doc) : '';
          return texto.length >= antes[n].length + 15 && !/campo incorrecto/i.test(texto);
        });
        r['6'] = doc.activeElement === campo('nombre');

        // 7 · datos correctos y enviar
        if (form && campo('nombre')) {
          escribir(win, campo('nombre'), 'María');
          await esperar(win, 30);
          escribir(win, campo('email'), 'maria@empresa.com');
          await esperar(win, 30);
          escribir(win, campo('telefono'), '600000000');
          await esperar(win, 60);
          enviarFormulario(win, form);
          await esperar(win, 250);
        }
        r['7'] = vacias.length > 0 && vacias.some((x) => x.isConnected && /Datos guardados/.test(x.textContent));
        return r;
      },
    },
    B3: {
      pagina: 'labB-3-design-system/index.html',
      nombre: 'Laboratorio B · Etapa 3 · Biblioteca de componentes',
      checks: [
        { id: '1', titulo: '<Boton> pinta un <button> de verdad', criterio: '2.1.1 Teclado (A) · 4.1.2 (A)',
          pista: 'return <button type="button" className={`boton ${variante}`} onClick={onClick}>{children}</button>;' },
        { id: '2', titulo: '<BotonIcono> usa su «etiqueta» como nombre y el icono está oculto', criterio: '1.1.1 (A) · 4.1.2 (A)',
          pista: 'aria-label={etiqueta} en el botón y aria-hidden="true" focusable="false" en el svg de <Icono>.' },
        { id: '3', titulo: '<Enlace> tiene href', criterio: '2.1.1 (A) · 4.1.2 (A)',
          pista: '<a className="enlace" href={`#${a}`}>{children}</a> (sin onClick).' },
        { id: '4', titulo: 'El título de <Tarjeta> es un encabezado', criterio: '1.3.1 Información y relaciones (A) · 2.4.6 (AA)',
          pista: 'const Encabezado = `h${nivel}`; con nivel = 2 por defecto, y <Encabezado>{titulo}</Encabezado>.' },
        { id: '5', titulo: '<Interruptor> es un control con nombre y estado que funciona', criterio: '4.1.2 (A) · 2.1.1 (A)',
          pista: '<button type="button" role="switch" aria-checked={activo} aria-labelledby={id}> (o un checkbox nativo con su label).' },
        { id: '6', titulo: '<CampoBusqueda> tiene una etiqueta de verdad (no solo placeholder)', criterio: '1.3.1 (A) · 3.3.2 (A) · 2.5.3 (A)',
          pista: 'const id = React.useId(); <label htmlFor={id}>{etiqueta}</label><input id={id} …>' },
        { id: '7', titulo: 'Ningún componente usa tabIndex positivo', criterio: '2.4.3 Orden del foco (A)',
          pista: 'Quita tabIndex={1}. Solo se usan 0 (entra en el orden) y -1 (foco solo por código).' },
        { id: '8', titulo: 'Ningún componente quita el contorno del foco', criterio: '2.4.7 Foco visible (AA)',
          pista: 'Quita style={{ outline: \'none\' }}: el foco visible ya lo da estilos.css con :focus-visible.' },
      ],
      async ejecutar(doc, win) {
        const r = {};
        const nuevo = exacto(doc, 'button, div, span, a', 'Nuevo borrador');
        const guardar = exacto(doc, 'button, div, span, a', 'Guardar preferencias');
        r['1'] = Boolean(nuevo && guardar && nuevo.tagName === 'BUTTON' && guardar.tagName === 'BUTTON');

        const iconos = Array.from(doc.querySelectorAll('button')).filter((b) => b.querySelector('svg'));
        const nombres = iconos.map((b) => nombre(b, doc));
        r['2'] = iconos.length >= 6 && nombres.every(Boolean) && new Set(nombres).size === nombres.length &&
          iconos.every((b) => b.querySelector('svg').getAttribute('aria-hidden') === 'true');

        const enlaces = ['Ayuda', 'Política de privacidad'].map((t) => exacto(doc, 'a, span, button', t));
        r['3'] = enlaces.every((a) => a && a.tagName === 'A' && a.getAttribute('href'));

        const titulos = ['Borradores sin enviar', 'Preferencias de aviso'].map((t) => exacto(doc, 'h1, h2, h3, h4, h5, h6, div, span, p', t));
        r['4'] = titulos.every((h) => h && /^H[2-6]$/.test(h.tagName));

        const candidatos = Array.from(doc.querySelectorAll('[role="switch"], input[type="checkbox"]'));
        const sw = candidatos.find((c) => /Avisarme por email/.test(nombre(c, doc)));
        if (sw && (sw.tagName === 'BUTTON' || sw.tagName === 'INPUT')) {
          const estado = () => (sw.tagName === 'INPUT' ? String(sw.checked) : sw.getAttribute('aria-checked'));
          const antes = estado();
          sw.click();
          await esperar(win, 100);
          const despues = estado();
          r['5'] = antes === 'true' && despues === 'false';
          sw.click();
          await esperar(win, 80);
        } else {
          r['5'] = false;
        }

        const busqueda = doc.querySelector('input.busqueda') || doc.querySelector('input[type="search"], input[type="text"]');
        r['6'] = Boolean(busqueda && /Buscar borrador/.test(nombre(busqueda, doc)));

        r['7'] = Array.from(doc.querySelectorAll('[tabindex]')).every((el) => !(parseInt(el.getAttribute('tabindex'), 10) > 0));

        r['8'] = Array.from(doc.querySelectorAll('a, button, input, select, textarea, [tabindex]')).every((el) =>
          el.style.outlineStyle !== 'none' && !/^0(px)?$/.test(el.style.outlineWidth) && el.style.outline !== 'none' && el.style.outline !== '0');
        return r;
      },
    },
  };

  async function ejecutar(doc, win, lab) {
    const def = LABS[lab];
    let r = {};
    try {
      r = await def.ejecutar(doc, win);
    } catch (e) {
      r = { error: String(e) };
    }
    return def.checks.map((c) => ({ id: c.id, titulo: c.titulo, criterio: c.criterio, pista: c.pista, ok: Boolean(r[c.id]) }));
  }

  global.Comprobador3 = { LABS, ejecutar };
})(typeof window !== 'undefined' ? window : globalThis);
