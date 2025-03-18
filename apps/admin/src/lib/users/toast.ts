export const userToasts = {
  updateSettingsSuccess: {
    data: {
      title: 'Зміни збережено',
      description: 'Ваші налаштування було збережено',
      variant: 'success' as const
    }
  },
  updateSettingsError: {
    data: {
      title: 'Зміни не збережено',
      description: 'Не вдалося зберегти ваші налаштування',
      variant: 'error' as const
    }
  },
  deleteUsersSuccess: {
    data: {
      title: 'Операція успішна',
      description: 'Користувачі були видалені',
      variant: 'success' as const
    }
  },
  deleteUsersError: {
    data: {
      title: 'Виникла помилка',
      description: 'Не вдалось видалити користувачів. Спробуйте ще раз.',
      variant: 'error' as const
    }
  }
}
