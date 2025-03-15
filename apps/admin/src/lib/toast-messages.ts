export type ToastMessage = {
  data: {
    title: string
    description: string
    variant: 'success' | 'error' | 'warning'
  }
}

export const TOAST: Record<string, ToastMessage> = {
  DELETE_RECORDS_SUCCESS: {
    data: {
      title: 'Операція успішна',
      description: 'Елементи було видалено.',
      variant: 'success'
    }
  },
  DELETE_RECORDS_ERROR: {
    data: {
      title: 'Виникла помилка',
      description: 'Не вдалось видалити елементи. Спробуйте ще раз.',
      variant: 'error'
    }
  },
  CREATE_RECORD_SUCCESS: {
    data: {
      title: 'Операція успішна',
      description:
        'Новий запис було успішно створено і вже доступний для перегляду.',
      variant: 'success'
    }
  },
  REGISTER_SUCCESS: {
    data: {
      title: 'Операція успішна',
      description: 'Нового користувача додано',
      variant: 'success'
    }
  },
  UPDATE_SETTINGS_SUCCESS: {
    data: {
      title: 'Зміни збережено',
      description: 'Ваші зміни було збережено',
      variant: 'success'
    }
  },
  UPDATE_SETTINGS_ERROR: {
    data: {
      title: 'Зміни не збережено',
      description: 'Не вдалося зберегти ваші зміни',
      variant: 'error'
    }
  },
  CREDENTIALS_ERROR: {
    data: {
      title: 'Неправильно ввдені дані',
      description: 'Email або пароль введено неправильно',
      variant: 'error'
    }
  },
  SERVER_ERROR: {
    data: {
      title: 'Помилка',
      description: 'Сталася помикла. Cпробуйте, будь-ласка, ще раз',
      variant: 'error'
    }
  }
}

export const deleteSuccessMsg: ToastMessage = {
  data: {
    title: 'Операція успішна',
    description: 'Елементи було видалено.',
    variant: 'success'
  }
}

export const deleteErrorMsg: ToastMessage = {
  data: {
    title: 'Виникла помилка',
    description: 'Не вдалось видалити елементи. Спробуйте ще раз.',
    variant: 'error'
  }
}

export const fetchErrorMsg: ToastMessage = {
  data: {
    title: 'Виникла помилка',
    description: 'Не вдалось завантажити записи',
    variant: 'error'
  }
}

export const createRecordSuccessMsg: ToastMessage = {
  data: {
    title: 'Успіх!',
    description:
      'Новий запис було успішно створено і вже доступний для перегляду.',
    variant: 'success'
  }
}

export const updateRecordSuccessMsg: ToastMessage = {
  data: {
    title: 'Збережено!',
    description: 'Всі зміни успішно збережено.',
    variant: 'success'
  }
}

export const galleryImageExistsWarnMsg: ToastMessage = {
  data: {
    title: 'Вже додана!',
    description: 'Ця фотографія вже додана до галереї.',
    variant: 'warning'
  }
}

export const gallertImageCreateErrorMsg: ToastMessage = {
  data: {
    title: 'Помилка!',
    description:
      'Не вдалося додати зображення до галереї. Спробуйте, будь ласка, ще раз.',
    variant: 'error'
  }
}

export const invalidCredentialsMsg: ToastMessage = {
  data: {
    title: 'Неправильно ввдені дані',
    description: 'Email або пароль введено неправильно',
    variant: 'error'
  }
}

export const serverErrorMsg: ToastMessage = {
  data: {
    title: 'Помилка',
    description: 'Сталася помикла. Cпробуйте, будь-ласка, ще раз',
    variant: 'error'
  }
}
