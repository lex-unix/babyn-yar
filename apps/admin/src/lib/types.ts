import type { JSONContent } from '@tiptap/core'

export type Metadata = {
  currentPage: number
  firstPage: number
  lastPage: number
  pageSize: number
  totalRecords: number
}

type BaseContent = {
  id: number
  createdAt: string
  updatedAt: string
  occuredOn: string
  title: string
  description: string
  content: JSONContent
  cover: string
  version: number
  lang: string
}

export type VictimTestimony = BaseContent & {
  documents: string[]
  user: User
}
export type Book = BaseContent & {
  documents: string[]
  user: User
}
export type LegalDocument = BaseContent & {
  documents: string[]
  user: User
}

export type Event = BaseContent & {
  user: User
  documents: string[]
}

export type HolocaustDocument = BaseContent & { user: User }
export type MediaArticle = BaseContent & { user: User }
export type Partner = BaseContent & { user: User }
export type DevConcept = BaseContent & { user: User }

export type Asset = {
  id: number
  createdAt: string
  url: string
  fileName: string
  contentType: string
}

export type GalleryImage = {
  id: number
  createdAt: string
  url: string
}

export type User = {
  id: number
  createdAt: string
  updatedAt: string
  fullName: string
  email: string
  permissions: string[]
}

export type UserErrorResponse = {
  fullName?: string
  email?: string
  password?: string
}

export type ContentData = {
  id: number
  title: string
  author: string
  lastChange: string
}

export type Translation = {
  id: number
  title: string
}

export type Content = {
  id: number
  translationId: number
  slug: string
  createdAt: string
  updatedAt: string
  occurredOn: string
  contentType: string
  lang: string
  title: string
  description: string
  content: JSONContent
  cover: string
  documents: string[]
  version: number
  user: User
}

export type CreateContent = Omit<
  Content,
  | 'id'
  | 'translationId'
  | 'slug'
  | 'version'
  | 'user'
  | 'createdAt'
  | 'updatedAt'
>
