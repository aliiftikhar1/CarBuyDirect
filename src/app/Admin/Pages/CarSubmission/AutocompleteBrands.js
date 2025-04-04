"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CarApiAutocompleteInput({ options, value, onChange, name, label, required = false }) {
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

  // Set default label based on name if not provided
  const displayLabel =
    label || (name === "vehicleMake" ? "Vehicle Make" : name === "vehicleModel" ? "Vehicle Model" : name)

  useEffect(() => {
    // Safely filter options, handling potential undefined values
    const filtered = options
      ? options.filter((option) => {
          // Handle different option formats (object with name or simple string)
          const optionName =
            option && typeof option === "object" && option.name !== undefined
              ? String(option.name)
              : typeof option === "string" || typeof option === "number"
                ? String(option)
                : ""

          return optionName.toLowerCase().includes(inputValue.toLowerCase())
        })
      : []

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
    // Handle different option formats
    const optionValue =
      option && typeof option === "object" && option.name !== undefined
        ? String(option.name)
        : typeof option === "string" || typeof option === "number"
          ? String(option)
          : ""

    setInputValue(optionValue)
    // Call parent onChange handler
    if (onChange) {
      onChange({ target: { value: optionValue } })
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
        {displayLabel} {required && "*"}
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
                {option && typeof option === "object" && option.name !== undefined
                  ? String(option.name)
                  : typeof option === "string" || typeof option === "number"
                    ? String(option)
                    : ""}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

