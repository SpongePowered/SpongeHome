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

import "gopkg.in/macaron.v1"

var (
	Sponsors = []Sponsor{
		{
			Name:  "MC Pro Hosting",
			Image: "/assets/img/sponsors/mcprohosting.png",
			Link:  "https://mcprohosting.com/?promo=Sponge",
		},
		{
			Name:  "CreeperHost",
			Image: "/assets/img/sponsors/creeperhost.svg",
			Link:  "https://billing.creeperhost.net/link.php?id=8",
		},
		{
			Name:  "Enjin",
			Image: "/assets/img/sponsors/enjin.png",
			Link:  "https://www.enjin.com/",
		},
        {
			Name:  "Apex Hosting",
			Image: "/assets/img/sponsors/apexhosting.png",
			Link:  "https://apexminecrafthosting.com/",
		},
		{
			Name:  "BeastNode",
			Image: "/assets/img/sponsors/beastnode.png",
			Link:  "https://www.beastnode.com/",
		},
	}
)

type Sponsor struct {
	Name  string
	Image string
	Link  string
}

func GetHomepage(ctx *macaron.Context) {
	ctx.Data["sponsors"] = Sponsors
	html(ctx, "index", "index", "Sponge - Minecraft Modding API")
}

func GetSponsors(ctx *macaron.Context) {
	ctx.Data["sponsors"] = Sponsors
	html(ctx, "sponsors", "sponsors", "Sponge - Sponsoring")
}

func GetChat(ctx *macaron.Context) {
	html(ctx, "chat", "chat", "Sponge - Chat")
}
