package main

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/lex-unix/babyn-yar/internal/data"
	"github.com/lex-unix/babyn-yar/internal/validator"
)

func (app *application) createHolocaustDocumentHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title       string    `json:"title"`
		Description string    `json:"description"`
		Content     string    `json:"content"`
		Lang        string    `json:"lang"`
		Cover       string    `json:"cover"`
		OccuredOn   time.Time `json:"occuredOn"`
		Translation *int64    `json:"translationId"`
	}

	err := app.readJson(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := app.contextGetUser(r)

	document := &data.HolocaustDocument{
		Title:       input.Title,
		Description: input.Description,
		Content:     input.Content,
		Lang:        input.Lang,
		Cover:       input.Cover,
		OccuredOn:   input.OccuredOn,
		UserID:      user.ID,
	}

	v := validator.New()

	if data.ValidateHolocaustDocument(v, document); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.HolocaustDocuments.Insert(document)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if input.Translation != nil {
		translation := data.Translation{
			EnglishID:   document.ID,
			UkrainianID: *input.Translation,
		}

		if document.Lang == "ua" {
			translation.UkrainianID = document.ID
			translation.EnglishID = *input.Translation
		}

		if err := app.models.HolocaustDocuments.CreateTranslation(&translation); err != nil {
			app.logger.PrintInfo("failed to create translation", map[string]string{"error": err.Error()})
		}
	}

	headers := make(http.Header)
	headers.Set("Location", fmt.Sprintf("/v1/holocaust-documents/%d", document.ID))

	err = app.writeJson(w, http.StatusCreated, envelope{"document": document}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) listHolocaustDocumentsHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Lang string
		data.Filters
	}

	v := validator.New()

	qs := r.URL.Query()

	input.Lang = app.readString(qs, "lang", "")

	input.Filters.Page = app.readInt(qs, "page", 1, v)
	input.Filters.PageSize = app.readInt(qs, "page_size", 10, v)

	input.Filters.Sort = app.readString(qs, "sort", "-created_at")
	input.Filters.SortSafelist = []string{"created_at", "-created_at", "occured_on", "-occured_on"}

	if data.ValidateFilters(v, input.Filters); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	documents, metadata, err := app.models.HolocaustDocuments.GetAll(input.Lang, input.Filters)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"documents": documents, "metadata": metadata}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) deleteHolocaustDocumentsHandler(w http.ResponseWriter, r *http.Request) {
	v := validator.New()

	qs := r.URL.Query()

	ids := app.readIntList(qs, "ids", v)

	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err := app.models.HolocaustDocuments.DeleteMultiple(ids)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"message": "documents successfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) showHolocaustDocumentHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	document, err := app.models.HolocaustDocuments.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	response := envelope{"document": document}
	translation, err := app.models.HolocaustDocuments.GetTranslation(document.ID)
	if err == nil {
		response["translation"] = translation
	}

	err = app.writeJson(w, http.StatusOK, response, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) updateHolocaustDocumentHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	document, err := app.models.HolocaustDocuments.Get(id)
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
		OccuredOn     *time.Time `json:"occuredOn"`
		TranslationID *int64     `json:"translationId"`
	}

	err = app.readJson(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if input.Title != nil {
		document.Title = *input.Title
	}

	if input.Description != nil {
		document.Description = *input.Description
	}

	if input.Content != nil {
		document.Content = *input.Content
	}

	if input.Lang != nil {
		document.Lang = *input.Lang
	}

	if input.Cover != nil {
		document.Cover = *input.Cover
	}

	if input.OccuredOn != nil {
		document.OccuredOn = *input.OccuredOn
	}

	v := validator.New()

	if data.ValidateHolocaustDocument(v, document); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.HolocaustDocuments.Update(document)
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
		if err := app.models.HolocaustDocuments.DeleteTranslation(document.ID); err != nil {
			app.logger.PrintInfo("failed to delete translation", map[string]string{"error": err.Error()})
		}
	} else {
		translation, err := app.models.HolocaustDocuments.GetTranslation(document.ID)
		if err != nil && errors.Is(err, data.ErrRecordNotFound) {
			translation := data.Translation{
				EnglishID:   document.ID,
				UkrainianID: *input.TranslationID,
			}

			if document.Lang == "ua" {
				translation.UkrainianID = document.ID
				translation.EnglishID = *input.TranslationID
			}

			err := app.models.HolocaustDocuments.CreateTranslation(&translation)
			if err != nil {
				app.logger.PrintInfo("failed to create translation", map[string]string{"error": err.Error()})
			}

		} else if err == nil {
			if document.Lang == "ua" {
				translation.UkrainianID = document.ID
				translation.EnglishID = *input.TranslationID
			} else {
				translation.EnglishID = document.ID
				translation.UkrainianID = *input.TranslationID
			}

			if err := app.models.HolocaustDocuments.UpdateTranslation(translation); err != nil {
				app.logger.PrintInfo("failed to update translation", map[string]string{"error": err.Error()})
			}
		}
	}

	err = app.writeJson(w, http.StatusOK, envelope{"document": document}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
