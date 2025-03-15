package slug

import (
	"strings"
	"unicode"
)

var UkrainianASCII = map[rune]string{
	'а': "a",
	'б': "b",
	'в': "v",
	'г': "h",
	'ґ': "g",
	'д': "d",
	'е': "e",
	'є': "ie",
	'ж': "zh",
	'з': "z",
	'и': "y",
	'і': "i",
	'ї': "i",
	'й': "i",
	'к': "k",
	'л': "l",
	'м': "m",
	'н': "n",
	'о': "o",
	'п': "p",
	'р': "r",
	'с': "s",
	'т': "t",
	'у': "u",
	'ф': "f",
	'х': "kh",
	'ц': "ts",
	'ч': "ch",
	'ш': "sh",
	'щ': "shch",
	'ь': "",
	'ю': "yu",
	'я': "ya",
}

func Slugify(title string) string {
	var builder strings.Builder
	builder.Grow(len(title))

	var lastWasHyphen bool
	for _, char := range strings.TrimSpace(title) {
		char = unicode.ToLower(char)
		switch {
		case unicode.In(char, unicode.Latin, unicode.Cyrillic):
			if translated, exists := UkrainianASCII[char]; exists {
				builder.WriteString(translated)
			} else {
				builder.WriteRune(char)
			}
			lastWasHyphen = false

		case unicode.IsNumber(char):
			builder.WriteRune(char)
			lastWasHyphen = false

		case char == '-' || char == ' ' || char == '_':
			if !lastWasHyphen {
				builder.WriteRune('-')
				lastWasHyphen = true
			}
		}
	}

	return strings.TrimRight(builder.String(), "-")
}
