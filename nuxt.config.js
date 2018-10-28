import { createClient } from './plugins/contentful.js'
const pkg = require('./package')
const client = createClient()

module.exports = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#A69223', height: '10px' },

  /*
  ** Global CSS
  */
  css: ['normalize.css', '~/assets/scss/common.scss'],
  sassResources: ['~/assets/scss/variables/*.scss'],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: ['contentful'],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    'nuxt-sass-resources-loader'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      const vueloader = config.module.rules.find(e => {
        return e.test.toString() === '/\\.vue$/'
      })

      vueloader.options.cssModules = {
        localIdentName:
          process.env.NODE_ENV !== 'production'
            ? '[path]--[local]---[hash:base64:8]'
            : '[hash:base64:8]',
        camelCase: true
      }

      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  generate: {
    routes() {
      return Promise.all([
        client.getEntries({
          content_type: 'post'
        }),
        client.getEntries({
          content_type: 'meetup'
        })
      ]).then(([posts, meetups]) => {
        return [
          ...posts.items.map(post => `posts/${post.fields.slug}`),
          ...meetups.items.map(meetup => `posts/${meetup.fields.number}`)
        ]
      })
    }
  }
}
