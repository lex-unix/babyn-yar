import { languages } from '@/i18n/ui'

interface LanguagePickerProps {
  lang: string
}

export default function LanguagePicker({ lang }: LanguagePickerProps) {
  return (
    <label>
      <select
        className="py-1 px-1.5 border rounded border-black/20"
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
          <option key={name} value={code}>
            <span>{name}&nbsp;&nbsp;</span>
          </option>
        ))}
      </select>
    </label>
  )
}
