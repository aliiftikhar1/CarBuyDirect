"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"

export function YearAutocompleteInput({ options, name, label, required = false }) {
  console.log("Options are : ", options)
  const [inputValue, setInputValue] = useState("")
  const [filteredOptions, setFilteredOptions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const filtered = options.filter((option) => {
      // Convert option to string for comparison regardless of type
      const optionStr = String(option)

      // Convert input value to string and compare
      return optionStr.toLowerCase().includes(inputValue.toLowerCase())
    })
    setFilteredOptions(filtered)
  }, [inputValue, options])

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    setIsOpen(true)
  }

  const handleOptionClick = (option) => {
    // Always convert to string for consistent display
    setInputValue(String(option))
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
                {String(option)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

