import { toast } from 'svelte-sonner'

export const userToasts = {
  updateSettingsSuccess: () =>
    toast.success('Зміни збережено', {
      description: 'Ваші налаштування було збережено'
    }),
  updateSettingsError: () =>
    toast.error('Зміни не збережено', {
      description: 'Не вдалося зберегти ваші налаштування'
    }),
  deleteUsersSuccess: () =>
    toast.success('Операція успішна', {
      description: 'Користувачі були видалені'
    }),
  deleteUsersError: () =>
    toast.error('Виникла помилка', {
      description: 'Не вдалось видалити користувачів. Спробуйте ще раз.'
    })
}
