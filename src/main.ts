/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'

import { initAuth } from '@/composables/useAuth'

const app = createApp(App)

registerPlugins(app)

initAuth().then(() => app.mount('#app'))
