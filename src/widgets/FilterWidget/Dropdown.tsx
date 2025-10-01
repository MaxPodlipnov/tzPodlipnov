import React, { useState, useRef, useEffect } from "react";
import "./Dropdown.css";
import { DropdownProps } from "@/shared/types";

const Dropdown: React.FC<DropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: "all", label: "Все типы" },
    { value: "incoming", label: "Входящие" },
    { value: "outgoing", label: "Исходящие" },
  ];

  const currentOption = options.find((opt) => opt.value === value);

  const handleReset = () => {
    onChange("all");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown-container">
      <div className="dropdown" ref={dropdownRef}>
        <button
          className={`dropdown-trigger ${
            value !== "all" ? "active-filter" : ""
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="dropdown-text">{currentOption?.label}</span>
          <img
            src={isOpen ? "/icon_vector_up.svg" : "/icon_vector_down.svg"}
            alt="arrow"
            className="dropdown-arrow"
          />
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            {options.map((option) => (
              <button
                key={option.value}
                className={`dropdown-item ${
                  value === option.value ? "active" : ""
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {value !== "all" && (
        <button className="reset-button" onClick={handleReset}>
          Сбросить фильтры
          <img src="icon_close.svg" alt="close" className="reset-icon" />
        </button>
      )}
    </div>
  );
};

export default Dropdown;
