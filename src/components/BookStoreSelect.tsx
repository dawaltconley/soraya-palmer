import { useState } from 'react'
import * as Dropdown from '@radix-ui/react-dropdown-menu'
import Icon from './Icon'
import clsx from 'clsx'

import { faCaretDown } from '@fortawesome/pro-solid-svg-icons'

const truncate = (text: string, maxLen: number, append = '…') =>
  text.length > maxLen ? text.slice(0, maxLen - append.length) + append : text

export interface Store {
  name: string
  link: URL
  tag?: string
}

export interface Location {
  name: string | null
  stores: Store[]
}

export interface StoreOptions {
  default: Store
  locations: Location[]
}

export interface StoreSelectProps {
  stores: Location[]
  onSelect: (store?: Store) => void
  focusElement?: HTMLElement | null
  isDark?: boolean
}

export default function BookStoreSelect({
  stores: locations,
  onSelect,
  focusElement,
  isDark,
}: StoreSelectProps) {
  const [selected, setSelected] = useState(locations[0].stores[0])
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Dropdown.Root onOpenChange={setIsOpen}>
      <Dropdown.Trigger className="whitespace-nowrap px-1 py-2 text-amber-300 hover:underline">
        <Icon
          icon={faCaretDown}
          className={clsx('fa-inline mr-0.5 duration-200', {
            'rotate-180': isOpen,
          })}
        />
        {truncate(selected?.name || 'Select', 30)}
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content
          className={clsx(
            'z-50 max-h-96 overflow-y-scroll rounded border border-gray-400 bg-white text-left font-sans text-gray-900 drop-shadow-lg dark:border-gray-950 dark:bg-gray-900 dark:text-gray-100',
            {
              dark: isDark,
            },
          )}
          onCloseAutoFocus={(e) => {
            if (!focusElement) return
            e.preventDefault()
            focusElement.focus()
          }}
          align="start"
          collisionPadding={16}
          loop
        >
          {locations.map(
            (loc, i) =>
              loc.stores.length > 0 && (
                <Dropdown.Group
                  key={loc.name}
                  className="divide-y divide-gray-100 dark:divide-gray-800"
                >
                  {loc.name && (
                    <Dropdown.Label className="bg-gray-100 px-2 py-1 text-xs font-semibold uppercase text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {loc.name}
                    </Dropdown.Label>
                  )}
                  {loc.stores.map((store, j) => {
                    const id = `${i},${j}`
                    return (
                      <Dropdown.Item
                        key={id}
                        className="cursor-pointer px-4 py-2 outline-none hover:bg-amber-50 focus:bg-amber-50 dark:hover:bg-gray-800 dark:focus:bg-gray-800 dark:active:bg-orange-900"
                        textValue={store.name}
                        onSelect={() => {
                          setSelected(store)
                          onSelect(store)
                        }}
                      >
                        <div>{store.name}</div>
                        {store.tag && (
                          <div className="ml-2 text-xs italic text-gray-400 dark:text-amber-200">
                            {store.tag}
                          </div>
                        )}
                      </Dropdown.Item>
                    )
                  })}
                </Dropdown.Group>
              ),
          )}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  )
}
