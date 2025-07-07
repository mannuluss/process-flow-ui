# Contribuir desde este proyecto a otros

para poder enviar los cambios realizados en este repostorio hacia otras ramas remotas, se puede utilizar la siguiente logica:

1. Método manual (añadir remoto “gitlab”)
a) Crea en GitLab un proyecto vacío (sin README ni .gitignore). Copia la URL HTTPS, p. ej.
https://gitlab.com/tu-usuario/proyecto.git

b) En PowerShell, ve a tu carpeta local y añade el remoto:
```{bash}
git remote add gitlab https://gitlab.com/tu-usuario/proyecto.git
```

2. Enviar cambios a una rama en el remote de gitlab
Desde main, crea una nueva rama. Es una buena práctica darle un nombre descriptivo, como feature/nombre-funcionalidad o release/v1.2.

```{bash}
# Crea una nueva rama a partir de main y sitúate en ella
git checkout -b preparacion-para-develop
```
Esta rama (preparacion-para-develop) ahora contiene una copia exacta de tu rama main.

3. Sube la nueva rama a GitLab
Ahora, sube esta nueva rama específica a tu repositorio de GitLab.

```{bash}
# Sintaxis: git push <remoto> <nombre-de-tu-rama>
git push gitlab preparacion-para-develop
```

Al ejecutar este comando, verás un mensaje en tu terminal que a menudo incluye un enlace directo para crear el Merge Request.
```
...
remote: To create a merge request for preparacion-para-develop, visit:
remote:   https://gitlab.com/tu-usuario/proyecto/-/merge_requests/new?merge_request%5Bsource_branch%5D=preparacion-para-develop
...
```
4. Crea el Merge Request

Ahora se en gitlab se crea el merge request para mezclar los cambios con nuestra rama, si es necesario se solucionan conflictos

NOTA: esto es como utilizar un sistema de [Gitflow](https://www.atlassian.com/es/git/tutorials/comparing-workflows/gitflow-workflow)
