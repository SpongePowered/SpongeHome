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

import {Platforms} from 'downloads/platforms'

import Main from 'downloads/Main.vue'
import Downloads from 'downloads/Downloads.vue'

const routes = [
    {
        name: 'main',
        path: '/downloads',
        component: Main
    },
    {
        name: 'downloads-project',
        path: '/downloads/:project',
        component: Downloads
    },
    {
        name: 'downloads-build-type',
        path: '/downloads/:project/:buildType',
        component: Downloads
    },
    {
        name: 'downloads',
        path: '/downloads/:project/:buildType/:category',
        component: Downloads
    }
];

const router = new VueRouter({
    mode: 'history',
    routes: routes,
    linkActiveClass: 'current',
    scrollBehavior() {
        return {x: 0, y: 0}
    }
});

router.afterEach(to => {
    const suffix = to.params.project ? Platforms[to.params.project].suffix : "";
    document.title = `Sponge${suffix} Downloads`
});

new Vue({
    el: '#content',
    router: router,
    data: {
        loadingVue: false,
        platforms: Platforms
    }
});

// Based on: http://stackoverflow.com/a/12809794
$('body').on('click.collapse-next.data-api', '[data-toggle=collapse-next]', function() {
    const $target = $(this).parent().children('.collapse');
    $target.data('bs.collapse') ? $target.collapse('toggle') : $target.collapse()
});
