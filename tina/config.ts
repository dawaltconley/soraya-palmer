import type { Collection, TinaField } from 'tinacms'
import type { CardStyle } from '@components/ImageCard'
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

const requiredUrl = (url: string | null | undefined): string | void =>
  url ? validateUrl(url) : 'Required'

const slugify = (str: string): string =>
  str
    .replace(/[^A-z0-9_]+/g, ' ')
    .trim()
    .replaceAll(' ', '-')

const imageControls: TinaField = {
  type: 'object',
  name: 'imageControls',
  label: 'Image Controls',
  fields: [
    {
      type: 'string',
      name: 'alt',
      label: 'Image description',
    },
    {
      type: 'string',
      name: 'size',
      label: 'Image size',
      ui: {
        description:
          'Cover ensures that the image fills the complete space and is usually the right approach. Contain ensures that the full image is visible.',
      },
      options: [
        {
          value: 'cover',
          label: 'cover',
        },
        {
          value: 'contain',
          label: 'contain',
        },
      ],
    },
    {
      type: 'number',
      name: 'posX',
      label: 'Horizontal position',
      ui: {
        description:
          'Controls how the image is centered when sized to "cover."',
        validate: (value) => {
          if (value < 0 || value > 100)
            return 'Position must be between 0 and 100'
        },
      },
    },
    {
      type: 'number',
      name: 'posY',
      label: 'Vertical position',
      ui: {
        description:
          'Controls how the image is centered when sized to "cover."',
        validate: (value) => {
          if (value < 0 || value > 100)
            return 'Position must be between 0 and 100'
        },
      },
    },
  ],
}

const defaultImageControls = {
  imageControls: {
    size: 'cover',
    posX: 50,
    posY: 50,
  },
}

const bookstore: TinaField[] = [
  {
    type: 'string',
    name: 'name',
    label: 'Store name',
  },
  {
    type: 'string',
    name: 'link',
    label: 'Link',
    ui: {
      validate: validateUrl,
    },
  },
  {
    type: 'string',
    name: 'tag',
    label: 'Tag',
    options: [
      {
        value: 'Black owned',
        label: 'Black owned',
      },
      {
        value: 'worker/customer owned',
        label: 'worker/customer owned',
      },
      {
        value: 'Black women owned',
        label: 'Black women owned',
      },
    ],
  },
]

const bookstores: TinaField = {
  type: 'object',
  name: 'bookstores',
  label: "'Buy the book' options",
  required: true,
  fields: [
    {
      type: 'object',
      name: 'default',
      label: 'Primary store',
      required: true,
      fields: bookstore,
    },
    {
      type: 'object',
      name: 'locations',
      label: 'Local stores',
      list: true,
      ui: {
        itemProps: (item: any) => ({
          label: item.name || 'Unnamed location',
        }),
      },
      fields: [
        {
          type: 'string',
          name: 'name',
          label: 'Location',
        },
        {
          type: 'object',
          name: 'stores',
          label: 'Stores',
          list: true,
          ui: {
            itemProps: (item: any) => ({
              label: item.name,
            }),
          },
          fields: bookstore,
        },
      ],
    },
  ],
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
      name: 'book',
      label: 'Book info',
      required: true,
      fields: [
        {
          type: 'object',
          name: 'trailer',
          label: 'Trailer',
          fields: [
            {
              type: 'image',
              name: 'webm',
              label: 'WebM',
              ui: {
                validate: (file: string) => {
                  if (!file.toLowerCase().endsWith('.webm'))
                    return 'File must be a webm file and end in .webm'
                },
              },
            },
            {
              type: 'image',
              name: 'mp4',
              label: 'MP4',
              ui: {
                description:
                  'You should always provide an MP4 file. Providing a WebM file too will allow the video to load faster on most devices.',
                validate: (file: string) => {
                  if (!file.toLowerCase().endsWith('.mp4'))
                    return 'File must be an mp4 and end in .mp4'
                },
              },
            },
          ],
        },
        bookstores,
      ],
    },
    {
      type: 'object',
      name: 'about',
      label: 'About Me',
      required: true,
      fields: [
        {
          type: 'image',
          name: 'image',
          label: 'Headshot',
          required: true,
        },
        {
          type: 'string',
          name: 'title',
          label: 'Section title',
          required: true,
          isTitle: true,
        },
        {
          type: 'rich-text',
          name: 'bio',
          label: 'Bio',
          required: true,
        },
      ],
    },
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
  defaultItem: {
    ...defaultImageControls,
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
        validate: requiredUrl,
        metadataFields: {
          title: 'title',
          image: 'image.url',
          date: (data: any) => data.publishedDate || data.date,
          description: (data: any) => toRichText(data.description),
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
    imageControls,
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
      type: 'rich-text',
      name: 'description',
      label: 'Description',
      isBody: true,
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
  defaultItem: {
    ...defaultImageControls,
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
        validate: requiredUrl,
        metadataFields: {
          title: 'title',
          image: 'image.url',
          date: (data: any) => data.publishedDate || data.date,
          description: (data: any) => toRichText(data.description),
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
    imageControls,
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
  defaultItem: {
    ...defaultImageControls,
  },
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
    {
      type: 'image',
      name: 'image',
      label: 'Headshot',
    },
    imageControls,
  ],
}

const events: Collection = {
  name: 'events',
  label: 'Events',
  path: 'content/events',
  ui: {
    router: async () => '/events',
  },
  defaultItem: {
    ...defaultImageControls,
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
        validate: requiredUrl,
        metadataFields: {
          title: 'title',
          image: 'image.url',
          description: (data: any) => toRichText(data.description),
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
      ui: {
        description: 'Square images work best.',
      },
    },
    imageControls,
    {
      type: 'datetime',
      name: 'startTime',
      label: 'Start time',
      required: true,
      ui: {
        timeFormat: 'hh:mm A',
      },
    },
    {
      type: 'datetime',
      name: 'endTime',
      label: 'End time',
      ui: {
        timeFormat: 'hh:mm A',
      },
    },
    {
      type: 'string',
      name: 'location',
      label: 'Location',
      required: true,
    },
    {
      type: 'rich-text',
      name: 'description',
      label: 'Excerpt or description',
      isBody: true,
    },
  ],
}

interface Option {
  value: string
  label: string
}

interface CardLayoutOptions extends Option {
  value: CardStyle
}

const cardLayoutOptions: CardLayoutOptions[] = [
  {
    value: 'card',
    label: 'Card',
  },
  {
    value: 'tile',
    label: 'Tile',
  },
]

const gridControls: TinaField[] = [
  {
    type: 'string',
    name: 'layout',
    label: 'Layout',
    required: true,
    options: cardLayoutOptions,
  },
  {
    type: 'number',
    name: 'rows',
    label: 'Rows',
    ui: {
      validate: (value) => {
        if (typeof value === 'number' && (value < 1 || value > 3))
          return 'Rows must be between 1 and 3'
      },
    },
  },
  {
    type: 'number',
    name: 'cols',
    label: 'Cols',
    ui: {
      validate: (value) => {
        if (typeof value === 'number' && (value < 1 || value > 3))
          return 'Columns must be between 1 and 3'
      },
    },
  },
  {
    type: 'string',
    name: 'imageSide',
    label: 'Image',
    options: [
      { value: 'left', label: 'on left' },
      { value: 'right', label: 'on right' },
    ],
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
            defaultItem: {
              display: 'quote',
              layout: 'tile',
              rows: 1,
              cols: 1,
              imageSide: 'left',
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
              name: 'display',
              label: 'Display',
              required: true,
              options: [
                {
                  value: 'title',
                  label: 'Article Title',
                },
                {
                  value: 'quote',
                  label: 'Quote',
                },
              ],
            },
            ...gridControls,
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
            defaultItem: {
              layout: 'card',
              rows: 1,
              cols: 1,
              imageSide: 'left',
            },
          },
          fields: [
            {
              type: 'reference',
              collections: ['quotes'],
              name: 'quote',
              label: 'Quote',
            },
            ...gridControls,
          ],
        },
      ],
    },
  ],
}

const workWithMePage: Collection = {
  name: 'workWithMePage',
  label: 'Work With Me Page',
  path: 'content/pages',
  match: {
    include: 'services',
  },
  format: 'mdx',
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
    router: async ({ document }) => {
      if (document._sys.filename === 'services') return '/services'
      return undefined
    },
  },
  fields: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      required: true,
      isTitle: true,
    },
    {
      type: 'rich-text',
      name: 'body',
      label: 'Content',
      required: true,
      isBody: true,
      templates: [
        {
          name: 'ContactButton',
          label: 'Contact Me Button',
          fields: [
            {
              type: 'string',
              name: 'text',
              label: 'Text',
            },
          ],
        },
      ],
    },
  ],
}

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID,
  token: process.env.TINA_CONTENT_TOKEN,
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
  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN,
    },
  },
  schema: {
    collections: [
      homePage,
      pressPage,
      workWithMePage,
      writing,
      press,
      quotes,
      events,
    ],
  },
})
