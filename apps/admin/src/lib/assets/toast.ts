export const assetToasts = {
  uploadSuccess: {
    data: {
      title: 'Операція успішна',
      description: 'Файл(и) було успішно завантажено',
      variant: 'success' as const
    }
  },
  uploadError: (description: string) => ({
    data: {
      title: 'Не вдалось завнатажити файл(и)',
      description,
      variant: 'error' as const
    }
  }),
  deleteSuccess: {
    data: {
      title: 'Операція успішна',
      description: 'Елементи було видалено.',
      variant: 'success' as const
    }
  },
  deleteError: {
    data: {
      title: 'Виникла помилка',
      description: 'Не вдалося видалити файли. Cпробуйте, будь-ласка, ще раз',
      variant: 'error' as const
    }
  }
}
