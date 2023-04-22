import { languages } from '@/i18n/ui'
import './LanguagePicker.css'

interface LanguagePickerProps {
  lang: string
}

export default function LanguagePicker({ lang }: LanguagePickerProps) {
  return (
    <label>
      <select
        className="language-picker appearance-none rounded border border-black/20 py-1 pl-1.5 pr-6"
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
            {name}&nbsp;&nbsp;
          </option>
        ))}
      </select>
    </label>
  )
}
