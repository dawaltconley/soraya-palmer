/* eslint-disable no-duplicate-imports, @typescript-eslint/no-duplicate-imports */

import { definition as IconGitHub } from '@fortawesome/free-brands-svg-icons/faGithub'
import { definition as IconLinkedIn } from '@fortawesome/free-brands-svg-icons/faLinkedin'
import { definition as IconEmail } from '@fortawesome/pro-regular-svg-icons/faEnvelope'
import { definition as IconPhone } from '@fortawesome/pro-regular-svg-icons/faPhone'

import { Icon } from '@lib/icons'

const icons = {
  email: new Icon({ name: 'Email', url: 'email', icons: IconEmail }),
  phone: new Icon({ name: 'Phone', url: 'phone', icons: IconPhone }),
  github: new Icon({
    name: 'GitHub',
    url: 'https://github.com',
    icons: IconGitHub,
  }),
  linkedin: new Icon({
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/',
    icons: IconLinkedIn,
  }),
} as const

export default icons
