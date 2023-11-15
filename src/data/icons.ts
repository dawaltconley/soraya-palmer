/* eslint-disable no-duplicate-imports, @typescript-eslint/no-duplicate-imports */

import { definition as IconEmail } from '@fortawesome/pro-regular-svg-icons/faEnvelope'
import { definition as IconPhone } from '@fortawesome/pro-regular-svg-icons/faPhone'
import { definition as IconTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter'
import { definition as IconLinkedIn } from '@fortawesome/free-brands-svg-icons/faLinkedin'
import { definition as IconInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram'
import { faTiktok } from '@fortawesome/free-brands-svg-icons/faTiktok'
import { faFacebook } from '@fortawesome/free-brands-svg-icons/faFacebook'
import { faYoutube } from '@fortawesome/free-brands-svg-icons/faYoutube'

import { Icon, getIconFromUrl } from '@lib/icons'

const icons = {
  email: new Icon({ name: 'Email', url: 'mailto:', icons: IconEmail }),
  phone: new Icon({ name: 'Phone', url: 'tel:', icons: IconPhone }),
  twitter: new Icon({
    name: 'Twitter',
    url: 'https://twitter.com',
    icons: IconTwitter,
  }),
  linkedin: new Icon({
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/',
    icons: IconLinkedIn,
  }),
  instagram: new Icon({
    name: 'Instagram',
    url: 'https://www.instagram.com/',
    icons: IconInstagram,
  }),
  tiktok: new Icon({
    name: 'TikTok',
    url: 'https://www.tiktok.com/',
    icons: faTiktok,
  }),
  facebook: new Icon({
    name: 'Facebook',
    url: 'https://www.facebook.com/',
    icons: faFacebook,
  }),
  youtube: new Icon({
    name: 'YouTube',
    url: 'https://www.youtube.com/',
    icons: faYoutube,
  }),
} as const

export default icons

export type IconKey = keyof typeof icons
export const isIconKey = (str: string): str is IconKey => str in icons
export { getIconFromUrl }
