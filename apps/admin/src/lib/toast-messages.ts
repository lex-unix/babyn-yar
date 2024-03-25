type ToastMessage = {
  data: {
    title: string
    description: string
    variant: 'success' | 'error'
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
