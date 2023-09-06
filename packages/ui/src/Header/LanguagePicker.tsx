import { languages } from 'i18n'

interface LanguagePickerProps {
  lang: string
}

export default function LanguagePicker({ lang }: LanguagePickerProps) {
  return (
    <label className="relative w-fit text-center text-lg uppercase md:w-32">
      <select
        className="mx-1 flex-1 appearance-none rounded bg-white px-0.5 md:mx-2 md:px-1"
        value={lang}
        onChange={e => {
          const newLang = e.currentTarget.value
          const [_leadingSlash, _oldLang, ...rest] =
            window.location.pathname.split('/')
          const slug = rest.join('/')
          console.log('Changing')
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
