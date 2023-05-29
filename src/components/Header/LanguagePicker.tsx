import { languages } from '@/i18n/ui'

interface LanguagePickerProps {
  lang: string
}

export default function LanguagePicker({ lang }: LanguagePickerProps) {
  return (
    <label className="relative w-32 text-center text-lg uppercase">
      <select
        className="mx-2 flex-1 appearance-none rounded px-1"
        value={lang}
        onChange={e => {
          const newLang = e.currentTarget.value
          const [_leadingSlash, _oldLang, ...rest] =
            window.location.pathname.split('/')
          const slug = rest.join('/')
          window.location.pathname = `/${newLang}/${slug}`
        }}
      >
        {Object.entries(languages).map(([code, name]) => (
          <option key={name} value={code} className="normal-case">
            {name}&nbsp;&nbsp;
          </option>
        ))}
      </select>
    </label>
  )
}
