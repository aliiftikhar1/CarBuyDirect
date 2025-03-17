import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"


export function AutocompleteInput({ options, name, setFormData,value, label, required = false }) {
  console.log("Options for:", name,'are:', options)
  const [inputValue, setInputValue] = useState(value||"")
  const [filteredOptions, setFilteredOptions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const filtered = options.filter((option) => 
      typeof option === 'string' && option.toLowerCase().includes(inputValue.toLowerCase())
    )
    setFilteredOptions(filtered)
  }, [inputValue, options])

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [name]: e.target.value }))
    setInputValue(e.target.value)
    setIsOpen(true)
  }

  const handleOptionClick = (option) => {
    setFormData((prev) => ({ ...prev, [name]: option }))
    setInputValue(option)
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
                onClick={() => handleOptionClick(typeof option === 'string' ? option : String(option))}
              >
                {typeof option === 'string' ? option : String(option)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
