export interface TableColumn {
  key: string
  label: string
}

export interface Action {
  type: string
  label: string
  primary?: boolean
}

export interface TableRow {
  [key: string]: string | number | boolean | undefined | null | Action[]
  actions: Action[]
}

export interface TableData {
  title: string
  columns: TableColumn[]
  rows: TableRow[]
}
