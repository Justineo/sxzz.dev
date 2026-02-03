import sitemap from '@astrojs/sitemap'
import UnoCSS from '@unocss/astro'
import { defineConfig } from 'astro/config'
import remarkGithubBlockquoteAlert from 'remark-github-blockquote-alert'

// https://astro.build/config
export default defineConfig({
  site: 'https://sxzz.dev',
  output: 'static',
  prefetch: true,
  integrations: [UnoCSS(), sitemap()],
  markdown: {
    remarkPlugins: [remarkGithubBlockquoteAlert],
  },
})
