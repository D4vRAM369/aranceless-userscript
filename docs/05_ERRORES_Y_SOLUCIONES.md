# Errores y soluciones

_(Se irá rellenando durante el proyecto.)_

## Error: Temu lo ocultaba todo (o nada)

**Fecha:** 2026-10-28
**Contexto:** primera versión, detección por el texto "Almacén local".
**Por qué ocurrió:** se supuso el texto de la etiqueta sin mirar la web. En Temu ese texto solo existe en el menú; la tarjeta dice "Local".
**Cómo se resolvió:** inspeccionando el DOM en Brave → `hasLocalTag()` busca un elemento hoja cuyo texto sea exactamente "Local".
**Qué aprendimos:** con scraping o userscripts, **primero se observa la página real y después se escribe el patrón**.

## Error: el script podía no arrancar nunca

**Fecha:** 2026-10-28
**Por qué ocurrió:** todo dependía de `DOMContentLoaded`. Si el gestor inyecta el script tarde, ese evento ya ha pasado y nadie vuelve a avisar.
**Cómo se resolvió:** `onReady(fn)` mira `document.readyState`: si ya no es `'loading'`, ejecuta `fn` al momento.
**Qué aprendimos:** antes de esperar a un evento, comprueba si ya ha ocurrido.

## Error: la etiqueta "Desde ES" aparecía en la cesta

**Fecha:** 2026-10-28
**Por qué ocurrió:** el selector `a[href*="/item/"]` encontraba cualquier enlace de producto de la página, incluidos los de la cesta lateral.
**Cómo se resolvió:** se acotó el selector a `#card-list a[href*="/item/"]`.
**Qué aprendimos:** un selector demasiado amplio no da error, **miente en silencio**. Hay que acotarlo al contenedor correcto.

## Error: varios países en `shipFromCountry`

**Por qué ocurrió:** se supuso que el parámetro aceptaba una lista. AliExpress la ignora sin avisar.
**Cómo se resolvió:** se usó el filtro real de la web, se observó la URL resultante y se adoptó `shpf_co=EU`.
**Qué aprendimos:** para descubrir la API de una web, úsala a mano y mira qué cambia en la URL.

## Error (resuelto, no era el script): Temu dice "No se pudo cargar la lista de productos… deshabilita extensiones"

**Fecha:** 2026-10-28
**Contexto:** primera ejecución real desde Tampermonkey (v0.4.0) en Brave, búsqueda "cargador usb".
**Datos:** el script funciona (consola `v0.4.0 activo`, insignia `20/20 ocultos`: ningún "Local" entre esos 20). El error de Temu **sigue apareciendo aunque se desactive el filtro**: no lo causa ocultar tarjetas. Temu cargó la primera página, pero no la siguiente.
**Hipótesis:** (1) el antibot de Temu ha marcado la sesión tras muchas recargas automáticas durante la depuración (la URL trae `refer_page_name=login`); (2) Temu detecta Tampermonkey.
**Siguiente prueba:** pestaña normal, script desactivado → ¿error? Script activado → ¿error?
**Diagnóstico (2026-10-28):**
- En Brave, las 84 peticiones de Temu devuelven 200. La lista llega dentro del HTML y Temu no pide más productos. Los datos de la página incluyen `verifyAuthToken`, la marca de que el antibot pide verificación.
- **Prueba de control:** un navegador limpio, sin extensiones ni Aranceless, va directamente a `bgn_verification.html` ("Verificación de seguridad").
- **Conclusión:** es el antibot de Temu, disparado por la navegación automatizada durante la depuración (muchas recargas y descargas de la página). Aranceless no hace peticiones de red.
**Solución:** dejar de automatizar Temu, completar tú mismo la verificación si aparece y esperar un rato.
**Qué aprendimos:** **prueba de control** = repetir el experimento quitando la pieza sospechosa. Si el fallo sigue, esa pieza es inocente.

## Observación: "en 5 estrellas y en categorías no sale nada"

**Fecha:** 2026-10-28
**Datos (una carga de `/es/channel/full-star.html` en Brave):** 55 productos y **0 etiquetas "Local"** → la insignia marca 55 fuera, 0 UE. Además el aviso antibot de Temu estaba activo, así que no cargaba más productos.
**Conclusión:** el script funciona. Esa sección simplemente no tenía stock europeo en lo que llegó a cargar. "Más vendidos" sí tenía artículos "Local".
**Qué aprendimos:** una página vacía puede significar que funciona y no hay nada que mostrar. Por eso la insignia distingue los estados.
