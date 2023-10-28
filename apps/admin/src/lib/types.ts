import type { JSONContent } from '@tiptap/core'

type BaseContent = {
  id: number
  title: string
  description: string
  content: JSONContent
  cover: string
  lang: string
}
export type Event = BaseContent & {
  createdAt: string
  updatedAt: string
  version: number
  user: User
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

export type User = {
  id: number
  createdAt: string
  updatedAt: string
  fullName: string
  email: string
  permissions: string[]
}

export type EventErrorResponse = BaseContentErrorResponse

export type UserErrorResponse = {
  fullName?: string
  email?: string
  password?: string
}
