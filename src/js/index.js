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

function addAnnouncement(announcement) {
    var article = $('<article>').trunk8({
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

$.getJSON('/announcements.json', function(data) {
    $('#announcements').empty();
    addAnnouncement(data.first);
    addAnnouncement(data.second);
});
