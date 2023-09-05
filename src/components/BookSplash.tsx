import Icon from '@components/Icon.tsx'
import { faCirclePlay } from '@fortawesome/pro-regular-svg-icons/faCirclePlay'

export default function BookSplash() {
  return (
    <div id="splash" className="vignette min-h-[50vh] w-full bg-gray-800">
      <div className="container mx-auto h-full justify-center py-16 md:flex">
        <img
          className="mx-auto h-full min-h-[32rem] object-contain drop-shadow-2xl md:mx-0 md:max-h-[40vh] lg:max-h-[50vh]"
          src="/media/The+Human+Originas+of+Beatrice+Porter.jpg"
          alt="Book cover of The Human Origins of Beatrice Porter"
        />
        <div className="mt-8 max-w-prose font-serif text-white md:ml-12 md:mt-0">
          <h2 className="font-display text-3xl font-bold">
            The Human Origins of Beatrice Porter and other Essential Ghosts
          </h2>
          <p className="underline decoration-gray-500 decoration-2">
            a novel by Soraya Palmer
          </p>
          <p className="my-4 italic">
            “Mothers never die. Children love to resurrect us in they stories.”
          </p>
          <p className="my-4">
            Folktales and spirits animate this lively and unforgettable
            coming-of-age tale of two Jamaican-Trinidadian sisters in Brooklyn
            grappling with their mother’s illness, their father's infidelity,
            and the truth of their family's past…
          </p>
          <div className="mt-6 whitespace-nowrap text-center md:text-left">
            <a
              href="https://bookshop.org/p/books/the-human-origins-of-beatrice-porter-other-essential-ghosts-soraya-palmer/18592932"
              className="mr-2 inline-block border-2 border-gray-500 px-4 py-3 font-sans"
              target="_blank"
            >
              Buy the book
            </a>
            <a
              href="https://bookshop.org/p/books/the-human-origins-of-beatrice-porter-other-essential-ghosts-soraya-palmer/18592932"
              className="inline-block px-4 py-3 font-sans"
              target="_blank"
            >
              <Icon icon={faCirclePlay} className="fa-inline" /> Watch the
              trailer
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
