import type { JSONContent } from '@tiptap/core'

type BaseContent = {
  id: number
  title: string
  description: string
  content: JSONContent
}
export type Event = BaseContent & {
  createdAt: string
  updatedAt: string
  version: number
}

export type Metadata = {
  currentPage: number
  firstPage: number
  lastPage: number
  pageSize: number
  totalRecords: number
}

type BaseContentErrorResponse = {
  title?: string
  description?: string
  content?: string
}

export type Asset = {
  id: number
  createdAt: string
  url: string
  fileName: string
  contentType: string
}

export type EventErrorResponse = BaseContentErrorResponse
