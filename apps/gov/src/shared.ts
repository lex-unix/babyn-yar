export const API_URL = import.meta.env.API_URL

export type Metadata = {
  currentPage: number
  firstPage: number
  lastPage: number
  pageSize: number
  totalRecords: number
}

export type Victim = {
  id: string
  fullname: string
  info: string
  version: string
}
