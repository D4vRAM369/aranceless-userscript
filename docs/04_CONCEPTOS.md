# Conceptos aprendidos

_(Se irá rellenando durante el proyecto.)_

## Sesión 1 — 2026-10-28

- **Observar antes de escribir el patrón:** la etiqueta real de Temu era "Local", no "Almacén local". Se supuso sin mirar y habría ocultado todo.
- **Prueba de control:** repetir el experimento quitando al sospechoso. Un navegador limpio sin el script también recibió el CAPTCHA, así que el script era inocente.
- **Ingeniería inversa de parámetros:** usar el filtro de la web a mano y mirar qué cambia en la URL (`shpf_co=EU`).
- **Selectores acotados:** `a[href*="/item/"]` también encontraba la cesta; `#card-list a[...]` solo los resultados. Un selector demasiado amplio no da error: miente en silencio.
- **Estados de la interfaz:** que la insignia distinga "funciona", "no hay nada" y "bloqueado" evita confundir una página vacía con un fallo.
- **El evento que ya pasó:** antes de esperar a `DOMContentLoaded`, comprobar `document.readyState`.
- **Fixtures:** una réplica local de Temu permitió probar sin depender del antibot.
