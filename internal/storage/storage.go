package storage

import (
	"io"
	"net/http"
)

type Storage interface {
	Upload(file io.ReadSeeker, filename string) (string, error)
	Exists(key string) (bool, error)
	Delete(keys []string) error
}

func detectContentType(file io.ReadSeeker) (string, error) {
	buffer := make([]byte, 512)
	n, err := file.Read(buffer)
	if err != nil {
		return "", err
	}
	_, err = file.Seek(0, 0)
	if err != nil {
		return "", err
	}

	contentType := http.DetectContentType(buffer[:n])
	return contentType, nil
}
