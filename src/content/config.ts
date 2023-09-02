// see https://github.com/colinhacks/zod
import { z, defineCollection } from 'astro:content'

const quoteTypes = ['review', 'author'] as const

type QuoteType = z.infer<typeof quoteTypes>

const quotes = defineCollection({
  schema: z.object({
    type: z.enum(quoteTypes),
    quote: z.string(),
    author: z.optional(z.string()),
    url: z.optional(z.string().url()),
    source: z.optional(z.string()),
  }),
})
