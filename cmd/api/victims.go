package main

import (
	"log"
	"net/http"

	"github.com/lex-unix/babyn-yar/internal/data"
	"github.com/lex-unix/babyn-yar/internal/validator"
)

func (app *application) listVictimsHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Fullname string
		Info     string
		data.Filters
	}

	v := validator.New()

	qs := r.URL.Query()

	input.Fullname = app.readString(qs, "fullname", "")
	input.Info = app.readString(qs, "info", "")

	input.Filters.Page = app.readInt(qs, "page", 1, v)
	input.Filters.PageSize = app.readInt(qs, "pagesize", 100, v)

	if data.ValidateFilters(v, input.Filters); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	victims, metadata, err := app.models.Victims.GetAll(input.Fullname, input.Info, input.Filters)
	if err != nil {
		log.Println(err)
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"victims": victims, "metadata": metadata}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}
