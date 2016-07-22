package controllers

import (
	"encoding/json"
	"gopkg.in/macaron.v1"
	"net/http"
	"os"
)

func GetStatusz(ctx *macaron.Context) {
	ctx.JSON(http.StatusOK, map[string]string{
		"BUILD_NUMBER": os.Getenv("BUILD_NUMBER"),
		"GIT_BRANCH":   os.Getenv("GIT_BRANCH"),
		"GIT_COMMIT":   os.Getenv("GIT_COMMIT"),
		"JOB_NAME":     os.Getenv("JOB_NAME"),
		"BUILD_TAG":    os.Getenv("BUILD_TAG"),
		"SPONGE_ENV":   os.Getenv("SPONGE_ENV"),
		"SERVICE":      "SpongeHome",
	})
}
