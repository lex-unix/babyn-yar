export const galleryToasts = {
  deleteSuccess: {
    data: {
      title: 'Операція успішна',
      description: 'Зображення було видалено до галереї',
      variant: 'success' as const
    }
  },
  deleteError: {
    data: {
      title: 'Виникла помилка',
      description: 'Не вдалось видалити зображення з галереї. Спробуйте ще раз',
      variant: 'error' as const
    }
  },
  createSuccess: {
    data: {
      title: 'Операція успішна',
      description: 'Зображення було додано до галереї',
      variant: 'success' as const
    }
  },
  createError: {
    data: {
      title: 'Виникла помилка',
      description: 'Не вдалося додати зображення до галереї. Спробуйте ще раз',
      variant: 'error' as const
    }
  }
}
