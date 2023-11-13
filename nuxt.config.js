export default defineNuxtConfig({
  app: {
    head: {
      title: "Neato Games",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "!!!!!!!!!!!",
        },
        {
          name: "og:image",
          content: "/images/og-trippers.jpg",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/images/favicon.png" },
      ],
    },
  },
  supabase: {
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    redirect: false,
  },
  runtimeConfig: {
    public: {
      nodeEnv: process.env.ENV || "production",
      baseUrl: process.env.BASE_URL || "http://localhost:3000",
      supabase_url: process.env.SUPABASE_URL,
      supabase_key: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    private: {
      supabase_jwt_secret: process.env.SUPABASE_JWT_SECRET,
      supabase_service_role_key: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  },

  components: {
    global: true,
    dirs: ["~/components"],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    //{ src: '~/plugins/globals' },
    //{ src: '~/plugins/vue-plyr', mode: 'client' },
    //{ src: '~/plugins/inline-svg', mode: 'client' },
    //{ src: '~/plugins/vue-awesome-countdown', mode: 'client' },
    //{ src: '~/plugins/toast', mode: 'client' },
    //{ src: '~/plugins/vue-waypoints', mode: 'client' },
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    //'@nuxtjs/google-analytics'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "@nuxtjs/tailwindcss",
    //"@nuxtjs/color-mode",
    "@nuxtjs/supabase",
    "@vueuse/nuxt",
    "@vueuse/motion/nuxt",
  ],

  colorMode: {
    preference: "light", // default theme
    dataValue: "tripperTheme", // activate data-theme in <html> tag
  },

  target: "static",

  /*
  googleAnalytics: {
    id: 'UA-213952687-1'
  },
  */

  /*
  gtm: {
    id: 'GTM-N7XC69X',
    enabled: true,
    debug: true,

    layer: 'dataLayer',
    variables: {},

    pageTracking: false,
    pageViewEventName: 'nuxtRoute',

    autoInit: true,
    respectDoNotTrack: false,

    scriptId: 'gtm-script',
    scriptDefer: false,
    scriptURL: 'https://gtm.internet.game/saw.js',
    crossOrigin: false,

    noscript: true,
    noscriptId: 'gtm-noscript',
    noscriptURL: 'https://www.googletagmanager.com/ns.html'
  },
  */

  /*
  publicRuntimeConfig: {
    gtm: {
      // if you want to use env to configure
    }
  },
  */

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        "postcss-nested": {},
        "postcss-hexrgba": {},
        /*
        'postcss-custom-properties': {
          preserve: false
        }
        */
        "postcss-simple-vars": { silent: true },
      },
    },
  },
  router: {
    middleware: ['auth']
  }
});
