import React, { useEffect, useState } from "react";
import { AllCalls } from "../../entities/AllCalls";
import "./Table.css";
import RowPhoneTable from "../../entities/RowPhoneTable/RowPhoneTable";
import { useCallFilters } from "../../features/CallFiltering";
import Dropdown from "../FilterWidget/Dropdown";
import HeaderTable from "../HeaderTable/HeaderTable";
import DateFilter from "../DateSelectionWidget/DateFilter";
import { Call, FilterType, SortField, SortDirection } from "@/shared/types";
import { assignQualityToCalls } from "@/shared/utils/qualityGenerator";

const Table: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [dateRange, setDateRange] = useState<number | "custom">(3);
  const [customDates, setCustomDates] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const { results } = await AllCalls.getAllCalls();
        // Добавляем случайные оценки качества к каждому звонку
        const callsWithQuality = assignQualityToCalls(results);
        setCalls(callsWithQuality);
      } catch (error) {
        console.error("Failed to fetch calls:", error);
      }
    };
    fetchCalls();
  }, []);

  const filteredCalls = useCallFilters(calls, filter);

  const dateFilteredCalls = filteredCalls.filter((call) => {
    const callDate = new Date(call.date);

    // Если выбраны кастомные даты
    if (customDates && customDates.startDate && customDates.endDate) {
      const startDate = new Date(customDates.startDate);
      const endDate = new Date(customDates.endDate);

      // Нормализуем даты, устанавливая время в начало и конец дня
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      callDate.setHours(0, 0, 0, 0);

      return callDate >= startDate && callDate <= endDate;
    }

    // Если выбрано количество дней
    const now = new Date();
    const daysDiff = Math.ceil(
      (now.getTime() - callDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return typeof dateRange === "number" && daysDiff <= dateRange;
  });

  const handleDateChange = (
    value: number | "custom" | { startDate: string; endDate: string }
  ) => {
    if (typeof value === "object" && value.startDate && value.endDate) {
      // Если переданы кастомные даты
      setCustomDates(value);
      setDateRange("custom");
    } else if (typeof value === "number") {
      // Если передано количество дней (включая сброс к 3 дням)
      setDateRange(value);
      setCustomDates(null);
    } else if (value === "custom") {
      // Если выбран режим кастомных дат, но даты еще не выбраны
      setDateRange("custom");
    }
  };

  const handleSort = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const sortedCalls = dateFilteredCalls.sort((a, b) => {
    let aValue, bValue;

    if (sortField === "date") {
      aValue = new Date(a.date);
      bValue = new Date(b.date);
    } else if (sortField === "duration") {
      aValue = a.time || 0;
      bValue = b.time || 0;
    } else {
      return 0;
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <>
      <div className="calls-header">
        <Dropdown
          value={filter}
          onChange={(value: string) => setFilter(value as FilterType)}
        />
        <DateFilter value={dateRange} onChange={handleDateChange} />
      </div>

      <div className="calls-container">
        <table className="calls-table">
          <thead>
            <HeaderTable onSort={handleSort} />
          </thead>
          <tbody>
            {sortedCalls.map((call) => (
              <RowPhoneTable key={call.id} call={call} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
