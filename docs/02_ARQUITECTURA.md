# Arquitectura y decisiones

## Decisión 1: filtrar por servidor + por DOM

- **AliExpress:** forzar el parámetro de URL `shipFromCountry` (filtra el servidor) y además ocultar tarjetas por texto.
- **Temu:** sin parámetro conocido → solo ocultar tarjetas que no muestren etiqueta de almacén local.
- **Por qué texto y no clases CSS:** ambas webs ofuscan y cambian las clases a menudo.
- **Por qué MutationObserver:** el scroll infinito añade tarjetas nuevas sin recargar la página.

## Decisiones de la sesión 1 (2026-10-28)

| Decisión | Por qué | Alternativa rechazada |
|---|---|---|
| AliExpress: filtrar en el servidor con `shpf_co=EU` | El servidor ya sabe el origen; es lo más fiable | `shipFromCountry` (solo admite un país) |
| Temu: filtrar en el navegador por la etiqueta "Local" | Temu no tiene filtro de almacén en la búsqueda | — |
| No llamar a la API privada de Temu | Está protegida por el antibot: parecería un bot y se rompería a menudo | Pedir más productos directamente a su API |
| Búsqueda en Almacén local a través del `#hash` | El hash no llega al servidor y sobrevive a la carga | Parámetro `?query` (lo ve el servidor) |
| Ocultar con CSS (`data-aranceless` + `display:none`) | Reversible con un clic y sin borrar nodos | Eliminar tarjetas del DOM |
| Autocarga con pausas aleatorias de 3–4 s y tope de 15 | Ritmo humano; no machaca la web | Clics seguidos sin pausa |
| `@grant none` | Sin permisos especiales ni peticiones de red: más privado y más fácil de auditar | `GM_xmlhttpRequest` |
