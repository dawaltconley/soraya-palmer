/* eslint-disable no-duplicate-imports, @typescript-eslint/no-duplicate-imports */

import { definition as IconEmail } from '@fortawesome/pro-regular-svg-icons/faEnvelope'
import { definition as IconPhone } from '@fortawesome/pro-regular-svg-icons/faPhone'
import { definition as IconTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter'
import { definition as IconLinkedIn } from '@fortawesome/free-brands-svg-icons/faLinkedin'
import { definition as IconInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram'

import { Icon } from '@lib/icons'

const icons = {
  email: new Icon({ name: 'Email', url: 'email', icons: IconEmail }),
  phone: new Icon({ name: 'Phone', url: 'phone', icons: IconPhone }),
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
} as const

export default icons
