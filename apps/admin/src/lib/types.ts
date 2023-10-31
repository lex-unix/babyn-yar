import type { JSONContent } from '@tiptap/core'

type BaseContent = {
  id: number
  createdAt: string
  updatedAt: string
  title: string
  description: string
  content: JSONContent
  cover: string
  lang: string
}

export type Event = BaseContent & {
  version: number
  user: User
}

export type VictimTestimony = BaseContent & {
  documents: string[]
  user: User
}

export type Book = BaseContent & {
  documents: string[]
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
  lang?: string
  cover?: string
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

export type TestimonyErrorResponse = BaseContentErrorResponse & {
  documents?: string
}

export type BookErrorResponse = BaseContentErrorResponse & {
  documents?: string
}

export type UserErrorResponse = {
  fullName?: string
  email?: string
  password?: string
}
