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
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/SpongePowered/SpongeWebGo/cache"
	"github.com/SpongePowered/SpongeWebGo/fastly"
	"gopkg.in/macaron.v1"
)

type Topic struct {
	ID        int    `json:"id"`
	Title     string `json:"title"`
	Slug      string `json:"slug"`
	Archetype string `json:"archetype"`
}

type TopicList struct {
	Topics []Topic `json:"topics"`
}

func (t *TopicList) GetRegularTopics() []Topic {
	var topics = []Topic{}

	for _, topic := range t.Topics {
		if topic.Archetype == "regular" {
			topics = append(topics, topic)
		}
	}

	return topics
}

type Category struct {
	TopicList TopicList `json:"topic_list"`
}

type Post struct {
	Cooked string `json:"cooked"`
}

type PostStream struct {
	Posts []Post `json:"posts"`
}

type TopicResponse struct {
	PostStream PostStream `json:"post_stream"`
}

type AnnouncementView struct {
	First  Announcement `json:"first"`
	Second Announcement `json:"second"`
}

type Announcement struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	URL     string `json:"url"`
}

func GetAnnouncements(ctx *macaron.Context, logger *log.Logger) {
	header := ctx.Header()

	// Override cache headers
	header.Add(cache.CacheControlHeader, cache.DynamicContentOptions)
	header.Add(fastly.SurrogateControlHeader, cache.SurrogateDynamicContentOptions)

	var res Category

	r, err := http.Get("https://forums.spongepowered.org/c/announcements.json?order=created")
	if err != nil {
		logger.Println("Failed to fetch announcements:", err)
		ctx.Error(http.StatusInternalServerError, "Can't access announcements!")
		return
	}

	err = json.NewDecoder(r.Body).Decode(&res)
	if err != nil {
		logger.Println("Failed to parse announcements:", err)
		ctx.Error(http.StatusInternalServerError, "Can't access announcements!")
		return
	}

	var topics = res.TopicList.GetRegularTopics()

	first, err := getAnnouncement(topics[0])
	if err != nil {
		logger.Println("Failed to parse the first topic:", err)
		ctx.Error(http.StatusInternalServerError, "Can't access the first topic!")
		return
	}

	second, err := getAnnouncement(topics[1])
	if err != nil {
		logger.Println("Failed to parse the second topic:", err)
		ctx.Error(http.StatusInternalServerError, "Can't access the second topic!")
		return
	}

	ctx.JSON(http.StatusOK, &AnnouncementView{
		First:  first,
		Second: second,
	})
}

func getAnnouncement(topic Topic) (Announcement, error) {
	var res TopicResponse

	r, err := http.Get("https://forums.spongepowered.org/t/" + strconv.Itoa(topic.ID) + ".json")
	if err != nil {
		return Announcement{}, err
	}

	err = json.NewDecoder(r.Body).Decode(&res)
	if err != nil {
		return Announcement{}, err
	}

	return Announcement{
		Title:   topic.Title,
		Content: res.PostStream.Posts[0].Cooked,
		URL:     "https://forums.spongepowered.org/t/" + topic.Slug,
	}, nil
}
