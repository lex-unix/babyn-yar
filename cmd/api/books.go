package main

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/lex-unix/babyn-yar/internal/data"
	"github.com/lex-unix/babyn-yar/internal/validator"
)

func (app *application) createBookHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title       string    `json:"title"`
		Description string    `json:"description"`
		Content     string    `json:"content"`
		Cover       string    `json:"cover"`
		Lang        string    `json:"lang"`
		Documents   []string  `json:"documents"`
		OccuredOn   time.Time `json:"occuredOn"`
		Translation *int64    `json:"translationId"`
	}

	err := app.readJson(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := app.contextGetUser(r)

	book := &data.Book{
		Title:       input.Title,
		Description: input.Description,
		Content:     input.Content,
		Cover:       input.Cover,
		Lang:        input.Lang,
		Documents:   []string{},
		OccuredOn:   input.OccuredOn,
		UserID:      user.ID,
	}

	if len(input.Documents) != 0 {
		book.Documents = input.Documents
	}

	v := validator.New()

	if data.ValidateBook(v, book); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Books.Insert(book)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if input.Translation != nil {
		translation := data.Translation{
			EnglishID:   book.ID,
			UkrainianID: *input.Translation,
		}

		if book.Lang == "ua" {
			translation.UkrainianID = book.ID
			translation.EnglishID = *input.Translation
		}

		if err := app.models.Books.CreateTranslation(&translation); err != nil {
			app.logger.PrintInfo("failed to create translation", map[string]string{"error": err.Error()})
		}
	}

	headers := make(http.Header)
	headers.Set("Location", fmt.Sprintf("/v1/books/%d", book.ID))

	err = app.writeJson(w, http.StatusCreated, envelope{"book": book}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) listBooksHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title string
		Lang  string
		data.Filters
	}

	v := validator.New()

	qs := r.URL.Query()

	input.Lang = app.readString(qs, "lang", "")
	input.Title = app.readString(qs, "title", "")

	input.Filters.Page = app.readInt(qs, "page", 1, v)
	input.Filters.PageSize = app.readInt(qs, "page_size", 10, v)

	input.Filters.Sort = app.readString(qs, "sort", "-created_at")
	input.Filters.SortSafelist = []string{"created_at", "-created_at", "occured_on", "-occured_on"}

	if data.ValidateFilters(v, input.Filters); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	books, metadata, err := app.models.Books.GetAll(input.Lang, input.Title, input.Filters)

	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"books": books, "metadata": metadata}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) showBookHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	book, err := app.models.Books.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	response := envelope{"book": book}
	translation, err := app.models.Books.GetTranslation(book.ID)
	if err == nil {
		response["translation"] = translation
	}

	err = app.writeJson(w, http.StatusOK, response, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) updateBookHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	book, err := app.models.Books.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	var input struct {
		Title         *string    `json:"title"`
		Description   *string    `json:"description"`
		Content       *string    `json:"content"`
		Lang          *string    `json:"lang"`
		Cover         *string    `json:"cover"`
		Documents     []string   `json:"documents"`
		OccuredOn     *time.Time `json:"occuredOn"`
		TranslationID *int64     `json:"translationId"`
	}

	err = app.readJson(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if input.Title != nil {
		book.Title = *input.Title
	}

	if input.Description != nil {
		book.Description = *input.Description
	}

	if input.Content != nil {
		book.Content = *input.Content
	}

	if input.Lang != nil {
		book.Lang = *input.Lang
	}

	if input.Cover != nil {
		book.Cover = *input.Cover
	}

	if input.Documents != nil {
		book.Documents = input.Documents
	}

	if input.OccuredOn != nil {
		book.OccuredOn = *input.OccuredOn
	}

	v := validator.New()

	if data.ValidateBook(v, book); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Books.Update(book)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrEditConflict):
			app.editConflictResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	if input.TranslationID == nil {
		if err := app.models.Books.DeleteTranslation(book.ID); err != nil {
			app.logger.PrintInfo("failed to delete translation", map[string]string{"error": err.Error()})
		}
	} else {
		translation, err := app.models.Books.GetTranslation(book.ID)
		if err != nil && errors.Is(err, data.ErrRecordNotFound) {
			translation := data.Translation{
				EnglishID:   book.ID,
				UkrainianID: *input.TranslationID,
			}

			if book.Lang == "ua" {
				translation.UkrainianID = book.ID
				translation.EnglishID = *input.TranslationID
			}

			err := app.models.Books.CreateTranslation(&translation)
			if err != nil {
				app.logger.PrintInfo("failed to create translation", map[string]string{"error": err.Error()})
			}

		} else if err == nil {
			if book.Lang == "ua" {
				translation.UkrainianID = book.ID
				translation.EnglishID = *input.TranslationID
			} else {
				translation.EnglishID = book.ID
				translation.UkrainianID = *input.TranslationID
			}

			if err := app.models.Books.UpdateTranslation(translation); err != nil {
				app.logger.PrintInfo("failed to update translation", map[string]string{"error": err.Error()})
			}
		}
	}

	err = app.writeJson(w, http.StatusOK, envelope{"book": book}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) deleteBooksHandler(w http.ResponseWriter, r *http.Request) {
	v := validator.New()

	qs := r.URL.Query()

	ids := app.readIntList(qs, "ids", v)

	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err := app.models.Books.DeleteMultiple(ids)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"message": "books successfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
