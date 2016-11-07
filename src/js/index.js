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

import Announcement from 'Announcement.vue'
import Platforms from 'downloads/Platforms.vue'
import {Platforms as PlatformData} from 'downloads/platforms'

// Dummy router-link for index page, uses vue-router on downloads page
Vue.component('router-link', {
    props: {
        to: Object,
        tag: {
            type: String,
            default: 'a'
        }
    },
    render(create) {
        return create(this.tag, {attrs:{href: PlatformData[this.to.params.project].url}}, this.$slots.default)
    }
});

new Vue({
    el: '#content',
    data: {
        announcements: null
    },
    created() {
        this.$http.get('/announcements.json').then(response => {
            this.announcements = response.body
        }, () => {
            console.log("Failed to load announcements"); // TODO
        });
    },
    components: {
        announcement: Announcement,
        platforms: Platforms
    }
});
