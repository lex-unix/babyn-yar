package main

import (
	"net/http"
)

func (app *application) healthcheckHandler(w http.ResponseWriter, r *http.Request) {
	env := envelope{
		"status": "available",
		"system_info": map[string]string{
			"environment": app.config.env,
			"version":     version,
		},
	}

	err := app.writeJson(w, http.StatusOK, env, nil)
	if err != nil {
		message := "the server encountered a problem and could not process your request"
		env := envelope{"error": message}

		err := app.writeJson(w, http.StatusInternalServerError, env, nil)
		if err != nil {
			w.WriteHeader(500)
		}
	}
}
