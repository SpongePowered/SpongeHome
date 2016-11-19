package controllers

import (
	"gopkg.in/macaron.v1"
	"os"
)

var downloadsAPIURL string

func init() {
	downloadsAPIURL = os.Getenv("DOWNLOADS_API_URL")
	if downloadsAPIURL == "" {
		downloadsAPIURL = "https://dl-api.spongepowered.org"
	}
}

func GetDownloads(ctx *macaron.Context) {
	ctx.Data["downloads_api_url"] = downloadsAPIURL
	html(ctx, "downloads", "downloads", "Sponge Downloads")
}
