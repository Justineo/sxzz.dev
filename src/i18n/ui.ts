export const languages = {
  en: 'English',
  zh: '中文',
} as const

export const defaultLang = 'en'
export const showDefaultLang = false

export const ui = {
  en: {
    'nav.posts': 'Posts',
    'nav.musings': 'Musings',
    'nav.links': 'Links',
    'nav.about': 'About',
    'lang.en': 'EN',
    'lang.zh': '中文',
    'lang.switch': 'Switch language',
    'toggle.theme': 'Toggle dark mode',
    'toc.title': 'On this page',
  },
  zh: {
    'nav.posts': '文章',
    'nav.musings': '碎碎念',
    'nav.links': '友链',
    'nav.about': '关于',
    'lang.en': 'EN',
    'lang.zh': '中文',
    'lang.switch': '切换语言',
    'toggle.theme': '切换深色模式',
    'toc.title': '目录',
  },
} as const

export const localeByLang = {
  en: 'en-US',
  zh: 'zh-CN',
} as const
