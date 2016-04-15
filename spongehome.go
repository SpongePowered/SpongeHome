package main

import (
    "github.com/SpongePowered/SpongeHome/controllers"
    "github.com/go-macaron/pongo2"
    "gopkg.in/macaron.v1"
)

func main() {
    // Initialise Macaron
    m := macaron.Classic()
    m.Use(pongo2.Pongoer())

    // Routes
    m.Get("/", controllers.GetHomepage)
    m.Get("/sponsors", controllers.GetSponsors)
    m.Get("/chat", controllers.GetChat)

    m.Get("/announcements.json", controllers.GetAnnouncements)

    // Run SpongeHome
    m.Run()
}
