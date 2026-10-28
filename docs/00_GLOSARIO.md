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
