/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'system',
    themes: {
      light: {
        colors: {
          primary: '#b00000',
          secondary: '#a25959',
          background: '#f5f5f5',
        },
      },
      dark: {
        colors: {
          primary: '#b00000',
          secondary: '#a25959',
        },
      },
    },
  },
})
