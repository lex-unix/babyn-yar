export const authToasts = {
  registerSuccess: {
    data: {
      title: 'Операція успішна',
      description: 'Нового користувача додано',
      variant: 'success' as const
    }
  },
  credentialsError: {
    data: {
      title: 'Неправильно ввдені дані',
      description: 'Email або пароль введено неправильно',
      variant: 'error' as const
    }
  }
}
