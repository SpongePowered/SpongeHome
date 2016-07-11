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
)

func main() {
	// Initialise Macaron
	m := macaron.Classic()
	m.Use(pongo2.Pongoer())

	// Routes
	m.Get("/", controllers.GetHomepage)
	m.Get("/sponsors", controllers.GetSponsors)
	m.Get("/chat", controllers.GetChat)
	//m.Get("/health", controllers.GetHealth)
	m.Get("/announcements.json", controllers.GetAnnouncements)

	//clear fastly
	if os.Getenv("FASTLY_KEY") != "" {
		fmt.Println("starting fastly client")
		client, err := fastly.NewClient(os.Getenv("FASTLY_KEY"))
		if err != nil {
			fmt.Println(err)
		}
		services, err := client.ListServices(&fastly.ListServicesInput{})
		for _, svc := range services {
			if svc.Name == os.Getenv("FASTLY_SERVICE_NAME") {
				_, err := client.PurgeAll(&fastly.PurgeAllInput{
					Service: svc.ID,
					Soft:    false})
				if err != nil {
					fmt.Println("fastly cache purge failed")
					fmt.Println(err)
				}

			}
			//fmt.Printf("%+v\n", svc)
		}
		fmt.Println("fastly done")
	}
	// Run SpongeHome
	m.Run()

}
