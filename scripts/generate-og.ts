import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderDefaultOgImage } from '../src/utils/og-image.ts'

const root = fileURLToPath(new URL('..', import.meta.url))
const png = await renderDefaultOgImage()

writeFileSync(join(root, 'public/og-default.png'), png)
console.log('Generated public/og-default.png')
