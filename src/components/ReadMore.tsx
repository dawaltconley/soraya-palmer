import Icon from './Icon'
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons'
// import { faArrowUpRightFromSquare } from '@fortawesome/sharp-regular-svg-icons'
// import { faRight, faCaretRight } from '@fortawesome/sharp-solid-svg-icons'
// import { faArrowTurnDownRight } from '@fortawesome/sharp-light-svg-icons'

interface ReadMoreProps {
  href: string | URL
  children: string
}

/*
 * underline fill styles
 */

// // just text
// export default function ReadMore({ href, children: text }: ReadMoreProps) {
//   return (
//     <a href={href.toString()} className="underline-fill">
//       {text}
//     </a>
//   )
// }

// // with icon
// export default function ReadMore({ href, children: text }: ReadMoreProps) {
//   return (
//     <a href={href.toString()} className="group font-serif text-lg">
//       <Icon
//         icon={faArrowTurnDownRight}
//         width="1em"
//         height="1em"
//         className="fa-inline mr-2"
//       />
//       <span className="underline-fill group-hover:text-black">{text}</span>
//     </a>
//   )
// }

// with animated arrow
export default function ReadMore({ href, children: text }: ReadMoreProps) {
  return (
    <a
      href={href.toString()}
      className="not-prose group text-inherit duration-300"
    >
      <span className="underline-fill group-hover:underline-fill--active">
        {text}
      </span>{' '}
      <Icon
        icon={faArrowRight}
        className="fa-inline relative translate-x-0 text-base duration-300 ease-out group-hover:translate-x-0.5"
        width="1em"
        height="1em"
      />
    </a>
  )
}

// // sans with line
// export default function ReadMore({ href, children: text }: ReadMoreProps) {
//   return (
//     <a
//       href={href.toString()}
//       className="group inline-block border-amber-300 px-4 py-2 text-center font-sans duration-300"
//     >
//       <span className="underline-link group-hover:underline-link--active">
//         {text}
//       </span>
//     </a>
//   )
// }

/*
 * simple underline
 */

// // mix standard underline and animation
// export default function ReadMore({ href, children: text }: ReadMoreProps) {
//   return (
//     <a href={href.toString()} className="group">
//       <Icon
//         icon={faArrowTurnDownRight}
//         width="1em"
//         height="1em"
//         className="fa-inline mr-2"
//       />
//       <span className="underline-link group-hover:underline-link--active underline underline-offset-2 before:bottom-px before:left-0 before:duration-200 group-hover:before:right-0">
//         {text}
//       </span>
//     </a>
//   )
// }

// // okay... change underline color
// export default function ReadMore({ href, children: text }: ReadMoreProps) {
//   return (
//     <a href={href.toString()} className="group">
//       <Icon
//         icon={faArrowTurnDownRight}
//         width="1em"
//         height="1em"
//         className="fa-inline mr-2"
//       />
//       <span className="underline underline-offset-4 group-hover:decoration-amber-300 group-hover:decoration-2">
//         {text}
//       </span>
//     </a>
//   )
// }

// export default function ReadMore({ href, children: text }: ReadMoreProps) {
//   return (
//     <a href={href.toString()} className="group">
//       <Icon
//         icon={faArrowTurnDownRight}
//         width="1em"
//         height="1em"
//         className="fa-inline mr-2"
//       />
//       <span className="underline-link-2 group-hover:underline-link-2--active duration-100">
//         {text}
//       </span>
//     </a>
//   )
// }

/*
 * buttons
 */

// export default function ReadMore({ href, children: text }: ReadMoreProps) {
//   return (
//     <a
//       href={href.toString()}
//       className="form-button inline-block bg-gray-900 font-sans"
//     >
//       {text}
//     </a>
//   )
// }

// // also ok
// export default function ReadMore({ href, children: text }: ReadMoreProps) {
//   return (
//     <a
//       href={href.toString()}
//       className="group inline-block rounded-sm border border-gray-900 px-4 py-2 text-center font-sans text-base duration-300"
//     >
//       <span className="underline-link group-hover:underline-link--active">
//         {text}
//       </span>
//     </a>
//   )
// }

// export default function ReadMore({ href, children: text }: ReadMoreProps) {
//   return (
//     <a
//       href={href.toString()}
//       className="group inline-block border border-gray-900 px-4 py-2 text-center font-sans text-base duration-300"
//     >
//       <span className="underline-link group-hover:underline-link--active before:left-0 before:border-b hover:before:border-gray-900 group-hover:before:right-0 group-hover:before:border-gray-900">
//         {text}
//       </span>
//     </a>
//   )
// }
