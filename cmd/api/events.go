package main

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/lex-unix/babyn-yar/internal/data"
	"github.com/lex-unix/babyn-yar/internal/validator"
)

func (app *application) createEventHandler(w http.ResponseWriter, r *http.Request) {
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

	event := &data.Event{
		Title:       input.Title,
		Description: input.Description,
		Content:     input.Content,
		Lang:        input.Lang,
		Cover:       input.Cover,
		OccuredOn:   input.OccuredOn,
		UserID:      user.ID,
	}

	v := validator.New()

	if data.ValidateEvent(v, event); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Events.Insert(event)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	translation := data.Translation{
		EnglishID:   event.ID,
		UkrainianID: *input.Translation,
	}

	if event.Lang == "ua" {
		translation.UkrainianID = event.ID
		translation.EnglishID = *input.Translation
	}

	if err := app.models.Events.CreateTranslation(&translation); err != nil {
		app.logger.PrintInfo("failed to create translation", map[string]string{"error": err.Error()})
	}

	headers := make(http.Header)
	headers.Set("Location", fmt.Sprintf("/v1/events/%d", event.ID))

	err = app.writeJson(w, http.StatusCreated, envelope{"event": event}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) listEventsHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title string
		Lang  string
		data.Filters
	}

	v := validator.New()

	qs := r.URL.Query()

	input.Title = app.readString(qs, "title", "")
	input.Lang = app.readString(qs, "lang", "")

	input.Filters.Page = app.readInt(qs, "page", 1, v)
	input.Filters.PageSize = app.readInt(qs, "page_size", 10, v)

	input.Filters.Sort = app.readString(qs, "sort", "-created_at")
	input.Filters.SortSafelist = []string{"created_at", "-created_at", "occured_on", "-occured_on"}

	if data.ValidateFilters(v, input.Filters); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	events, metadata, err := app.models.Events.GetAll(input.Title, input.Lang, input.Filters)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"events": events, "metadata": metadata}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) deleteEventsHandler(w http.ResponseWriter, r *http.Request) {
	v := validator.New()

	qs := r.URL.Query()

	ids := app.readIntList(qs, "ids", v)

	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err := app.models.Events.DeleteMultiple(ids)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"message": "events successfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) showEventHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	event, err := app.models.Events.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	response := envelope{"event": event}
	translation, err := app.models.Events.GetTranslation(event.ID)
	if err == nil {
		response["translation"] = translation
	}

	err = app.writeJson(w, http.StatusOK, response, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) updateEventHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	event, err := app.models.Events.Get(id)
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
		event.Title = *input.Title
	}

	if input.Description != nil {
		event.Description = *input.Description
	}

	if input.Content != nil {
		event.Content = *input.Content
	}

	if input.Lang != nil {
		event.Lang = *input.Lang
	}

	if input.Cover != nil {
		event.Cover = *input.Cover
	}

	if input.OccuredOn != nil {
		event.OccuredOn = *input.OccuredOn
	}

	v := validator.New()

	if data.ValidateEvent(v, event); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Events.Update(event)
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
		if err := app.models.Events.DeleteTranslation(event.ID); err != nil {
			app.logger.PrintInfo("failed to delete translation", map[string]string{"error": err.Error()})
		}
	} else {
		translation, err := app.models.Events.GetTranslation(event.ID)
		if err != nil && errors.Is(err, data.ErrRecordNotFound) {
			translation := data.Translation{
				EnglishID:   event.ID,
				UkrainianID: *input.TranslationID,
			}

			if event.Lang == "ua" {
				translation.UkrainianID = event.ID
				translation.EnglishID = *input.TranslationID
			}

			err := app.models.Events.CreateTranslation(&translation)
			if err != nil {
				app.logger.PrintInfo("failed to create translation", map[string]string{"error": err.Error()})
			}

		} else if err == nil {
			if event.Lang == "ua" {
				translation.UkrainianID = event.ID
				translation.EnglishID = *input.TranslationID
			} else {
				translation.EnglishID = event.ID
				translation.UkrainianID = *input.TranslationID
			}

			if err := app.models.Events.UpdateTranslation(translation); err != nil {
				app.logger.PrintInfo("failed to update translation", map[string]string{"error": err.Error()})
			}
		}
	}

	err = app.writeJson(w, http.StatusCreated, envelope{"event": event}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
