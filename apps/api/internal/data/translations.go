package data

type Translation struct {
	ID             int64  `json:"id"`
	UkrainianID    int64  `json:"ukrainianId"`
	EnglishID      int64  `json:"englishId"`
	UkrainianTitle string `json:"ukrainianTitle"`
	EnglishTitle   string `json:"englishTitle"`
}
