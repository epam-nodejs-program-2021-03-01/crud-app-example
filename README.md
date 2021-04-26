# crud-app-example

## Environments:

Notice that any push to non-development environment branch automatically triggers deploy to that environment, as in `git push staging main` deploys to staging.

### 🔴 Production

- Link: https://epam-crud-app-example-prod.herokuapp.com/
- Branch: `main`
- Git link: https://git.heroku.com/epam-crud-app-example-prod.git
- Git remote: `prod`

	```sh
	git remote add prod https://git.heroku.com/epam-crud-app-example-prod.git
	```

### 🟡 Staging

- Link: https://epam-crud-app-example-staging.herokuapp.com/
- Branch: `staging`
- Git link: https://git.heroku.com/epam-crud-app-example-staging.git
- Git remote: `staging`

	```sh
	git remote add staging https://git.heroku.com/epam-crud-app-example-staging.git
	```

### 🔵 Development

> Local development machine.

- Link: _(localhost)_
- Branch: _(any `feature/*` branch)_
- Git link: https://github.com/epam-nodejs-program-2021-03-01/crud-app-example.git
- Git remote: `origin`

	```sh
	git remote add origin https://github.com/epam-nodejs-program-2021-03-01/crud-app-example.git
	```
