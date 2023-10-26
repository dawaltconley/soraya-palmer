import type { Collection } from 'tinacms'
import type { ArticlePreviewStyle } from '@components/ArticleQuote'
import type { QuoteStyle } from '@components/Quote'
import { defineConfig } from 'tinacms'
import { UrlMetadata } from './components/UrlMetadata'
import { toUrl } from '../src/lib/utils'

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main'

const validateUrl = (url: string): string | void => {
  try {
    if (url) new URL(url)
  } catch (e) {
    return `${url} is not a valid URL.`
  }
}

const slugify = (str: string): string =>
  str
    .replace(/[^A-z0-9_]+/g, ' ')
    .trim()
    .replaceAll(' ', '-')

const homePage: Collection = {
  name: 'home',
  label: 'Home Page',
  path: 'content/pages',
  match: {
    include: 'home',
  },
  format: 'yaml',
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
    router: async ({ document }) => {
      if (document._sys.filename === 'home') return '/'
      return undefined
    },
  },
  fields: [
    {
      type: 'object',
      name: 'writing',
      label: 'Writing',
      required: true,
      fields: [
        {
          type: 'string',
          name: 'title',
          label: 'Title',
          required: true,
        },
        {
          type: 'object',
          name: 'selections',
          label: 'Selections',
          list: true,
          ui: {
            itemProps: ({ item }) => ({
              label: item || 'Add sample',
            }),
          },
          fields: [
            {
              type: 'reference',
              label: 'Selection',
              name: 'item',
              collections: ['writing'],
              required: true, // TODO: this may break builds!!
            },
          ],
        },
      ],
    },
  ],
}

const writing: Collection = {
  name: 'writing',
  label: 'Writing',
  path: 'content/writing',
  ui: {
    filename: {
      slugify: ({ url, title, publisher }) => {
        const prefix = publisher || toUrl(url)?.hostname
        return slugify([prefix, title].join('__'))
      },
    },
  },
  fields: [
    {
      type: 'string',
      name: 'url',
      label: 'URL',
      required: true,
      ui: {
        // @ts-expect-error
        component: UrlMetadata,
        // @ts-expect-error
        validate: validateUrl,
        metadataFields: {
          title: 'title',
          image: 'image.url',
          date: (data: any) => data.publishedDate || data.date,
          description: 'description',
          publisher: 'publisher',
        },
        mqlOptions: {
          data: {
            publishedDate: {
              selector: 'meta[property="article:published_time"]',
              attr: 'content',
              type: 'date',
            },
          },
        },
      },
    },
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      required: true,
      isTitle: true,
    },
    {
      type: 'image',
      name: 'image',
      label: 'Image',
      required: true,
    },
    {
      type: 'datetime',
      name: 'date',
      label: 'Date',
      required: true,
    },
    {
      type: 'string',
      name: 'publisher',
      label: 'Publisher',
    },
    {
      type: 'string',
      name: 'description',
      label: 'Description',
      ui: {
        component: 'textarea',
      },
    },
  ],
}

const toRichText = (str: string) => ({
  type: 'root',
  children: [
    {
      type: 'p',
      children: [
        {
          type: 'text',
          text: str,
        },
      ],
    },
  ],
})

const press: Collection = {
  name: 'press',
  label: 'Press',
  path: 'content/press',
  ui: {
    filename: {
      slugify: ({ url, title, source }) => {
        const prefix = source || toUrl(url)?.hostname
        return slugify([prefix, title].join('__'))
      },
    },
  },
  fields: [
    {
      type: 'string',
      name: 'url',
      label: 'URL',
      required: true,
      ui: {
        // @ts-expect-error
        component: UrlMetadata,
        // @ts-expect-error
        validate: validateUrl,
        metadataFields: {
          title: 'title',
          image: 'image.url',
          date: (data: any) => data.publishedDate || data.date,
          quote: (data: any) => {
            console.log(data)
            return toRichText(data.description)
          },
          source: 'publisher',
          author: 'author',
        },
        mqlOptions: {
          data: {
            publishedDate: {
              selector: 'meta[property="article:published_time"]',
              attr: 'content',
              type: 'date',
            },
          },
        },
      },
    },
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      required: true,
    },
    {
      type: 'image',
      name: 'image',
      label: 'Image',
    },
    {
      type: 'datetime',
      name: 'date',
      label: 'Date',
      required: true,
    },
    {
      type: 'string',
      name: 'author',
      label: 'Author',
    },
    {
      type: 'string',
      name: 'source',
      label: 'Source',
    },
    {
      type: 'rich-text',
      name: 'description', // maybe make this a textarea and add a separate optional "pullquote" field?
      label: 'Excerpt or description',
      isBody: true,
    },
  ],
}

const quotes: Collection = {
  name: 'quotes',
  label: 'Author Quotes',
  path: 'content/quotes',
  fields: [
    {
      type: 'rich-text',
      name: 'quote',
      label: 'Quote',
      required: true,
      isBody: true,
    },
    {
      type: 'string',
      name: 'author',
      label: 'Author',
      required: true,
      isTitle: true,
    },
    {
      type: 'string',
      name: 'book',
      label: 'Book',
    },
  ],
}

interface ArticleStyleOptions {
  value: ArticlePreviewStyle
  label: string
}

const articleStyleOptions: ArticleStyleOptions[] = [
  {
    value: 'article',
    label: 'Article Basic',
  },
  {
    value: 'article-bg-title',
    label: 'Article Background',
  },
  {
    value: 'article-bold-title',
    label: 'Article Bold',
  },
  {
    value: 'article-tile-title',
    label: 'Article Tile',
  },
  {
    value: 'quote',
    label: 'Quote Basic',
  },
  {
    value: 'quote-background',
    label: 'Quote Background',
  },
  {
    value: 'quote-headshot',
    label: 'Quote Headshot',
  },
  {
    value: 'quote-tile',
    label: 'Quote Tile',
  },
]

interface QuoteStyleOptions {
  value: QuoteStyle
  label: string
}

const quoteStyleOptions: QuoteStyleOptions[] = [
  {
    value: 'basic',
    label: 'Quote Basic',
  },
  {
    value: 'background',
    label: 'Quote Background',
  },
  {
    value: 'headshot',
    label: 'Quote Headshot',
  },
  {
    value: 'tile',
    label: 'Quote Tile',
  },
]

const pressPage: Collection = {
  name: 'pressPage',
  label: 'Press Page',
  path: 'content/pages',
  match: {
    include: 'press',
  },
  format: 'yaml',
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
    router: async ({ document }) => {
      console.log('router', document)
      if (document._sys.filename === 'press') return '/press'
      return undefined
    },
  },
  fields: [
    {
      type: 'object',
      name: 'press',
      label: 'Press',
      list: true,
      required: true,
      templates: [
        {
          name: 'article',
          label: 'Article',
          ui: {
            itemProps: (item) => {
              const label = [item._template, item.article].join(': ')
              return { label }
            },
          },
          fields: [
            {
              type: 'reference',
              collections: ['press'],
              name: 'article',
              label: 'Quote',
            },
            {
              type: 'string',
              name: 'style',
              label: 'Style',
              required: true,
              options: articleStyleOptions,
            },
            {
              type: 'number',
              name: 'rows',
              label: 'Rows',
            },
            {
              type: 'number',
              name: 'cols',
              label: 'Cols',
            },
          ],
        },
        {
          name: 'quote',
          label: 'Quote',
          ui: {
            itemProps: (item) => {
              const label = [item._template, item.quote].join(': ')
              return { label }
            },
          },
          fields: [
            {
              type: 'reference',
              collections: ['quotes'],
              name: 'quote',
              label: 'Quote',
            },
            {
              type: 'string',
              name: 'style',
              label: 'Style',
              required: true,
              options: quoteStyleOptions,
            },
            {
              type: 'number',
              name: 'rows',
              label: 'Rows',
            },
            {
              type: 'number',
              name: 'cols',
              label: 'Cols',
            },
          ],
        },
      ],
    },
  ],
}

export default defineConfig({
  branch,
  clientId: null, // Get this from tina.io
  token: null, // Get this from tina.io
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'media',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [homePage, pressPage, writing, press, quotes],
  },
})
