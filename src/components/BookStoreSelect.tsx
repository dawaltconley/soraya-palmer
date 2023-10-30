import type { Bookstore } from '@data/bookstores'
import bookstores from '@data/bookstores'
import { useState } from 'react'
import {
  Root,
  Trigger,
  Content,
  Group,
  Label,
  Item,
} from '@radix-ui/react-dropdown-menu'

const bookstoreMap = new Map<string, Bookstore>(
  bookstores
    .map<[string, Bookstore][]>((l, i) =>
      l.stores.map((b, j) => [`${i},${j}`, b]),
    )
    .flat(),
)

interface StoreSelectProps {
  onSelect: (store?: Bookstore) => void
  focusElement?: HTMLElement | null
}

export default function BookStoreSelect({
  onSelect,
  focusElement,
}: StoreSelectProps) {
  const [selected, setSelected] = useState(Array.from(bookstoreMap.keys())[0])
  return (
    <div className="absolute left-0 top-full flex w-full pt-1 text-sm">
      <span>from</span>
      <div className="ml-1">
        <Root>
          <Trigger className="text-amber-300 hover:underline">
            {bookstoreMap.get(selected)?.name || 'Select'}
          </Trigger>
          <Content
            className="z-50 max-h-96 overflow-y-scroll rounded-sm border border-gray-900 bg-white text-left font-sans text-gray-900 drop-shadow"
            onCloseAutoFocus={(e) => {
              if (!focusElement) return
              e.preventDefault()
              focusElement.focus()
            }}
          >
            {bookstores.map(
              (loc, i) =>
                loc.stores.length > 0 && (
                  <Group key={loc.name} className="divide-y divide-gray-100">
                    {loc.name && (
                      <Label className="bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                        {loc.name}
                      </Label>
                    )}
                    {loc.stores.map(({ name, tag }, j) => {
                      const id = `${i},${j}`
                      return (
                        <Item
                          key={id}
                          className="cursor-pointer px-4 py-2 outline-none hover:bg-amber-50 focus:bg-amber-50"
                          textValue={name}
                          onSelect={() => {
                            setSelected(id)
                            onSelect(bookstoreMap.get(id))
                          }}
                        >
                          <div>{name}</div>
                          {tag && (
                            <div className="ml-2 text-xs italic text-gray-400">
                              {tag}
                            </div>
                          )}
                        </Item>
                      )
                    })}
                  </Group>
                ),
            )}
          </Content>
        </Root>
      </div>
    </div>
  )
}
