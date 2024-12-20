package main

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/lex-unix/babyn-yar/internal/data"
	"github.com/lex-unix/babyn-yar/internal/validator"
)

func (app *application) createPartnerHandler(w http.ResponseWriter, r *http.Request) {
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

	partner := &data.Partner{
		Title:       input.Title,
		Description: input.Description,
		Content:     input.Content,
		Lang:        input.Lang,
		Cover:       input.Cover,
		OccuredOn:   input.OccuredOn,
		UserID:      user.ID,
	}

	v := validator.New()

	if data.ValidatePartner(v, partner); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Partners.Insert(partner)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if input.Translation != nil {
		translation := data.Translation{
			EnglishID:   partner.ID,
			UkrainianID: *input.Translation,
		}

		if partner.Lang == "ua" {
			translation.UkrainianID = partner.ID
			translation.EnglishID = *input.Translation
		}

		if err := app.models.Partners.CreateTranslation(&translation); err != nil {
			app.logger.PrintInfo("failed to create translation", map[string]string{"error": err.Error()})
		}
	}

	headers := make(http.Header)
	headers.Set("Location", fmt.Sprintf("/v1/partners/%d", partner.ID))

	err = app.writeJson(w, http.StatusCreated, envelope{"partner": partner}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) listPartnersHandler(w http.ResponseWriter, r *http.Request) {
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

	partners, metadata, err := app.models.Partners.GetAll(input.Title, input.Lang, input.Filters)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"partners": partners, "metadata": metadata}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) deletePartnersHandler(w http.ResponseWriter, r *http.Request) {
	v := validator.New()

	qs := r.URL.Query()

	ids := app.readIntList(qs, "ids", v)

	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err := app.models.Partners.DeleteMultiple(ids)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"message": "partners successfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) showPartnerHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	partner, err := app.models.Partners.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	response := envelope{"partner": partner}
	translation, err := app.models.Partners.GetTranslation(partner.ID)
	if err == nil {
		response["translation"] = translation
	}

	err = app.writeJson(w, http.StatusOK, response, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) updatePartnerHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	partner, err := app.models.Partners.Get(id)
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
		partner.Title = *input.Title
	}

	if input.Description != nil {
		partner.Description = *input.Description
	}

	if input.Content != nil {
		partner.Content = *input.Content
	}

	if input.Lang != nil {
		partner.Lang = *input.Lang
	}

	if input.Cover != nil {
		partner.Cover = *input.Cover
	}

	if input.OccuredOn != nil {
		partner.OccuredOn = *input.OccuredOn
	}

	v := validator.New()

	if data.ValidatePartner(v, partner); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Partners.Update(partner)
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
		if err := app.models.Partners.DeleteTranslation(partner.ID); err != nil {
			app.logError(r, err)
		}
	} else {
		translation, err := app.models.Partners.GetTranslation(partner.ID)
		if err != nil && errors.Is(err, data.ErrRecordNotFound) {
			translation := data.Translation{
				EnglishID:   partner.ID,
				UkrainianID: *input.TranslationID,
			}

			if partner.Lang == "ua" {
				translation.UkrainianID = partner.ID
				translation.EnglishID = *input.TranslationID
			}

			err := app.models.Partners.CreateTranslation(&translation)
			if err != nil {
				app.logError(r, err)
			}

		} else if err == nil {
			if partner.Lang == "ua" {
				translation.UkrainianID = partner.ID
				translation.EnglishID = *input.TranslationID
			} else {
				translation.EnglishID = partner.ID
				translation.UkrainianID = *input.TranslationID
			}

			if err := app.models.Partners.UpdateTranslation(translation); err != nil {
				app.logError(r, err)
			}
		}
	}

	err = app.writeJson(w, http.StatusOK, envelope{"partner": partner}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
