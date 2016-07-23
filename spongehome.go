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

package main

import (
	"fmt"
	"github.com/SpongePowered/SpongeHome/controllers"
	"github.com/go-macaron/pongo2"
	"github.com/sethvargo/go-fastly"
	"gopkg.in/macaron.v1"
	"os"
	"time"
)

func clearFastly() {
	// Clear Fastly cache
	if os.Getenv("FASTLY_KEY") != "" {
		time.Sleep(10 * time.Second) // Let the http server startup
		fmt.Println("starting fastly client")
		client, err := fastly.NewClient(os.Getenv("FASTLY_KEY"))
		if err != nil {
			fmt.Println(err)
			return
		}
		services, err := client.ListServices(&fastly.ListServicesInput{})
		fastlyService := ""
		if os.Getenv("SPONGE_ENV") == "prod" {
			fastlyService = "www.spongepowered.org"
		} else if os.Getenv("SPONGE_ENV") == "staging" {
			fastlyService = "www-staging.spongepowered.org"
		} else if os.Getenv("SPONGE_ENV") == "" {
			fmt.Println("SPONGE_ENV is not set")
			return
		}
		for _, svc := range services {
			if svc.Name == fastlyService {
				_, err := client.PurgeAll(&fastly.PurgeAllInput{
					Service: svc.ID,
					Soft:    false,
				})
				if err != nil {
					fmt.Println("fastly cache purge failed")
					fmt.Println(err)
					return
				} else {
					fmt.Println("found match and purged")
				}
			}
		}
		fmt.Println("Finished clearing Fastly cache")
	}
}

func main() {
	// Initialise Macaron
	m := macaron.Classic()
	m.Use(pongo2.Pongoer())

	// Routes
	m.Get("/", controllers.GetHomepage)
	m.Get("/sponsors", controllers.GetSponsors)
	m.Get("/chat", controllers.GetChat)
	m.Get("/statusz", controllers.GetStatusz)
	m.Get("/announcements.json", controllers.GetAnnouncements)

	go clearFastly()

	// Run SpongeHome
	m.Run()

}
