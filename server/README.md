# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

⸻

# Strapi Email Setup (Nodemailer)

1. Install Packages

```
npm install @strapi/plugin-email @strapi/provider-email-nodemailer
```

⸻

2. Advanced Settings

1. Go to Strapi Admin → Settings → Users & Permissions Plugin → Advanced Settings
2. Enable Email confirmation after registration
3. Set Redirection URL to your frontend (e.g., http://localhost:3000/auth/login)

⸻

3. Email Templates

1. Go to Settings → Users & Permissions Plugin → Email templates
2. Open Email address confirmation
3. Set From to your SMTP email (e.g., test@gmail.com)
4. Customize the email body using Strapi variables:

<p>Confirm your email:</p>
<p><a href="<%= URL %>?confirmation=<%= CODE %>">Confirm your email</a></p>

⸻

4. Test Email Connection

1. Go to Settings → Email → Test Email
2. Enter a recipient email and click Send test email
3. Confirm that the email is delivered correctly

⸻