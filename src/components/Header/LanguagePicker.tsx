import { languages } from '@/i18n/ui'
import { LanguageIcon, ChevronDownIcon } from '@heroicons/react/24/solid'

interface LanguagePickerProps {
  lang: string
}

export default function LanguagePicker({ lang }: LanguagePickerProps) {
  return (
    <label className="relative flex items-center text-xs font-semibold uppercase text-sky-600">
      <span className="absolute left-1 top-[50%] translate-y-[-50%]">
        <LanguageIcon className="h-4 w-4" />
      </span>
      <span className="absolute right-0.5 top-[50%] translate-y-[-50%]">
        <ChevronDownIcon className="h-4 w-4" />
      </span>
      <select
        className="flex-1 appearance-none rounded border border-gray-400/20 bg-gray-50 px-6 py-3 uppercase"
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
