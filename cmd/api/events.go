package main

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/lex-unix/babyn-yar/internal/data"
	"github.com/lex-unix/babyn-yar/internal/validator"
)

func (app *application) createEventHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Content     string `json:"content"`
	}

	err := app.readJson(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	event := &data.Event{
		Title:       input.Title,
		Description: input.Description,
		Content:     input.Content,
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

	headers := make(http.Header)
	headers.Set("Location", fmt.Sprintf("/v1/events/%d", event.ID))

	err = app.writeJson(w, http.StatusCreated, envelope{"event": event}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) listEventsHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		data.Filters
	}

	v := validator.New()

	qs := r.URL.Query()

	input.Filters.Page = app.readInt(qs, "page", 1, v)
	input.Filters.PageSize = app.readInt(qs, "page_size", 10, v)

	if data.ValidateFilters(v, input.Filters); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	events, metadata, err := app.models.Events.GetAll(input.Filters)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"events": events, "metadata": metadata}, nil)
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

	err = app.writeJson(w, http.StatusOK, envelope{"event": event}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}