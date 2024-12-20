package main

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/lex-unix/babyn-yar/internal/data"
	"github.com/lex-unix/babyn-yar/internal/validator"
)

func (app *application) createMediaArticleHandler(w http.ResponseWriter, r *http.Request) {
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

	article := &data.MediaArticle{
		Title:       input.Title,
		Description: input.Description,
		Content:     input.Content,
		Lang:        input.Lang,
		Cover:       input.Cover,
		OccuredOn:   input.OccuredOn,
		UserID:      user.ID,
	}

	v := validator.New()

	if data.ValidateMediaArticle(v, article); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.MediaArticles.Insert(article)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if input.Translation != nil {
		translation := data.Translation{
			EnglishID:   article.ID,
			UkrainianID: *input.Translation,
		}

		if article.Lang == "ua" {
			translation.UkrainianID = article.ID
			translation.EnglishID = *input.Translation
		}

		if err := app.models.MediaArticles.CreateTranslation(&translation); err != nil {
			app.logger.PrintInfo("failed to create translation", map[string]string{"error": err.Error()})
		}
	}

	headers := make(http.Header)
	headers.Set("Location", fmt.Sprintf("/v1/media-articles/%d", article.ID))

	err = app.writeJson(w, http.StatusCreated, envelope{"article": article}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) listMediaArticlesHandler(w http.ResponseWriter, r *http.Request) {
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

	articles, metadata, err := app.models.MediaArticles.GetAll(input.Title, input.Lang, input.Filters)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"articles": articles, "metadata": metadata}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) deleteMediaArticlesHandler(w http.ResponseWriter, r *http.Request) {
	v := validator.New()

	qs := r.URL.Query()

	ids := app.readIntList(qs, "ids", v)

	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err := app.models.MediaArticles.DeleteMultiple(ids)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"message": "articles successfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) showMediaArticleHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	article, err := app.models.MediaArticles.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	response := envelope{"article": article}
	translation, err := app.models.MediaArticles.GetTranslation(article.ID)
	if err == nil {
		response["translation"] = translation
	}

	err = app.writeJson(w, http.StatusOK, response, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) updateMediaArticleHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	article, err := app.models.MediaArticles.Get(id)
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
		article.Title = *input.Title
	}

	if input.Description != nil {
		article.Description = *input.Description
	}

	if input.Content != nil {
		article.Content = *input.Content
	}

	if input.Lang != nil {
		article.Lang = *input.Lang
	}

	if input.Cover != nil {
		article.Cover = *input.Cover
	}

	if input.OccuredOn != nil {
		article.OccuredOn = *input.OccuredOn
	}

	v := validator.New()

	if data.ValidateMediaArticle(v, article); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.MediaArticles.Update(article)
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
		if err := app.models.MediaArticles.DeleteTranslation(article.ID); err != nil {
			app.logger.PrintInfo("failed to delete translation", map[string]string{"error": err.Error()})
		}
	} else {
		translation, err := app.models.MediaArticles.GetTranslation(article.ID)
		if err != nil && errors.Is(err, data.ErrRecordNotFound) {
			translation := data.Translation{
				EnglishID:   article.ID,
				UkrainianID: *input.TranslationID,
			}

			if article.Lang == "ua" {
				translation.UkrainianID = article.ID
				translation.EnglishID = *input.TranslationID
			}

			err := app.models.MediaArticles.CreateTranslation(&translation)
			if err != nil {
				app.logger.PrintInfo("failed to create translation", map[string]string{"error": err.Error()})
			}

		} else if err == nil {
			if article.Lang == "ua" {
				translation.UkrainianID = article.ID
				translation.EnglishID = *input.TranslationID
			} else {
				translation.EnglishID = article.ID
				translation.UkrainianID = *input.TranslationID
			}

			if err := app.models.MediaArticles.UpdateTranslation(translation); err != nil {
				app.logger.PrintInfo("failed to update translation", map[string]string{"error": err.Error()})
			}
		}
	}

	err = app.writeJson(w, http.StatusOK, envelope{"article": article}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
