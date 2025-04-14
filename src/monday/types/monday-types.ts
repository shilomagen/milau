    export interface MondayBoard {
  id: string;
  name: string;
  description?: string;
  columns?: MondayColumn[];
  items?: MondayItem[];
}

export interface MondayColumn {
  id: string;
  title: string;
  type: string;
}

export interface MondayItem {
  id: string;
  name: string;
  board?: {
    id: string;
    name: string;
  };
  group?: {
    id: string;
    title: string;
  };
  column_values?: MondayColumnValue[];
  created_at?: string;
  updated_at?: string;
  creator_id?: string;
  state?: string;
}

export interface MondayColumnValue {
  id: string;
  text?: string;
  value?: string;
  type?: string;
}

export interface MondayUser {
  id: string;
  name: string;
  email: string;
  photo_thumb_small?: string;
}
