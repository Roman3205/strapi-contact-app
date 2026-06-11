// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/strapi', '@nuxtjs/plausible', '@pinia/nuxt'],

  devtools: {
    enabled: true
  },

  app: {
    head: {
      title: 'Strapi Contact Manager',
      titleTemplate: '%s - Contact App',
      meta: [
        { name: 'description', content: 'A contact manager built with Strapi and Nuxt' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { redirect: '/admin/contacts' }
  },

  experimental: {
    purgeCachedData: false,
    granularCachedData: true
  },

  compatibilityDate: '2025-01-15',

  vite: {
    optimizeDeps: {
      include: [
        '@plausible-analytics/tracker',
        '@tanstack/vue-table'
      ]
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  plausible: {
    autoOutboundTracking: true,
    fileDownloads: true,
    formSubmissions: true,
    proxy: true,
    ignoredHostnames: [] // localhost can be tracked either
  },

  strapi: {
    auth: {
      populate: ['role']
    },
    cookie: {
      maxAge: 3600 * 24 * 20

    }
  }
})
