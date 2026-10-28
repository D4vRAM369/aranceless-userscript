# Comandos y manual

## Instalar
1. Instala la extensión Violentmonkey (o Tampermonkey).
2. Abre el panel de la extensión → "+" → pega el contenido de `aranceless.user.js` → guarda.

## Usar
- **AliExpress:** busca normal; la página se recarga con `shpf_co=EU` (filtro oficial "Envío desde: Unión Europea"). Para un solo país cambia `ALI_SHIP_FROM` (p. ej. `ES`). Clic en la insignia = mostrar/ocultar anuncios.
- **Temu:** clic en la insignia azul para mostrar u ocultar lo de fuera de la UE.

## Comprobar
```bash
node aranceless.user.js
```

## ¿Está funcionando?
- Insignia azul abajo a la derecha: `🇪🇺 Aranceless: X/Y ocultos` (Temu) o `N UE ✓ · M anuncios ocultos` (AliExpress).
- F12 → Consola → filtra por `Aranceless`.
- No aparece nada en Brave → `brave://extensions` → Tampermonkey → Detalles → activa **"Permitir scripts de usuario"** (en Chromium con MV3 es obligatorio).
