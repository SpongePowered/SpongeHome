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

package apiv1

import (
    "strconv"
    "net/http"
    "encoding/json"
    "gopkg.in/macaron.v1"
)

type Topic struct {
    ID int `json:"id"`
    Title string `json:"title"`
    Slug string `json:"slug"`
    Archetype string `json:"archetype"`
}

type TopicList struct {
    Topics []Topic `json:"topics"`
}

func (t *TopicList) GetRegularTopics() []Topic {
    var topics []Topic = []Topic{}

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

type Announcement struct {
    Title string `json:"title"`
    Content string `json:"content"`
    Link string `json:"link"`
}

func GetAnnouncements(ctx *macaron.Context) {
    var res Category

    r, err := http.Get("https://forums.spongepowered.org/c/announcements.json?order=created")
    if err != nil {
        ctx.Error(http.StatusInternalServerError, "Can't access announcements!")
        return
    }

    err = json.NewDecoder(r.Body).Decode(&res)
    if err != nil {
        ctx.Error(http.StatusInternalServerError, "Can't access announcements!")
        return
    }

    var topics []Topic = res.TopicList.GetRegularTopics()

    announcements, err := getAnnouncements(topics)
    if err != nil {
        ctx.Error(http.StatusInternalServerError, "Failed to get announcements!")
        return
    }

    ctx.JSON(http.StatusOK, announcements)
}

func GetAnnouncement(ctx *macaron.Context) {
    var res Category

    r, err := http.Get("https://forums.spongepowered.org/c/announcements.json?order=created")
    if err != nil {
        ctx.Error(http.StatusInternalServerError, "Can't access announcements!")
        return
    }

    err = json.NewDecoder(r.Body).Decode(&res)
    if err != nil {
        ctx.Error(http.StatusInternalServerError, "Can't access announcements!")
        return
    }

    var topics []Topic = res.TopicList.GetRegularTopics()

    topicId, err := strconv.ParseInt(ctx.Params(":topic"), 2, 64)
    if err != nil {
        ctx.Error(http.StatusInternalServerError, "Failed to get announcement id!")
        return
    }

    announcement, err := getAnnouncement(topics[topicId])
    if err != nil {
        ctx.Error(http.StatusInternalServerError, "Failed to get announcement!")
        return
    }

    ctx.JSON(http.StatusOK, announcement)
}

func getAnnouncements(topics []Topic) ([]Announcement, error) {
    var announcements []Announcement = []Announcement{}

    for _, topic := range topics {
        announcement, err := getAnnouncement(topic)
        if err != nil {
            return nil, err
        } else {
            announcements = append(announcements, announcement)
        }
    }

    return announcements, nil
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
        Title: topic.Title,
        Content: res.PostStream.Posts[0].Cooked,
        Link: "https://forums.spongepowered.org/t/" + topic.Slug,
    }, nil
}
