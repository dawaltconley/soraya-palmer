import type { CardBasicProps } from './CardBasic'
import type { ImageCardProps } from './ImageCard'
import CardBasic from './CardBasic'
import ImageCard from './ImageCard'

export default function Card(props: CardBasicProps | ImageCardProps) {
  return 'image' in props && props.image ? ImageCard(props) : CardBasic(props)
}
