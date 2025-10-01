import React, { useState, useRef, useEffect } from "react";
import "./DateFilter.css";
import { DateFilterProps } from "@/shared/types";

const DateFilter: React.FC<DateFilterProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLeftPressed, setIsLeftPressed] = useState(false);
  const [isRightPressed, setIsRightPressed] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const startDateInputRef = useRef(null);
  const endDateInputRef = useRef(null);

  const periods = [
    { value: 3, label: "3 дня" },
    { value: 7, label: "Неделя" },
    { value: 30, label: "Месяц" },
    { value: 365, label: "Год" },
    { value: "custom", label: "Указать даты" },
  ];

  const currentPeriod =
    periods.find((period) => period.value === value) || periods[0];

  const handleDayChange = (increment: number) => {
    if (value === "custom") return;

    const newValue = value + increment;
    if (newValue >= 1) {
      onChange(newValue);
    }
  };

  const handlePeriodSelect = (selectedValue: number | "custom") => {
    if (selectedValue === "custom") {
      setShowDatePicker(true);
    } else {
      onChange(selectedValue);
      setStartDate("");
      setEndDate("");
    }
    setIsOpen(false);
  };

  const handleDateSelect = () => {
    if (startDate && endDate) {
      onChange({
        startDate: startDate,
        endDate: endDate,
      });
      setShowDatePicker(false);
    }
  };

  const handleCancelDateSelect = () => {
    setShowDatePicker(false);
    setStartDate("");
    setEndDate("");
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    onChange(3);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDisplayText = () => {
    if (value === "custom") {
      if (startDate && endDate) {
        const formatDate = (dateStr: string) => {
          const date = new Date(dateStr);
          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const year = date.getFullYear().toString().slice(-2);
          return `${day}.${month}.${year}`;
        };
        return `${formatDate(startDate)}-${formatDate(endDate)}`;
      }
      return "__.__.__-__.__.__";
    }
    if (typeof value === "number") {
      if (value === 1) return "1 день";
      if (value >= 2 && value <= 4) return `${value} дня`;
      if (value >= 5 && value <= 20) return `${value} дней`;
    }
    return currentPeriod.label;
  };

  const getLeftArrowSrc = () => {
    if (value === "custom") return "/icon_vector_left_gray.svg";
    return isLeftPressed
      ? "/icon_vector_left_blue.svg"
      : "/icon_vector_left_gray.svg";
  };

  const getRightArrowSrc = () => {
    if (value === "custom") return "/icon_vector_right_gray.svg";
    return isRightPressed
      ? "/icon_vector_right_blue.svg"
      : "/icon_vector_right_gray.svg";
  };

  const areArrowsDisabled = value === "custom";

  return (
    <div className="date-filter-container">
      <div className="date-filter" ref={dropdownRef}>
        <div className="date-filter__main">
          <button
            className={`date-filter__button date-filter__decrease ${
              areArrowsDisabled ? "disabled" : ""
            }`}
            onClick={() => handleDayChange(-1)}
            onMouseDown={() => !areArrowsDisabled && setIsLeftPressed(true)}
            onMouseUp={() => setIsLeftPressed(false)}
            onMouseLeave={() => setIsLeftPressed(false)}
            disabled={areArrowsDisabled}
          >
            <img src={getLeftArrowSrc()} alt="previous" />
          </button>

          <button
            className="date-filter__display"
            onClick={() => {
              if (value === "custom") {
                setShowDatePicker(!showDatePicker);
              } else {
                setIsOpen(!isOpen);
              }
            }}
          >
            <img
              src={
                isOpen || showDatePicker
                  ? "/icon_calendar_blue.svg"
                  : "/icon_calendar_gray.svg"
              }
              alt="calendar"
              className="date-filter__calendar"
            />
            <span className="date-filter__text">{getDisplayText()}</span>
          </button>

          <button
            className={`date-filter__button date-filter__increase ${
              areArrowsDisabled ? "disabled" : ""
            }`}
            onClick={() => handleDayChange(1)}
            onMouseDown={() => !areArrowsDisabled && setIsRightPressed(true)}
            onMouseUp={() => setIsRightPressed(false)}
            onMouseLeave={() => setIsRightPressed(false)}
            disabled={areArrowsDisabled}
          >
            <img src={getRightArrowSrc()} alt="next" />
          </button>
        </div>

        {isOpen && (
          <div className="date-filter__dropdown">
            {periods.map((period) => (
              <button
                key={period.value}
                className={`date-filter__option ${
                  value === period.value ? "active" : ""
                } ${
                  period.value === "custom" ? "date-filter__option--custom" : ""
                }`}
                onClick={() =>
                  handlePeriodSelect(period.value as number | "custom")
                }
              >
                {period.label === "Указать даты" ? (
                  <div className="date-option-with-placeholder">
                    <span>{period.label}</span>
                    <div className="date-placeholder-row">
                      <span className="date-placeholder-text">
                        __.__.__-__.__.__
                      </span>
                      <img
                        src="/icon_calendar_gray.svg"
                        alt="calendar"
                        className="date-placeholder-icon"
                      />
                    </div>
                  </div>
                ) : (
                  period.label
                )}
              </button>
            ))}
          </div>
        )}

        {showDatePicker && (
          <div className="date-picker-modal">
            <div className="date-picker-header">
              <span>Указать даты</span>
            </div>
            <div className="date-inputs">
              <div className="date-input-wrapper">
                <input
                  ref={startDateInputRef}
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="date-input"
                  placeholder="дд.мм.гг"
                />
              </div>
              <span className="date-separator">-</span>
              <div className="date-input-wrapper">
                <input
                  ref={endDateInputRef}
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="date-input"
                  placeholder="дд.мм.гг"
                />
              </div>
            </div>
            <div className="date-picker-actions">
              <button
                className="date-cancel-btn"
                onClick={handleCancelDateSelect}
              >
                Отмена
              </button>
              <button
                className="date-apply-btn"
                onClick={handleDateSelect}
                disabled={!startDate || !endDate}
              >
                Применить
              </button>
            </div>
          </div>
        )}
      </div>

      {value === "custom" && startDate && endDate && (
        <button className="reset-button" onClick={handleReset}>
          Сбросить фильтры
          <img src="/icon_close.svg" alt="close" className="reset-icon" />
        </button>
      )}
    </div>
  );
};

export default DateFilter;
