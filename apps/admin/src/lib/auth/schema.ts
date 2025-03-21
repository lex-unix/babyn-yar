import { Email, FullName } from '$lib/valibot'
import * as v from 'valibot'

export const RegisterUser = v.object({
  email: Email,
  fullName: FullName,
  password: v.pipe(v.string(), v.minLength(8)),
  permission: v.union([v.literal('admin'), v.literal('publisher')])
})

export const Login = v.object({
  password: v.pipe(v.string(), v.minLength(8)),
  email: v.pipe(v.string(), v.email())
})

export type Login = v.InferInput<typeof Login>
export type RegisterUser = v.InferInput<typeof RegisterUser>
