"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"

export function CarApiAutocompleteInput({ options, setSelectedBrand, name, label, required = false }) {
  console.log("Options for", name, "are", options)
  const [inputValue, setInputValue] = useState("")
  const [filteredOptions, setFilteredOptions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    // Safely filter options, handling potential undefined values
    const filtered = options.filter((option) => {
      // First check if option and option.name exist
      if (!option || option.name === undefined || option.name === null) {
        return false
      }

      // Convert option.name to string if it's not already
      const optionName = typeof option.name === "string" ? option.name : String(option.name)

      // Now safely compare with inputValue
      return optionName.toLowerCase().includes(inputValue.toLowerCase())
    })

    setFilteredOptions(filtered)
  }, [inputValue, options])

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    setIsOpen(true)
  }

  const handleOptionClick = (option) => {
    // Convert option.name to string if needed
    const displayName = typeof option.name === "string" ? option.name : String(option.name)
    setSelectedBrand(option.id)
    setInputValue(displayName)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="space-y-2" ref={inputRef}>
      <label htmlFor={name} className="text-sm font-medium">
        {label} {required && "*"}
      </label>
      <div className="relative">
        <Input
          id={name}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          required={required}
        />
        {isOpen && filteredOptions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto rounded-md shadow-lg">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                onClick={() => handleOptionClick(option)}
              >
                {typeof option.name === "string" ? option.name : String(option.name)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

