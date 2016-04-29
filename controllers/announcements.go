package controllers

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

type AnnouncementView struct {
    First Announcement `json:"first"`
    Second Announcement `json:"second"`
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

    first, err := getAnnouncement(topics[0])
    if err != nil {
        ctx.Error(http.StatusInternalServerError, "Can't access the first topic!")
        return
    }

    second, err := getAnnouncement(topics[1])
    if err != nil {
        ctx.Error(http.StatusInternalServerError, "Can't access the second topic!")
        return
    }

    ctx.JSON(http.StatusOK, &AnnouncementView{
        First: first,
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
        Title: topic.Title,
        Content: res.PostStream.Posts[0].Cooked,
        Link: "https://forums.spongepowered.org/t/" + topic.Slug,
    }, nil
}
