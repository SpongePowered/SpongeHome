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
            Size: "85%",
        },
        Sponsor{
            Name: "Multiplay Game Servers",
            Image: "/assets/img/sponsors/multiplay.png",
            Link: "http://www.multiplaygameservers.com",
            Size: "85%",
        },
        Sponsor{
            Name: "Enjin",
            Image: "/assets/img/sponsors/enjin.png",
            Link: "https://www.enjin.com/",
            Size: "70%",
        },
        Sponsor{
            Name: "Buycraft",
            Image: "/assets/img/sponsors/buycraft.png",
            Link: "https://www.buycraft.net",
            Size: "70%",
        },
        Sponsor{
            Name: "Nitrous Networks",
            Image: "/assets/img/sponsors/nitrous.png",
            Link: "https://www.nitrous-networks.com",
            Size: "100%",
        },
        Sponsor{
            Name: "CreeperHost",
            Image: "/assets/img/sponsors/creeperhost.svg",
            Link: "https://billing.creeperhost.net/link.php?id=8",
            Size: "100%",
        },
        Sponsor{
            Name: "MC Pro Hosting",
            Image: "/assets/img/sponsors/mcprohosting.png",
            Link: "https://mcprohosting.com/?promo=Sponge",
            Size: "100%",
        },
    }
)

type Sponsor struct {
    Name string
    Image string
    Link string
    Size string
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
