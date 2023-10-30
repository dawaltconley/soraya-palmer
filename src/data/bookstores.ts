export const tags = [
  'Black owned',
  'worker/customer owned',
  'Black women owned',
] as const

export interface Bookstore {
  name: string
  link: URL
  tag?: string
}

export interface Location {
  name: string | null
  stores: Bookstore[]
}

const bookstores: Location[] = [
  {
    name: null,
    stores: [
      {
        name: 'Bookshop.org',
        link: new URL('https://www.thelitbar.com/'),
      },
    ],
  },
  {
    name: 'NYC',
    stores: [
      {
        name: 'Huemanbooks',
        link: new URL('https://bookshop.org/shop/Huemanbooks'),
        tag: tags[0],
      },
      {
        name: 'The Lit. Bar',
        link: new URL(
          'https://bookshop.org/p/books/the-human-origins-of-beatrice-porter-other-essential-ghosts-soraya-palmer/18592932',
        ),
        tag: tags[2],
      },
      {
        name: 'Cafe con Libros',
        link: new URL('https://www.cafeconlibrosbk.com/'),
        tag: tags[2],
      },
      {
        name: 'Greenlight',
        link: new URL('https://www.greenlightbookstore.com/book/9781646220953'),
      },
      {
        name: 'Bluestockings',
        link: new URL('https://bluestockings.com/about-us/about-us'),
        tag: tags[1],
      },
      {
        name: 'Taylor & CO',
        link: new URL('https://www.taylorcobooks.com/'),
        tag: tags[0],
      },
      {
        name: 'Cups and Books',
        link: new URL('https://bookshop.org/shop/cupsandbooks'),
      },
    ],
  },
  {
    name: 'NJ',
    stores: [
      {
        name: 'Source of Knowledge',
        link: new URL('https://sourceofknowledgebookstore.com/store'),
        tag: tags[0],
      },
    ],
  },
  {
    name: 'Chicago',
    stores: [
      {
        name: 'Seminary Co-op / 57th St Books',
        link: new URL('http://www.semcoop.com'),
        tag: tags[1],
      },
    ],
  },
  {
    name: 'DC',
    stores: [
      {
        name: 'Sankofa',
        link: new URL(
          'https://www.sankofa.com/blank-2/the-human-origins-of-beatrice-porter-other-essential-ghosts',
        ),
        tag: tags[0],
      },
      {
        name: 'Loyalty',
        link: new URL('https://www.loyaltybookstores.com/book/9781646220953'),
        tag: tags[0],
      },
      {
        name: 'Mahogany Books',
        link: new URL('https://www.mahoganybooks.com/9781646220953'),
        tag: tags[0],
      },
      {
        name: 'Lost City Books',
        link: new URL('https://shop.lostcitybookstore.com/book/9781646220953'),
        tag: tags[0],
      },
      {
        name: 'Bus Boys and Poets',
        link: new URL('https://bookshop.org/shop/busboysbooks'),
      },
    ],
  },
  {
    name: 'Baltimore',
    stores: [],
  },
  {
    name: 'Boston',
    stores: [
      {
        name: 'Rozzie Bound',
        link: new URL('https://rozziebound.com/book/9781646220953'),
        tag: tags[1],
      },
    ],
  },
  {
    name: 'Seattle',
    stores: [
      {
        name: 'Third Place Books',
        link: new URL('https://www.thirdplacebooks.com/book/9781646220953'),
      },
      {
        name: "Estelita's Library",
        link: new URL('https://bookshop.org/shop/estelitaslibrary'),
        tag: tags[0],
      },
    ],
  },
  {
    name: 'Portland, OR',
    stores: [
      {
        name: "Powell's City of Books",
        link: new URL(
          'https://www.powells.com/book/human-origins-of-beatrice-porter-other-essential-ghosts-a-novel-9781646220953',
        ),
        tag: tags[0],
      },
    ],
  },
]

export default bookstores
