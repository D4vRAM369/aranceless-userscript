# AranceLess explicado como una clase de DAW/DAM

> Guía para entender el proyecto desde cero, como si fuera una unidad didáctica de un ciclo de Desarrollo de Aplicaciones Web.

## Lección 1 — ¿Qué es un userscript y por qué existe?

Una web es un documento (HTML) que tu navegador dibuja. Un **userscript** es un trozo de JavaScript que tú añades a esa web, como unas gafas con filtro que solo te pones al entrar en ciertas tiendas. No cambia la tienda: cambia **lo que tú ves**.

**Por qué importa:** casi todo el desarrollo web consiste en leer y modificar el DOM, el árbol de elementos de una página. Un userscript es la forma más directa de practicarlo sobre webs reales.

## Lección 2 — Leer la página: selectores

Para ocultar productos primero hay que **encontrarlos**. `document.querySelectorAll('a[href*="-g-"]')` significa "dame todos los enlaces cuya dirección contenga `-g-`", que en Temu es el formato de las URL de producto.

**Analogía:** buscar en una biblioteca todos los libros con lomo rojo. Si el criterio es demasiado amplio, te llevas también los de la estantería de al lado (la cesta de AliExpress).

## Lección 3 — Páginas que cambian: MutationObserver

Las tiendas cargan productos a medida que haces scroll. Un `MutationObserver` es un portero que avisa cada vez que entra algo nuevo, para volver a revisar.

## Lección 4 — Esperar sin congelar: async/await

La autocarga pulsa "Ver más", espera de 3 a 4 segundos y repite. `await` hace esa pausa sin bloquear el resto de la página, como poner un temporizador en el horno y seguir cocinando.

## Lección 5 — Depurar como un científico

1. Observar (DevTools, consola, red).
2. Formular una hipótesis ("lo rompe el script").
3. **Prueba de control** (quitar el script y repetir).
4. Concluir con datos, no con intuiciones.

## Lección 6 — Publicar: git, GitHub y licencias

`git init` → `commit` → `gh repo create --push`. La licencia MIT dice qué pueden hacer otros con tu código. Las líneas `@updateURL`/`@downloadURL` convierten el repo en el canal de actualizaciones.
