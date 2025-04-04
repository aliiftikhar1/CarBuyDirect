"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function YearAutocompleteInput({ options, name, value, onChange, label = "Vehicle Year", required = false }) {
  const [inputValue, setInputValue] = useState(value || "")
  const [filteredOptions, setFilteredOptions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef(null)

  // Update local state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value)
    }
  }, [value])

  useEffect(() => {
    const filtered = options ? options.filter((option) => {
      // Convert option to string for comparison regardless of type
      const optionStr = String(option)

      // Convert input value to string and compare
      return optionStr.toLowerCase().includes(inputValue.toLowerCase())
    }) : []
    setFilteredOptions(filtered)
  }, [inputValue, options])

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    // Call parent onChange handler
    if (onChange) {
      onChange({ target: { value: newValue } })
    }
    setIsOpen(true)
  }

  const handleOptionClick = (option) => {
    // Always convert to string for consistent display
    const optionStr = String(option)
    setInputValue(optionStr)
    // Call parent onChange handler
    if (onChange) {
      onChange({ target: { value: optionStr } })
    }
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
      <Label htmlFor={name}>
        {label} {required && "*"}
      </Label>
      <div className="relative">
        <Input
          id={name}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          required={required}
        />
        {isOpen && filteredOptions && filteredOptions.length > 0 && (
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
