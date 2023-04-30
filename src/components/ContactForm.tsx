import { useTranslations } from '@/i18n/utils'
import type { ComponentProps } from 'react'

export default function ContactForm({ lang }: { lang: 'en' | 'ua' }) {
  const t = useTranslations(lang)

  return (
    <form className="space-y-5">
      <FormInput name="surname" label={t('contact.form.surname')} />
      <FormInput name="name" label={t('contact.form.name')} />
      <FormInput name="email" label={t('contact.form.email')} type="email" />
      <FormInput name="message" label={t('contact.form.message')} />
      <button>{t('contact.form.button')}</button>
    </form>
  )
}

function FormInput({
  name,
  label,
  ...props
}: { name: string; label: string } & ComponentProps<'input'>) {
  return (
    <label className="block">
      {label}
      <input name={name} className="block border px-3 py-2" {...props} />
    </label>
  )
}
