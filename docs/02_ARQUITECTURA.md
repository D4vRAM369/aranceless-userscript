# Arquitectura y decisiones

## Decisión 1: filtrar por servidor + por DOM

- **AliExpress:** forzar el parámetro de URL `shipFromCountry` (filtra el servidor) y además ocultar tarjetas por texto.
- **Temu:** sin parámetro conocido → solo ocultar tarjetas que no muestren etiqueta de almacén local.
- **Por qué texto y no clases CSS:** ambas webs ofuscan y cambian las clases a menudo.
- **Por qué MutationObserver:** el scroll infinito añade tarjetas nuevas sin recargar la página.
