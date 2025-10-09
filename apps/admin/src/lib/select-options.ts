export const permissionOptions = [
  { value: 'publisher', label: 'Автор' },
  { value: 'admin', label: 'Адміністратор' }
]

export const DEFAULT_SORT_OPTION: keyof typeof sortOptions = '-created_at'
export const sortOptions = {
  '-created_at': { label: 'Дата створення', order: 'desc' },
  created_at: { label: 'Дата створення', order: 'asc' },
  '-file_name': { label: 'Назва файлу', order: 'desc' },
  file_name: { label: 'Назва файлу', order: 'asc' }
}

export const langOptions = [
  { value: 'ua', label: 'Українська' },
  { value: 'en', label: 'Англійська' }
]

export const pageSizeOptions = [
  { value: '10', label: '10 на сторінку' },
  { value: '20', label: '20 на сторінку' },
  { value: '50', label: '50 на сторінку' },
  { value: '100', label: '100 на сторінку' }
]

export const DEFAULT_CONTENT_SORT_OPTION: keyof typeof contentSortOptions =
  '-created_at'
export const contentSortOptions = {
  created_at: {
    label: 'Дата створення',
    order: 'asc'
  },
  '-created_at': {
    label: 'Дата створення',
    order: 'desc'
  },
  occured_on: {
    label: 'Дата проведення',
    order: 'asc'
  },
  '-occured_on': {
    label: 'Дата проведення',
    order: 'desc'
  }
}
