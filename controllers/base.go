package controllers

import (
    "net/http"
    "gopkg.in/macaron.v1"
)

var (
    Sponsors []Sponsor = []Sponsor{
        Sponsor{
            Name: "BeastNode",
            Image: "/assets/img/sponsors/beastnode.png",
            Link: "https://www.beastnode.com/",
        },
        Sponsor{
            Name: "Multiplay Game Servers",
            Image: "/assets/img/sponsors/multiplay.png",
            Link: "http://www.multiplaygameservers.com",
        },
        Sponsor{
            Name: "Enjin",
            Image: "/assets/img/sponsors/enjin.png",
            Link: "https://www.enjin.com/",
        },
        Sponsor{
            Name: "Nitrous Networks",
            Image: "/assets/img/sponsors/nitrous.png",
            Link: "https://www.nitrous-networks.com",
        },
        Sponsor{
            Name: "CreeperHost",
            Image: "/assets/img/sponsors/creeperhost.svg",
            Link: "https://billing.creeperhost.net/link.php?id=8",
        },
        Sponsor{
            Name: "MC Pro Hosting",
            Image: "/assets/img/sponsors/mcprohosting.png",
            Link: "https://mcprohosting.com/?promo=Sponge",
        },
    }
)

type Sponsor struct {
    Name string
    Image string
    Link string
}

func GetHomepage(ctx *macaron.Context) {
    ctx.Data["sponsors"] = Sponsors
    ctx.HTML(http.StatusOK, "index")
}

func GetSponsors(ctx *macaron.Context) {
    ctx.Data["sponsors"] = Sponsors
    ctx.HTML(http.StatusOK, "sponsors")
}

func GetChat(ctx *macaron.Context) {
    ctx.HTML(http.StatusOK, "chat")
}
