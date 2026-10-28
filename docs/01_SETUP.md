# Setup del entorno

_(Pendiente: instalar Violentmonkey/Tampermonkey y cargar el script.)_

## Instalar AranceLess (2026-10-28)

1. Instala un gestor de userscripts: **Tampermonkey** (Chrome, Brave, Edge, Firefox) o **Violentmonkey** (Firefox).
2. Abre el enlace raw del script en GitHub; el gestor ofrece instalarlo.
3. **Solo en Chromium (Chrome/Brave/Edge):** `brave://extensions` → Tampermonkey → Detalles → activa **"Permitir scripts de usuario"**. Sin esto, el script no se ejecuta y no da ningún error. Si no aparece la opción, activa el "Modo desarrollador".
4. Recarga la web. Comprueba en F12 → Consola (filtra por `AranceLess`) que sale `v0.7.0 activo`.

**Si cambias el `@namespace`**, Tampermonkey lo trata como otro script: borra la versión antigua antes de instalar la nueva.

**Permiso "Descargas de la API del navegador":** Tampermonkey lo pide para `GM_download`. AranceLess usa `@grant none` y no lo necesita: puedes rechazarlo.
