import type { IconDefinition as FaIconDefinition } from '@fortawesome/fontawesome-common-types'
import type { IconifyIcon } from '@iconify/types'
import { toUrl } from '@lib/utils'

export type IconDefinition = FaIconDefinition | IconifyIcon

type IconDict = { default: IconDefinition } & Record<string, IconDefinition>

interface IconOpts {
  name: string
  url?: string | URL
  icons: IconDefinition | IconDict
}

export class Icon {
  readonly name: string
  readonly icons: IconDict
  readonly url?: URL
  readonly type?: 'email' | 'phone'

  constructor({ name, url: urlType, icons }: IconOpts) {
    this.name = name
    this.icons = 'default' in icons ? icons : { default: icons }
    if (urlType === 'email' || urlType === 'phone') {
      this.type === urlType
    } else if (urlType) {
      const url = toUrl(urlType)
      if (!url) throw new Error('Bad icon URL: ' + name)
      this.url = url
    }
  }

  getDefinition(id?: 'default'): IconDefinition
  getDefinition(id: string): IconDefinition | null
  getDefinition(id = 'default'): IconDefinition | null {
    return this.icons[id] || null
  }

  matchesUrl(url: URL): boolean {
    const { protocol, host } = url
    return (
      (protocol === 'mailto:' && this.type === 'email') ||
      (protocol === 'tel:' && this.type === 'phone') ||
      host === this.url?.host
    )
  }
}

// dynamic import to control circular dependency
// everything hereafter depends on defined icons using the Icon class
const { default: icons } = await import('@data/icons')

export type IconKey = keyof typeof icons
export const isIconKey = (str: string): str is IconKey => str in icons

const hostDomainIconId = Object.entries(icons).reduce(
  (map: Record<string, IconKey>, [id, { type, url }]) => {
    const key = type ?? url?.host
    if (!key || !isIconKey(id)) return map
    map[key] = id
    return map
  },
  {},
)

const urlToIconKey = (urlString: string | URL): IconKey | undefined => {
  const url = toUrl(urlString)
  if (!url) return undefined
  const { protocol, host } = new URL(url)
  if (protocol === 'mailto:') return hostDomainIconId['email']
  if (protocol === 'tel:') return hostDomainIconId['phone']
  return hostDomainIconId[host]
}

export const getIconFromUrl = (url: string | URL): Icon | undefined => {
  const key = urlToIconKey(url)
  return key ? icons[key] : undefined
}

export const getIcon = (id: string | URL): Icon | undefined =>
  typeof id === 'string' && isIconKey(id) ? icons[id] : getIconFromUrl(id)

export const getIcons = (ids: (string | URL)[]): Icon[] =>
  ids.map(getIcon).filter((icon): icon is Icon => Boolean(icon))

export const getIconDefinition = (
  id: string | URL,
  style: string = 'default',
): IconDefinition | undefined => getIcon(id)?.icons[style]

export const getIconDefinitions = (
  ids: (string | URL)[],
  style: string = 'default',
): IconDefinition[] =>
  ids
    .map((id) => getIcon(id)?.icons[style])
    .filter((icon): icon is IconDefinition => Boolean(icon))

export const faToIconify = (icon: FaIconDefinition): IconifyIcon => {
  const [width, height, , , svgPathData] = icon.icon
  const body = Array.isArray(svgPathData)
    ? `<g class="fa-duotone-group"><path class="fa-secondary" fill="currentColor" d="${svgPathData[0]}"></path><path class="fa-primary" fill="currentColor" d="${svgPathData[1]}"></path></g>`
    : `<path fill="currentColor" d=${svgPathData}></path>`
  return { width, height, body }
}
