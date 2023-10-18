package main

import (
	"fmt"
	"net/http"
)

func (app *application) serve() error {
	srv := http.Server{
		Addr:    fmt.Sprintf(":%d", app.config.Port),
		Handler: app.routes(),
	}

	app.logger.PrintInfo("starting server", map[string]string{
		"addr": srv.Addr,
		"env":  app.config.Env,
	})

	err := srv.ListenAndServe()
	if err != nil {
		return err
	}

	return nil
}
