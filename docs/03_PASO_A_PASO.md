# Paso a paso

## Sesión 1 — 2026-10-28

**Contexto:** análisis de viabilidad (sí es posible) y elección de nombre.

**Nombre elegido:** Aranceless (arancel + *-less*), reivindicativo y bilingüe.

## Paso 1: Primera versión del userscript (`aranceless.user.js`)

**Qué vamos a hacer:** un único archivo que en AliExpress fuerza el filtro de país de envío y en Temu oculta las tarjetas sin etiqueta de almacén UE.

**Por qué lo hacemos así:**
- AliExpress ya tiene el filtro en su servidor (`shipFromCountry=ES`): basta con añadirlo a la URL. Es lo más fiable, porque la web nos devuelve directamente solo lo de ese país.
- Temu no tiene un parámetro conocido, así que leemos el texto visible de cada tarjeta y buscamos "Almacén local" o "desde España".
- Ocultamos con **CSS** (`display:none` según un atributo `data-aranceless`) y no borramos nodos: es reversible con un clic en la insignia.

**Resultado esperado:** en Temu aparece abajo a la derecha la insignia `🇪🇺 Aranceless: X/Y ocultos`; en AliExpress la búsqueda se recarga sola con el filtro de España.

> 💡 **Nota para aprendices:** el script se puede ejecutar con `node aranceless.user.js`. Fuera del navegador no existe `document`, así que en ese caso solo se ejecutan las autocomprobaciones y el script termina.

> ⚠️ **Errores comunes:** si Temu cambia sus textos o el formato de las URL de producto (`-g-…html`), la insignia mostrará 0/0 o lo ocultará todo. Hay que ajustar `EU_TEXT` o `TEMU_LINK`.

**Verificación:** `node aranceless.user.js` → `Aranceless: autocomprobación OK`.

## Paso 2: Indicador de actividad y depuración real en Brave (v0.2.1)

**Qué hicimos:** la insignia azul aparece ahora en **las dos webs** y cada acción deja una línea `[Aranceless]` en la consola (F12 → Consola).

**Qué descubrimos depurando en Brave:**
- **Temu** no pone "Almacén local" en cada tarjeta: ese texto es solo un enlace del menú. La marca real es una **etiqueta verde con la palabra exacta "Local"**, y la sección completa está en `/es/channel/local-warehouse.html`.
- Con la etiqueta corregida, una búsqueda de "funda movil" dio `38/40 ocultos`: quedaron las 2 tarjetas Local.
- **AliExpress:** `shipFromCountry=ES` activa el filtro oficial "Envío desde: España"; 0 resultados "desde China".

**Verificación:** `node aranceless.user.js`, y en Temu la insignia muestra `X/Y ocultos` mientras la consola registra el mismo número.

## Paso 3: Toda la UE + etiqueta por tarjeta en AliExpress (v0.4.0)

**Qué hicimos:**
- **Toda la UE, no solo España.** El parámetro `shipFromCountry` admite un único país (con `ES,FR,DE` AliExpress lo ignora). Al pulsar en su filtro "Envío desde → Unión Europea" descubrimos el parámetro real: **`shpf_co=EU`**.
- **Etiqueta** `🇪🇺 Desde la UE · 0 € arancel` en cada tarjeta de resultados.
- **Anuncios fuera:** las tarjetas "Publicidad" se cuelan aunque el filtro esté activo (una prometía entrega hasta el 13 de nov., señal de que venía de fuera). Se ocultan; un clic en la insignia las muestra.
- **Solo dentro de `#card-list`:** la primera versión etiquetaba también la cesta lateral (`#sidecart`), y eso era información falsa.

**Resultado en Brave:** `🇪🇺 Aranceless: 17 UE ✓ · 5 anuncios ocultos`, con 0 etiquetas en la cesta.
**Temu:** sin cambios; la etiqueta "Local" ya cubre cualquier almacén europeo.

## Paso 4: Placas en Temu e insignia que explica la página vacía (v0.5.0)

**Problema:** en Temu, el usuario veía la página vacía y sin ninguna placa.
**Diagnóstico (con una sola carga para no despertar el antibot):**
- En "funda movil" había **0 tarjetas "Local" de 35**: el 35/35 era correcto, pero desde fuera parece que no funciona.
- Temu seguía mostrando su aviso de bloqueo, así que no cargaba más productos.
- El panel "Filtros" de Temu **no tiene filtro de almacén local**: "Enviado por" solo ofrece "Temu". A diferencia de AliExpress, el filtrado tiene que hacerse en el navegador.

**Cambios:**
- `tagCard()` compartida: la misma placa `🇪🇺 Desde la UE · 0 € arancel` en AliExpress y en Temu.
- La insignia de Temu distingue tres estados: `N UE ✓ · M ocultos`, `0 de la UE entre N · clic para ver todo` y `⚠️ Temu bloqueó la carga (antibot), no es Aranceless`.

**Verificación:** página local que imita las tarjetas de Temu (con una segunda tanda tardía): placas en las 2 tarjetas Local, mensaje de vacío y mensaje de bloqueo. Todo OK, sin tocar Temu.
**Consejo de uso:** para comprar en Temu sin arancel, entra por **Almacén local** (`/es/channel/local-warehouse.html`), donde todo es Local.

## Paso 5: Buscar «X» solo en lo europeo de Temu (v0.6.0)

**Problema:** la búsqueda normal de Temu casi no trae artículos "Local" y además su antibot la bloquea. La sección Almacén local sí carga bien, pero no tiene buscador propio.
**Investigación:**
- La petición que trae más productos en Almacén local es privada y está protegida por el antibot. **Decisión: no llamarla desde el script**, porque parecería un bot, podría bloquear la cuenta y se rompería a menudo.
- Lo que sí funciona: un `#hash` en la URL sobrevive a la carga de la sección (`#aranceless=funda` comprobado en Brave).
**Solución:**
1. En una búsqueda de Temu aparece el botón `🔎 «X» en Almacén local`.
2. Lleva a `/es/channel/local-warehouse.html#aranceless=X`.
3. Allí Aranceless solo muestra las tarjetas que contienen **todas** las palabras, sin importar tildes ni mayúsculas (`fold()` + `matches()`).
4. La insignia indica `🔎 «X»: N de M` y recuerda que «Ver más» carga más productos.
**Límite honesto:** se filtra lo que Temu ya ha cargado (unos 40 por cada «Ver más»). En la prueba hubo 4 «funda» y 0 «lampara» entre 80.
**Verificación:** `node aranceless.user.js` (incluye 2 pruebas de `matches`) y la comprobación del hash y del filtro en Temu real.

## Paso 6: Autocarga de +20 artículos UE con pausas de 3–4 s (v0.7.0)

**Qué hace:** al buscar en Temu (o al entrar en Almacén local con `#aranceless=X`), el script pulsa «Ver más» por su cuenta, con pausas aleatorias de 3–4 s, hasta sumar **20 artículos UE más**. El botón `➕ 20 UE más` repite la operación.
**Cuándo para:** objetivo cumplido · ya no hay botón «Ver más» · Temu bloquea · tope de 15 cargas (por si la búsqueda casi no tiene nada europeo).
**Por qué una pausa aleatoria y no fija:** un intervalo idéntico cada vez es una huella típica de bot; 3000 + `Math.random()*1000` ms se parece más a una persona.
**Verificación:** réplica `temu-fake/search.html` (1 Local al inicio, 5 por cada «Ver más»): 4 cargas, separaciones de 3,2–3,8 s, final en 21 UE con "objetivo cumplido".
**Riesgo:** sigue siendo automatización. Si reaparece el bloqueo de Temu, bajar `MORE_GOAL` o desactivar el arranque automático.

**Pendiente:** verificar la autocarga en Temu real (hasta ahora solo probada en la réplica local).

## Paso 7: Publicación (2026-10-28)

- Proyecto movido a una carpeta propia y convertido en repo git.
- Cabecera con `@author D4vRAM369`, `@license MIT`, `@updateURL`/`@downloadURL` (raw de GitHub) y `@namespace` del repo.
- `README.md` con el banner SVG, badges, instalación, límites, privacidad y resumen en inglés. `LICENSE` MIT. `.gitignore` con `docs/transcripts/` y `.omc/`.
- Repo público creado: https://github.com/D4vRAM369/aranceless-userscript (commit `07c5b24`, 7 temas).
- Difusión en Reddit con posts que declaran la autoría: r/userscripts (AranceLess), r/fossdroid (Allowance Privacy), r/ClaudeAI (ProfesorIA). Pendientes de permiso de los mods: r/spain y la comunidad de Plaud.

## Sesión 1 — 2026-10-28 · Resumen

**Progreso:** de la pregunta "¿es posible?" a AranceLess v0.7.0 publicado en GitHub.
**Conceptos nuevos:** userscripts, MutationObserver, selectores acotados, parámetros y hash de URL, async/await con jitter, antibot/CAPTCHA, prueba de control, fixtures, @updateURL, licencias MIT/GPL, promoción honesta en comunidades.
**Errores resueltos:** etiqueta "Local" mal supuesta, `DOMContentLoaded` tardío, etiquetas en la cesta, lista de países en `shipFromCountry`, falso culpable del antibot.
**Próximo paso:** probar la v0.7.0 en Temu real con la sesión ya desbloqueada; GreasyFork; idiomas para la autocarga.
