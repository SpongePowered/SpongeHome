package controllers

import (
	"encoding/json"
	"gopkg.in/macaron.v1"
	"net/http"
	"os"
)

func GetHealth(ctx *macaron.Context) {
	paramMap := map[string]string{"BUILD_NUMBER": os.Getenv("BUILD_NUMBER"), "GIT_BRANCH": os.Getenv("GIT_BRANCH"), "GIT_COMMIT": os.Getenv("GIT_COMMIT"), "JOB_NAME": os.Getenv("JOB_NAME"), "BUILD_TAG": os.Getenv("BUILD_TAG"), "SPONGE_ENV": os.Getenv("SPONGE_ENV"), "SERVICE": "SpongeHome"}
	jsonMarshalled, _ := json.Marshal(paramMap)
	jsonStr := string(jsonMarshalled)
	print(jsonStr)
	//ctx.JSON(http.StatusOK, &jsonStr)
	ctx.JSON(http.StatusOK, &paramMap)
}
