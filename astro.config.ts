import { defineConfig } from 'astro/config'

import vue from '@astrojs/vue'
import UnoCSS from '@unocss/astro'

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  integrations: [vue(), UnoCSS()],
})
