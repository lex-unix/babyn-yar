import * as v from 'valibot'

export type Metadata = v.InferInput<typeof Metadata>
export const Metadata = v.object({
  currentPage: v.number(),
  firstPage: v.number(),
  lastPage: v.number(),
  pageSize: v.number(),
  totalRecords: v.number()
})
