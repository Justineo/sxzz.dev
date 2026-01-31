import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const schema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z.string(),
})

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema,
})

const musings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/musings' }),
  schema,
})

export const collections = { posts, musings }
