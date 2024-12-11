export type DynamicTypedKey<T, K extends string> = Record<K, T>
export type PaginatedResponse<T, K extends string> = {
  metadata: Metadata
} & Record<K, T[]>

export type Metadata = {
  currentPage: number
  firstPage: number
  lastPage: number
  pageSize: number
  totalRecords: number
}

export type User = {
  id: number
  createdAt: string
  updatedAt: string
  fullName: string
  email: string
  permissions: string[]
}

type BaseContent = {
  id: number
  createdAt: string
  updatedAt: string
  occuredOn: string
  title: string
  description: string
  content: string
  cover: string
  lang: string
  version: number
}

export type ContentData = {
  id: number
  title: string
  author: string
  lastChange: string
}

export type Event = BaseContent
export type EventWithUser = Event & { user: User }

export type MediaArticle = BaseContent
export type MediaArticleWithUser = MediaArticle & { user: User }

export type HolocaustDocument = BaseContent
export type HolocaustDocumentWithUser = HolocaustDocument & { user: User }

export type Partner = BaseContent
export type PartnerWithUser = Partner & { user: User }

export type DevConcept = BaseContent
export type DevConceptWithUser = DevConcept & { user: User }

export type LegalDocument = BaseContent & { documents: string[] }
export type LegalDocumentWithUser = LegalDocument & { user: User }

export type VictimTestimony = BaseContent & { documents: string[] }
export type VictimTestimonyWithUser = VictimTestimony & { user: User }

export type Book = BaseContent & { documents: string[] }
export type BookWithUser = Book & { user: User }

export type Victim = {
  id: string
  fullname: string
  info: string
  version: string
}

export type GalleryImage = {
  id: number
  createdAt: string
  url: string
}

export type Translation = {
  ukrainianId: number
  englishId: number
}
