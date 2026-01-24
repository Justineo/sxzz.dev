import {
  defineConfig,
  presetWind3,
  presetAttributify,
  presetIcons,
  presetWebFonts,
} from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons(),
    presetWebFonts({
      fonts: {
        sans: 'Roboto',
      },
    }),
  ],
})
