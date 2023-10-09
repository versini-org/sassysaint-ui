# Development FAQ

## Apple touch icons

All icons under `packages/client/public` are used as apple touch icons. They were automatically generated with the following command:

```sh
cd packages/client
npx pwa-asset-generator -i ./index.html -m ./public/manifest.json  third-party/noun-dachshund-208024.svg --splash-only -b "#64748b" -q 60 ./public
```

## Information about auth0 domain and client id

Both values are public and can be found in the `auth_config.json` file in the `packages/client` folder. Since they are public, there is no need to hide them: the `auth_config.json` can be pushed to GitHub.

## Custom domain on Auth0

**NOTE**: this is only needed if you want to use a custom domain for the login page. If you don't want to use a custom domain, you can skip this section, however iOS devices will not be able to use the login page if you don't use a custom domain.

### Configuration

- Sign up for an [auth0 plan](https://auth0.com/pricing/) that supports custom domains
  - Create a custom domain on the [auth0](https://manage.auth0.com/) dashboard
  - It's under Branding > Custom Domains
- Update `domain` in `packages/client/auth_config.json`

### Favicon on custom domain login page

#### Install the [auth0 CLI](https://github.com/auth0/auth0-cli)

```sh
brew tap auth0/auth0-cli && brew install auth0
```

#### Login to auth0

```sh
auth0 login
```

A page will open in your browser, give authorization for the tenant you want (drop-down box). Repeat the process for all tenants you want to access.

#### Update the favicon

```sh
auth0 tenants use <the tenant you want to update>
auth0 universal-login update -f <https url to the favicon>
```
