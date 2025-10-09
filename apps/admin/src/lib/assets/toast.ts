import { toast } from 'svelte-sonner'

export const assetToasts = {
  uploadSuccess: () =>
    toast.success('Операція успішна', {
      description: 'Файл(и) було успішно завантажено'
    }),
  uploadError: (description: string) =>
    toast.error('Не вдалось завнатажити файл(и)', {
      description
    }),
  deleteSuccess: () =>
    toast.success('Операція успішна', {
      description: 'Елементи було видалено.'
    }),
  deleteError: () =>
    toast.error('Виникла помилка', {
      description: 'Не вдалося видалити файли. Cпробуйте, будь-ласка, ще раз'
    })
}
