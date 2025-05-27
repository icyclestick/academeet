export type CalendarEntry = {
  id?: number;
  calendar_type: string;
  user_id: string;
  match_id?: number | null;
  calendar_name: string;
  date: string;
  entry_type: 'event' | 'task';
  [key: string]: any;
};
