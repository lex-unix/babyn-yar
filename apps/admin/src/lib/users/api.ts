import { UserSchema } from '@repo/schema'
import { UserAPI } from '@repo/api'

export async function fetchUsers(filters: UserSchema.Filters) {
  return UserAPI.list(filters)
}

export async function deleteUsers(ids: number[]) {
  return UserAPI.remove(ids)
}

export async function updateSettings(settings: UserSchema.Settings) {
  return UserAPI.updateSettings(settings)
}
