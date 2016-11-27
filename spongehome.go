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

package main // import "github.com/SpongePowered/SpongeHome"

import (
	"github.com/SpongePowered/SpongeHome/controllers"
	"github.com/SpongePowered/SpongeWebGo/fastly"
	"github.com/go-macaron/gzip"
	"github.com/go-macaron/pongo2"
	"gopkg.in/macaron.v1"
	"log"
	"os"
)

func main() {
	var c *fastly.Cache
	if fastlyConfig := os.Getenv("FASTLY_CACHE"); fastlyConfig != "" {
		var err error
		c, err = fastly.ParseConfig(log.New(os.Stdout, "[Fastly] ", log.LstdFlags), fastlyConfig)
		if err != nil {
			log.Fatalln(err)
		}
	}

	// Initialise Macaron
	m := macaron.New()

	if c != nil {
		// Hide Fastly health checks from log
		m.Use(c.LogHandler())
	} else {
		m.Use(macaron.Logger())
	}

	m.Use(macaron.Recovery())

	m.Use(pongo2.Pongoer())
	m.Use(gzip.Gziper())
	m.Use(macaron.Static("public"))

	m.Use(controllers.AddHeaders)

	// Routes
	m.Get("/", controllers.GetHomepage)
	m.Get("/sponsors", controllers.GetSponsors)
	m.Get("/chat", controllers.GetChat)
	m.Get("/announcements.json", controllers.GetAnnouncements)

	if statuszHandler := controllers.StatuszHandler(); statuszHandler != nil {
		m.Get("/statusz", statuszHandler)
	}

	m.Get("/downloads", controllers.GetDownloads)
	m.Get("/downloads/*", controllers.GetDownloads)

	if c != nil {
		// Attempt to purge fastly cache
		go c.PurgeAll()
	}

	// Run SpongeHome
	m.Run()
}
