import type { HomeQuery, EventsPageQuery } from '@tina/__generated__/types'
import { tinaField } from 'tinacms/dist/react'
import EmailSignUp from './EmailSignUp'
import { withTinaWrapper } from '@lib/browser/withTinaWrapper'

export default withTinaWrapper<HomeQuery | EventsPageQuery>(({ data }) => {
  const content =
    'home' in data ? data.home.emailForm : data.eventsPage.emailForm
  return (
    <div data-tina-field={tinaField(content)}>
      <EmailSignUp content={content} />
    </div>
  )
})
