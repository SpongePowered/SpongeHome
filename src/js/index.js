function addAnnouncement(announcement) {
    const article = $('<article>').trunk8({
        lines: 16,
        tooltip: false
    });

    $('#announcements').append(
        $('<div>').addClass('col-lg-6').append(
            $('<h3>').addClass('title').text(announcement.title)
        ).append(article).append(
            $('<h4>').addClass('continue-reading').append(
                $('<a>').attr('ref', '_blank').attr('href', announcement.url).text('Continue Reading')
            )
        )
    );

    article.trunk8('update', announcement.content);
}

const forumsBase = <%= config %>;
const announcements = [];

$.getJSON(forumsBase + '/c/announcements.json?order=created', function (data) {
    const topics = data.topic_list.topics
        .filter((t) => t.archetype === 'regular')
        .splice(undefined, 2)

    Promise.all(
        topics.map((t) => {
            return $.getJSON(forumsBase + '/t/' + t.id + '.json', function (topic) {
                announcements.push({
                    created_at: topic.created_at,
                    title: topic.title,
                    content: topic.post_stream.posts[0].cooked,
                    url: forumsBase + '/t/' + topic.slug,
                })
            })
        })
    ).then(() => {
        if (announcements.length > 0) {
            $('#announcements').empty();
            announcements.forEach(a => {
                addAnnouncement(a);
            })
        }
    })
})
