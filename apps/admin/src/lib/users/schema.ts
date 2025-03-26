import { Metadata } from '$lib/pagination/schema'
import * as v from 'valibot'
import '@valibot/i18n/uk'
import { Email, FullName } from '$lib/valibot'

v.setGlobalConfig({ lang: 'uk' })

const OptionalPassword = v.pipe(
  v.string(),
  v.transform(value => (value.length > 0 ? value : undefined)),
  v.undefinedable(v.pipe(v.string(), v.minLength(8)))
)

export const User = v.pipe(
  v.object({
    id: v.number(),
    fullName: FullName,
    email: Email,
    permissions: v.array(v.string()),
    createdAt: v.string(),
    updatedAt: v.string()
  }),
  v.transform(input => ({
    ...input,
    createdAt: new Date(input.createdAt),
    updatedAt: new Date(input.updatedAt)
  }))
)

export const Settings = v.object({
  fullName: FullName,
  email: Email,
  password: OptionalPassword
})

export const RegisterUser = v.object({
  email: Email,
  fullName: FullName,
  password: v.pipe(v.string(), v.minLength(8)),
  permission: v.union([v.literal('admin'), v.literal('publisher')])
})

export const UserResponse = v.object({
  user: User
})

export const PaginatedUsersResponse = v.object({
  users: v.array(User),
  metadata: Metadata
})

export type User = v.InferOutput<typeof User>
export type UserResponse = v.InferOutput<typeof UserResponse>
export type PaginatedUsersResponse = v.InferOutput<
  typeof PaginatedUsersResponse
>
export type Settings = v.InferOutput<typeof Settings>
export type RegisterUser = v.InferInput<typeof RegisterUser>
