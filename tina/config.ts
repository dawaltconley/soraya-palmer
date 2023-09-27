import type { Collection } from 'tinacms'
import { UrlMetadata } from './components/UrlMetadata'
import { defineConfig } from 'tinacms'

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main'

const validateUrl = (url: string): string | void => {
  try {
    if (url) new URL(url)
  } catch (e) {
    return `${url} is not a valid URL.`
  }
}

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
              required: true,
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
      isTitle: true,
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
      name: 'quote',
      label: 'Quote',
      isBody: true,
    },
  ],
}

const quotes: Collection = {
  name: 'quote',
  label: 'Author Quotes',
  path: 'content/quote',
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
    },
    {
      type: 'string',
      name: 'book',
      label: 'Book',
    },
  ],
}

const pressPage: Collection = {
  name: 'quotes',
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
    // router: async ({ document }) => {
    //   if (document._sys.filename === 'home') return '/'
    //   return undefined
    // },
  },
  fields: [
    {
      type: 'object',
      name: 'press',
      label: 'Press',
      list: true,
      required: true,
      fields: [
        {
          type: 'reference',
          collections: ['press', 'quotes'],
          name: 'item',
          label: 'Quote',
        },
      ],
    },
    // {
    //   type: 'object',
    //   name: 'press',
    //   label: 'press',
    //   list: true,
    //   templates: [press, quotes],
    // },
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
