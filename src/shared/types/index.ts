export interface Call {
  id: number;
  date: string;
  time: number;
  type: "incoming" | "outgoing" | "missed";
  phone: string;
  source: string;
  status: "success" | "failed" | "cancelled";
  duration?: number;
  recording?: string;
  in_out: number;
  record: string;
  partnership_id: string;
  person_avatar: string;
  from_number: string;
  quality?: CallQuality;
}

export type CallQuality = "bad" | "good" | "excellent";

export interface CallFilters {
  type: "all" | "incoming" | "outgoing" | "missed";
  dateRange: number | "custom";
  customDates?: {
    startDate: string;
    endDate: string;
  };
}

export interface DateFilterProps {
  value: number | "custom";
  onChange: (
    value: number | "custom" | { startDate: string; endDate: string }
  ) => void;
}

export interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export interface TableProps {
  calls: Call[];
  onSort: (field: string, direction: "asc" | "desc") => void;
}

export interface RowPhoneTableProps {
  call: Call;
}

export interface AudioPlayerProps {
  src: string;
  onPlay?: () => void;
  onPause?: () => void;
}

export interface CallQualityProps {
  quality: CallQuality;
}

export interface ApiResponse<T> {
  results: T[];
  total: number;
}

export type FilterType = "all" | "incoming" | "outgoing" | "missed";
export type SortField = "date" | "duration" | "type";
export type SortDirection = "asc" | "desc";
