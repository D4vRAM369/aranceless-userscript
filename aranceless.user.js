// ==UserScript==
// @name         AranceLess — solo stock UE en AliExpress y Temu
// @namespace    https://github.com/D4vRAM369/aranceless-userscript
// @version      0.7.0
// @description  Oculta lo que no se envía desde la UE. ¿3 € de arancel por artículo? No, gracias.
// @author       D4vRAM369
// @license      MIT
// @homepageURL  https://github.com/D4vRAM369/aranceless-userscript
// @supportURL   https://github.com/D4vRAM369/aranceless-userscript/issues
// @updateURL    https://raw.githubusercontent.com/D4vRAM369/aranceless-userscript/main/aranceless.user.js
// @downloadURL  https://raw.githubusercontent.com/D4vRAM369/aranceless-userscript/main/aranceless.user.js
// @match        *://*.aliexpress.com/*
// @match        *://*.aliexpress.es/*
// @match        *://*.temu.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  // Filtro oficial de AliExpress "Envío desde": EU = toda la Unión Europea (también vale ES, FR, DE...)
  const ALI_SHIP_FROM = 'EU';
  // ponytail: detección por texto visible; si Temu cambia sus etiquetas, se añaden aquí
  const EU_TEXT = /almac[eé]n local|local warehouse|desde (espa[ñn]a|europa|la ue|francia|alemania|italia|polonia|b[eé]lgica|pa[ií]ses bajos|portugal|chequia)|from (spain|the eu|europe|france|germany|italy|poland|belgium|netherlands|portugal|czechia)/i;
  const TEMU_LINK = 'a[href*="-g-"][href*=".html"]';
  // Solo la rejilla de resultados: fuera quedan la cesta lateral (#sidecart) y otros bloques
  const ALI_LINK = '#card-list a[href*="/item/"]';

  const isEU = (text) => EU_TEXT.test(text);
  // Temu marca su stock europeo con una etiqueta verde cuyo texto es exactamente "Local" (visto 2026-10-28)
  const hasLocalTag = (card) => [...card.querySelectorAll('*')].some((e) => e.childElementCount === 0 && e.textContent.trim() === 'Local');

  // Búsqueda dentro de Almacén local: todas las palabras, sin importar tildes ni mayúsculas
  const fold = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  // ponytail: coincidencia literal; "lamparas" no encuentra "lámpara". Añadir raíces si hace falta
  const matches = (text, query) => fold(query).split(/\s+/).filter(Boolean).every((w) => fold(text).includes(w));

  // AliExpress: devuelve la URL de búsqueda con el filtro de país, o null si no hace falta
  function aliUrl(href) {
    const url = new URL(href);
    const isSearch = /\/w\/|wholesale/.test(url.pathname);
    if (!isSearch || url.searchParams.get('shpf_co') === ALI_SHIP_FROM) return null;
    url.searchParams.set('shpf_co', ALI_SHIP_FROM);
    return url.href;
  }

  // Autocomprobación: `node aranceless.user.js`
  if (typeof document === 'undefined') {
    const ok = (cond, msg) => { if (!cond) throw new Error(msg); };
    ok(isEU('Almacén local · Envío gratis'), 'etiqueta Temu ES');
    ok(isEU('Ships from Germany'), 'etiqueta EN');
    ok(!isEU('Envío gratis · 4,99 €'), 'falso positivo');
    ok(aliUrl('https://es.aliexpress.com/w/wholesale-funda.html?SearchText=funda').endsWith('shpf_co=EU'), 'añade filtro UE');
    ok(aliUrl('https://es.aliexpress.com/w/wholesale-funda.html?shpf_co=EU') === null, 'sin bucle de recarga');
    ok(aliUrl('https://es.aliexpress.com/item/123.html') === null, 'ficha de producto intacta');
    ok(matches('Lámpara de mesa LED', 'lampara led'), 'busca sin tildes y varias palabras');
    ok(!matches('Lámpara de mesa', 'lampara led'), 'exige todas las palabras');
    console.log('AranceLess: autocomprobación OK');
    return;
  }

  const VERSION = '0.7.0';
  const log = (...args) => console.info('%c[AranceLess]', 'color:#fc0;background:#003399;padding:1px 4px', ...args);
  log(`v${VERSION} activo en ${location.hostname}`);

  const CSS = `
    html:not(.aranceless-off) [data-aranceless="fuera"]{display:none!important}
    .aranceless-tag{position:absolute;top:6px;left:6px;z-index:5;padding:2px 6px;border-radius:4px;background:#003399;color:#fc0;font:600 11px system-ui;pointer-events:none}`;

  // Insignia visible: prueba de que el script está vivo en la página
  const badge = document.createElement('button');
  badge.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:2147483647;padding:8px 12px;border:0;border-radius:8px;background:#003399;color:#fc0;font:600 13px system-ui;cursor:pointer';

  // Sube desde el enlace hasta el bloque más grande que solo contiene ESE producto
  const productPaths = (el, sel) => new Set([...el.querySelectorAll(sel)].map((a) => a.pathname));
  function cardOf(link, sel) {
    let card = link;
    while (card.parentElement && productPaths(card.parentElement, sel).size === 1) card = card.parentElement;
    return card;
  }
  const cardsOf = (sel) => new Set([...document.querySelectorAll(sel)].map((link) => cardOf(link, sel)));

  // Placa azul sobre la tarjeta: la misma en AliExpress y Temu
  function tagCard(card) {
    if (card.querySelector('.aranceless-tag')) return;
    if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
    const tag = document.createElement('span');
    tag.className = 'aranceless-tag';
    tag.textContent = '🇪🇺 Desde la UE · 0 € arancel';
    card.prepend(tag);
  }

  // Prepara estilos, insignia y vigilante de cambios; `scan` se repite cuando llegan tarjetas nuevas
  function start(scan, ...extras) {
    const go = () => {
      const style = document.createElement('style');
      style.textContent = CSS;
      document.head.append(style);
      document.body.append(badge, ...extras);
      let timer;
      new MutationObserver(() => { clearTimeout(timer); timer = setTimeout(scan, 300); })
        .observe(document.body, { childList: true, subtree: true });
      scan();
    };
    // Si el gestor inyecta tarde, DOMContentLoaded ya pasó: arrancar igualmente
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
    else go();
  }

  // --- AliExpress: el servidor filtra; forzamos el parámetro, etiquetamos y quitamos anuncios ---
  if (location.hostname.includes('aliexpress')) {
    const target = aliUrl(location.href);
    if (target) {
      log('recargando con filtro', ALI_SHIP_FROM, '→', target);
      location.replace(target);
      return;
    }
    const filtered = new URL(location.href).searchParams.get('shpf_co') === ALI_SHIP_FROM;
    badge.title = filtered ? 'Clic: mostrar/ocultar anuncios (se saltan el filtro)' : 'Aquí no hay búsqueda que filtrar';
    badge.onclick = () => document.documentElement.classList.toggle('aranceless-off');
    start(() => {
      if (!filtered) { badge.textContent = '🇪🇺 AranceLess: activo'; return; }
      let tagged = 0;
      for (const card of cardsOf(ALI_LINK)) {
        // Los anuncios se cuelan aunque el filtro esté activo (visto 2026-10-28): origen no garantizado
        if (/publicidad|patrocinado/i.test(card.innerText)) { card.dataset.aranceless = 'fuera'; continue; }
        card.dataset.aranceless = 'ue';
        tagged++;
        tagCard(card);
      }
      const ads = document.querySelectorAll('[data-aranceless="fuera"]').length;
      const text = `🇪🇺 AranceLess: ${tagged} UE ✓ · ${ads} anuncios ocultos`;
      if (badge.textContent !== text) log(`${tagged} tarjetas UE, ${ads} anuncios ocultos`);
      badge.textContent = text;
    });
    // ponytail: solo recargas completas; si AliExpress cambia de búsqueda sin recargar, añadir vigilancia de URL
    return;
  }

  // --- Temu: ocultar tarjetas sin etiqueta de almacén UE ---
  // Temu no deja buscar dentro de Almacén local: la búsqueda viaja en el #hash y la filtramos aquí
  const LOCAL_PATH = '/es/channel/local-warehouse.html';
  const inLocal = location.pathname.includes('local-warehouse');
  const query = inLocal ? decodeURIComponent(location.hash.match(/aranceless=([^&]*)/)?.[1] || '') : '';
  const searched = new URL(location.href).searchParams.get('search_key');

  badge.title = 'Clic: mostrar/ocultar lo de fuera de la UE';
  badge.onclick = () => document.documentElement.classList.toggle('aranceless-off');
  const extras = [];
  if (searched) {
    const jump = document.createElement('a');
    jump.href = `${LOCAL_PATH}#aranceless=${encodeURIComponent(searched)}`;
    jump.textContent = `🔎 «${searched}» en Almacén local`;
    jump.style.cssText = badge.style.cssText + ';bottom:60px;text-decoration:none';
    extras.push(jump);
  }

  // Autocarga: pulsa «Ver más» con pausas humanas hasta sumar MORE_GOAL artículos UE
  const MORE_GOAL = 20;
  const MORE_MAX_CLICKS = 15; // tope por si una búsqueda casi no tiene nada europeo
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const countUE = () => document.querySelectorAll('[data-aranceless="ue"]').length;
  const isBlocked = () => location.pathname.includes('verification') || /No se pudo cargar la lista de productos/.test(document.body.innerText);
  const findMoreButton = () => [...document.querySelectorAll('button, [role="button"]')]
    .find((b) => /^ver m[aá]s/i.test(b.textContent.trim()) && b.offsetParent);
  const more = document.createElement('button');
  more.style.cssText = badge.style.cssText + ';bottom:104px';
  more.textContent = `➕ ${MORE_GOAL} UE más`;
  let loading = false;
  async function loadMore() {
    if (loading) return;
    loading = true;
    const goal = countUE() + MORE_GOAL;
    let why = 'objetivo cumplido';
    for (let clicks = 0; countUE() < goal; clicks++) {
      const button = findMoreButton();
      if (isBlocked()) { why = 'Temu bloqueó'; break; }
      if (!button) { why = 'no hay más'; break; }
      if (clicks === MORE_MAX_CLICKS) { why = `tope de ${MORE_MAX_CLICKS} cargas`; break; }
      button.click();
      more.textContent = `⏳ ${countUE()}/${goal} UE · carga ${clicks + 1}`;
      await sleep(3000 + Math.random() * 1000); // 3–4 s entre clics: ritmo de persona, no de bot
    }
    log(`autocarga terminada: ${countUE()} UE (${why})`);
    more.textContent = `➕ ${MORE_GOAL} UE más · ${why}`;
    loading = false;
  }
  more.onclick = loadMore;
  if (searched || query) {
    extras.push(more);
    setTimeout(loadMore, 3500); // arranca sola al buscar, tras la primera tanda
  }

  start(() => {
    for (const card of cardsOf(TEMU_LINK)) {
      if (query) {
        // En Almacén local todo es UE: aquí solo se filtra por las palabras buscadas
        card.dataset.aranceless = matches(card.innerText, query) ? 'ue' : 'fuera';
        if (card.dataset.aranceless === 'ue') tagCard(card);
        continue;
      }
      // Las etiquetas pueden cargar tarde: solo damos por buena una tarjeta ya marcada como UE
      if (card.dataset.aranceless !== 'ue') card.dataset.aranceless = hasLocalTag(card) || isEU(card.innerText) ? 'ue' : 'fuera';
      if (card.dataset.aranceless === 'ue') tagCard(card);
    }
    const hidden = document.querySelectorAll('[data-aranceless="fuera"]').length;
    const total = document.querySelectorAll('[data-aranceless]').length;
    // Que la insignia distinga "Temu me bloquea" de "no hay nada de la UE" de "todo bien"
    const blocked = isBlocked();
    let text = `🇪🇺 AranceLess: ${total - hidden} UE ✓ · ${hidden} ocultos`;
    if (total && hidden === total) text = `🇪🇺 AranceLess: 0 de la UE entre ${total} · clic para ver todo`;
    if (query) text = `🔎 «${query}»: ${total - hidden} de ${total}`;
    if (blocked) text = '⚠️ Temu bloqueó la carga (antibot), no es AranceLess';
    if (badge.textContent !== text) log(text);
    badge.textContent = text;
  }, ...extras);
})();
