export default function placeSpider(
  container: HTMLElement = document.body,
): void {
  const spawnRange =
    Math.floor(container.getBoundingClientRect().bottom) - window.innerHeight
  // const containerBottom = Math.floor(container.getBoundingClientRect().bottom)
  // const viewportBottom = window.innerHeight + window.scrollY
  // console.log(container, containerBottom, viewportBottom)
  console.log({ spawnRange })
  if (spawnRange < 100) return

  const isLeft = Math.random() < 0.5

  const spider = new Image(40, 40)
  spider.src = '/spider.svg'
  // spider.classList.add(
  //   'absolute',
  //   isLeft ? 'left-0' : 'right-0',
  //   isLeft ? 'rotate-180' : 'rotate-90',
  // )
  Object.assign(spider.style, {
    position: 'absolute',
    left: isLeft && '0px',
    right: !isLeft && '0px',
    top:
      Math.floor(
        Math.random() * spawnRange + window.innerHeight + window.scrollY,
      ).toString() + 'px',
  })
  console.log(spider, isLeft)
  container.appendChild(spider)
}
