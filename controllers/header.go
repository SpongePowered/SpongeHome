package controllers

import (
	"github.com/SpongePowered/SpongeWebGo/cache"
	"github.com/SpongePowered/SpongeWebGo/fastly"
	"net/http"
)

func AddHeaders(resp http.ResponseWriter) {
	header := resp.Header()

	// TODO: Needs more testing and a few changes to make it more restrictive
	/*header.Add("Content-Security-Policy", "default-src 'self' https:; "+
		"style-src 'self' 'unsafe-inline' https:; "+
		"script-src 'self' 'unsafe-eval' https://cdnjs.cloudflare.com https://www.google-analytics.com; "+
		"frame-ancestors 'none'")*/

	header.Add(cache.CacheControlHeader, cache.StaticContentOptions)

	// Fastly cache header
	header.Add(fastly.SurrogateControlHeader, cache.SurrogateStaticContentOptions)
}
