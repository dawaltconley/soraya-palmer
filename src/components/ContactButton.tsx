export interface ContactButtonProps {
  link: string
  text?: string
}

export default function ContactButton({
  link,
  text = 'Contact me',
}: ContactButtonProps) {
  return (
    <div className="not-prose my-8 text-center xl:hidden">
      <a
        href={link}
        className="form-button mx-auto inline-flex min-w-[8rem] items-center justify-center rounded-sm p-4 font-sans capitalize leading-none no-underline drop-shadow"
      >
        {text}
      </a>
    </div>
  )
}
