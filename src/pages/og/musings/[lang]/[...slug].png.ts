import { getCollection, type CollectionEntry } from 'astro:content'
import { renderOgImage } from '../../../../utils/og-image'
import type { Lang } from '../../../../i18n/utils'
import type { APIRoute } from 'astro'

export const prerender = true

export async function getStaticPaths() {
  const musings = await getCollection('musings')
  return musings.map((post) => ({
    params: { lang: 'zh', slug: post.id },
    props: { post, lang: 'zh' },
  }))
}

export const GET: APIRoute = async ({ props }) => {
  if (!props) {
    return new Response('Not found', { status: 404 })
  }
  const { post, lang } = props as {
    post: CollectionEntry<'musings'>
    lang: Lang
  }
  const png = await renderOgImage({
    title: post.data.title,
    description: post.data.description,
    lang,
    kind: 'musing',
    date: post.data.date,
  })
  const buffer =
    png.buffer instanceof ArrayBuffer ? png.buffer : new Uint8Array(png).buffer
  const body = buffer.slice(png.byteOffset, png.byteOffset + png.byteLength)
  return new Response(body, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
