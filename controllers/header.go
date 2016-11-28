/*
 * This file is part of SpongeHome, licensed under the MIT License (MIT).
 *
 * Copyright (c) SpongePowered <https://www.spongepowered.org>
 * Copyright (c) contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

package controllers

import (
	"github.com/SpongePowered/SpongeWebGo/cache"
	"github.com/SpongePowered/SpongeWebGo/fastly"
	"gopkg.in/macaron.v1"
	"net/http"
)

func AddHeaders(resp http.ResponseWriter) {
	header := resp.Header()

	// TODO: Needs more testing and a few changes to make it more restrictive
	/*header.Add("Content-Security-Policy", "default-src 'self' https:; "+
	"style-src 'self' 'unsafe-inline' https:; "+
	"script-src 'self' 'unsafe-eval' https://cdnjs.cloudflare.com https://www.google-analytics.com; "+
	"frame-ancestors 'none'")*/

	// Set cache headers only in production environment
	if macaron.Env == macaron.PROD {
		header.Add(cache.CacheControlHeader, cache.StaticContentOptions)

		// Fastly cache header
		header.Add(fastly.SurrogateControlHeader, cache.SurrogateStaticContentOptions)
	}
}
