import { defineConfig } from 'tinacms'
import { toUrl } from '../src/lib/utils'

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main'

const validateUrl = (url: string) => {
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
    .toLowerCase()

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
    collections: [
      {
        name: 'home',
        label: 'Home',
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
            label: 'Writing samples',
            name: 'writing',
            list: true,
            ui: {
              itemProps: (item) => {
                return {
                  label: item.writing || 'Add sample',
                }
              },
            },
            fields: [
              {
                type: 'reference',
                label: 'Writing',
                name: 'writing',
                collections: ['writing'],
                required: true,
              },
            ],
          },
        ],
      },
      {
        name: 'post',
        label: 'Posts',
        path: 'content/posts',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
      {
        name: 'writing',
        label: 'Writing',
        path: 'content/writing',
        ui: {
          filename: {
            slugify: (entry) => {
              if (!entry.url) return ''
              const url = toUrl(entry.url)
              if (url) {
                return `${slugify(url.hostname)}__${slugify(url.pathname)}`
              }
              return slugify(entry?.title || entry.url)
            },
          },
        },
        fields: [
          {
            type: 'string',
            name: 'url',
            label: 'URL',
            required: true,
            isTitle: true,
            ui: {
              validate: validateUrl,
            },
          },
          {
            type: 'string',
            name: 'title',
            label: 'Title',
          },
          {
            type: 'image',
            name: 'image',
            label: 'Image',
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
          },
        ],
      },
    ],
  },
})
