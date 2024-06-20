export type ToastMessage = {
  data: {
    title: string
    description: string
    variant: 'success' | 'error' | 'warning'
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
