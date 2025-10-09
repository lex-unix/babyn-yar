import { toast } from 'svelte-sonner'

export const authToasts = {
  registerSuccess: () =>
    toast.success('Операція успішна', {
      description: 'Нового користувача додано'
    }),
  credentialsError: () =>
    toast.error('Неправильно ввдені дані', {
      description: 'Email або пароль введено неправильно'
    })
}
