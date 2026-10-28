# Glosario del Proyecto

> Si encuentras una palabra que no entiendes, búscala aquí.

---

## Userscript

**En una frase:** un pequeño programa JavaScript que tu navegador ejecuta en webs concretas para cambiar cómo se ven o se comportan.
**Más técnico:** script con cabecera `// ==UserScript==` que un gestor (Tampermonkey, Violentmonkey) inyecta en las páginas cuyas URL coinciden con sus reglas `@match`.
**Analogía:** unas gafas con filtro que te pones solo al entrar en ciertas tiendas.
**En este proyecto lo usamos para:** ocultar productos que no se envían desde la UE.

## Arancel (duty)

**En una frase:** impuesto que se paga cuando una mercancía entra en un país desde fuera.
**En este proyecto:** la UE cobra ~3 € fijos por artículo en paquetes de bajo valor de fuera de la UE desde el 01/07/2026.

## MutationObserver

**En una frase:** un vigilante del navegador que te avisa cada vez que la página cambia.
**Más técnico:** API del DOM que ejecuta un callback cuando se añaden o quitan nodos (con `childList` y `subtree`).
**Analogía:** un portero que te llama cada vez que entra alguien al edificio, en vez de que tú bajes a mirar cada minuto.
**En este proyecto:** detectar las tarjetas nuevas que llegan con el scroll infinito de Temu.

## Expresión regular (regex)

**En una frase:** un patrón para buscar texto con comodines.
**En este proyecto:** `EU_TEXT` reconoce "Almacén local", "desde España", "Ships from Germany"...

## data-attribute

**En una frase:** una etiqueta propia que pegas a un elemento HTML (`data-aranceless="fuera"`) para que el CSS o el JS lo reconozcan.

## Antibot / CAPTCHA

**En una frase:** sistema con el que una web intenta distinguir personas de programas automáticos.
**Analogía:** el portero de una discoteca que te para si entras y sales diez veces en un minuto.
**En este proyecto:** Temu bloqueó la sesión ("No se pudo cargar la lista…", `verifyAuthToken`, página de "Verificación de seguridad") tras la depuración automatizada. No lo causaba el script.

## Parámetro de URL (query string)

**En una frase:** pares `clave=valor` después de `?` en una dirección web, que le dicen al servidor qué quieres.
**En este proyecto:** `shpf_co=EU` pide a AliExpress solo lo enviado desde la UE. Lo descubrimos usando su filtro a mano y mirando cómo cambiaba la URL.

## Hash / fragmento de URL (`#`)

**En una frase:** lo que va después de `#`. Se queda en el navegador y nunca viaja al servidor.
**En este proyecto:** `#aranceless=funda` lleva tu búsqueda a la sección Almacén local de Temu sin que Temu lo vea.

## async / await

**En una frase:** forma de escribir código que espera algo (un temporizador, una descarga) sin congelar la página.
**En este proyecto:** `await sleep(3000 + Math.random()*1000)` pausa la autocarga de 3 a 4 s.

## Jitter

**En una frase:** pequeña aleatoriedad añadida a un intervalo para que no sea siempre idéntico.
**En este proyecto:** las pausas de 3–4 s de la autocarga.

## Fixture (página de prueba)

**En una frase:** escenario falso y controlado que imita al real para probar código sin depender de él.
**En este proyecto:** `temu-fake/index.html` y `search.html`, con tarjetas que imitan las de Temu.

## @updateURL / @downloadURL

**En una frase:** líneas de la cabecera de un userscript que le dicen a Tampermonkey de dónde bajar las versiones nuevas.
**En este proyecto:** apuntan al archivo *raw* de GitHub; al subir `@version`, cada usuario se actualiza solo.

## SVG

**En una frase:** formato de imagen hecho de texto (formas y coordenadas) en lugar de píxeles. Se ve nítido a cualquier tamaño.
**En este proyecto:** `assets/banner.svg`, el banner del README, dibujado a mano con estrellas de la UE.

## Licencia MIT

**En una frase:** licencia de código abierto muy permisiva: cualquiera puede usar, copiar y modificar el código si conserva el aviso de autoría.
**Contraste:** GPL-3.0 (la de Allowance) obliga a que los derivados también sean GPL.

## Flair y modmail (Reddit)

**Flair:** etiqueta obligatoria en algunos subreddits para clasificar el post.
**Modmail:** mensaje privado a los moderadores de un subreddit, por ejemplo para pedir permiso antes de autopromocionarse.

## Astroturfing

**En una frase:** promocionar algo haciéndose pasar por usuarios espontáneos (cuentas falsas, textos que ocultan quién los escribe).
**En este proyecto:** lo que se evitó a propósito: cada post dice "soy el autor".
