type BaseContent = {
  id: number
  createdAt: string
  updatedAt: string
  occuredOn: string
  title: string
  description: string
  content: string
  cover: string
  version: number
}

export type Event = BaseContent
export type MediaArticle = BaseContent

export type HolocaustDocument = BaseContent

export type VictimTestimony = BaseContent & {
  documents: string[]
}

export type Book = BaseContent & {
  documents: string[]
}

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

export type GalleryImage = {
  id: number
  createdAt: string
  url: string
}
