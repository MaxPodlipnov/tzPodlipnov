import React, { useState } from "react";
import "./HeaderTable.css";
import { SortField, SortDirection } from "@/shared/types";

interface HeaderTableProps {
  onSort: (field: SortField, direction: SortDirection) => void;
}

const HeaderTable: React.FC<HeaderTableProps> = ({ onSort }) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    let newDirection: SortDirection = "asc";
    if (sortField === field && sortDirection === "asc") {
      newDirection = "desc";
    }

    setSortField(field);
    setSortDirection(newDirection);
    onSort?.(field, newDirection);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <img src="icon_vector_down.svg" alt="arrow_down" />;
    }
    return sortDirection === "asc" ? (
      <img src="icon_vector_up.svg" alt="arrow_up" />
    ) : (
      <img src="icon_vector_down.svg" alt="arrow_down" />
    );
  };

  return (
    <>
      <tr className="table-header">
        <th className="table-header-title">Тип</th>
        <th
          className="table-header-date sortable"
          onClick={() => handleSort("date")}
        >
          Время {getSortIcon("date")}
        </th>
        <th className="table-header-person_avatar">Сотрудник</th>
        <th className="table-header-from_number">Звонок</th>
        <th className="table-header-source">Источник</th>
        <th className="table-header-rating">Оценка</th>
        <th
          className="table-header-time sortable"
          onClick={() => handleSort("duration")}
        >
          Длительность {getSortIcon("duration")}
        </th>
      </tr>
    </>
  );
};

export default HeaderTable;
