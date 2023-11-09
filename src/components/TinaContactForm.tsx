import type { HomeQuery, WorkWithMePageQuery } from '@tina/__generated__/types'
import { tinaField } from 'tinacms/dist/react'
import ContactForm from './ContactForm'
import { withTinaWrapper } from '@lib/browser/withTinaWrapper'

export default withTinaWrapper<HomeQuery | WorkWithMePageQuery>(({ data }) => {
  const content =
    'home' in data ? data.home.contactForm : data.workWithMePage.contactForm
  return (
    <div data-tina-field={tinaField(content)}>
      <ContactForm content={content} />
    </div>
  )
})
