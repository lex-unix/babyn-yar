package main

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/lex-unix/babyn-yar/internal/data"
	"github.com/lex-unix/babyn-yar/internal/validator"
)

func (app *application) createTestimonyHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title       string   `json:"title"`
		Description string   `json:"description"`
		Content     string   `json:"content"`
		Cover       string   `json:"cover"`
		Lang        string   `json:"lang"`
		Documents   []string `json:"documents"`
	}

	err := app.readJson(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := app.contextGetUser(r)

	testimony := &data.VictimTestimony{
		Title:       input.Title,
		Description: input.Description,
		Content:     input.Content,
		Cover:       input.Cover,
		Lang:        input.Lang,
		Documents:   []string{},
		UserID:      user.ID,
	}

	if len(input.Documents) != 0 {
		testimony.Documents = input.Documents
	}

	v := validator.New()

	if data.ValidateTestimony(v, testimony); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Testimonies.Insert(testimony)

	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	headers := make(http.Header)
	headers.Set("Location", fmt.Sprintf("/v1/victim-testimonies/%d", testimony.ID))

	err = app.writeJson(w, http.StatusCreated, envelope{"testimony": testimony}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}

func (app *application) listTestimoniesHandler(w http.ResponseWriter, r *http.Request) {
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
	input.Filters.SortSafelist = []string{"created_at", "-created_at"}

	if data.ValidateFilters(v, input.Filters); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	testimonies, metadata, err := app.models.Testimonies.GetAll(input.Lang, input.Filters)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"testimonies": testimonies, "metadata": metadata}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) showTestimonyHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	testimony, err := app.models.Testimonies.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"testimony": testimony}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}
