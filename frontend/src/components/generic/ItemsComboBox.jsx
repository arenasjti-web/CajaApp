import React from 'react'
import api from '../../lib/axios'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'

export const ItemsComboBox = ({selectedItem,setSelectedItem}) => {
  const [items, setItems] = React.useState([])
  const [query, setQuery] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (query.length < 3) {
      setItems([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true)
      try {
        const { data } = await api.get("/inventory")
        setItems(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const filteredItems =
    query === ""
      ? items
      : items.filter(item =>
          item.name.toLowerCase().includes(query.toLowerCase())
        )

  return (
   <div className="relative">
    <Combobox value={selectedItem} onChange={setSelectedItem}>
      <ComboboxInput
        className="input input-bordered w-full"
        onChange={(e) => setQuery(e.target.value)}
        displayValue={(item) => item?.name}
      />

      <ComboboxOptions
        className="absolute top-full left-0 mt-1 w-full 
                  bg-white border rounded-md shadow-lg 
                  z-50 max-h-60 overflow-auto"
      >
        {filteredItems.map((item) => (
          <ComboboxOption
            key={item._id}
            value={item}
            className="cursor-pointer px-3 py-2 data-[focus]:bg-base-200"
          >
            {item.name}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  </div>

  )
}
