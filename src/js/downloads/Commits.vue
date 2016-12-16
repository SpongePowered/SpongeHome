<!--
    This file is part of SpongeHome, licensed under the MIT License (MIT).

    Copyright (c) SpongePowered <https://www.spongepowered.org>
    Copyright (c) contributors

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
-->

<!--suppress XmlUnboundNsPrefix -->
<template>
    <ol class="commits">
        <li class="commit" v-for="commit in commits">
            <a :href="'https://github.com/SpongePowered/' + project + '/commit/' + commit.id" target="_blank">{{ commit.title }}</a>
            <button class="ellipsis-expander" data-toggle="collapse-next" v-if="commit.description || commit.submodules">…</button>
            <div>{{ commit.author }} - <small><relative-time :t="commit.date"></relative-time></small></div>
            <div class="collapse" v-if="commit.description || commit.submodules">
                <pre class="commit-message" v-if="commit.description">{{ commit.description }}</pre>
                <div class="commit-submodules" v-if="commit.submodules">
                    <div v-for="(subcommits, submodule) in commit.submodules">
                        <!-- TODO: Submodule commits should be NEVER null -->
                        <template v-if="subcommits">
                            <h5>{{ submodule }}</h5>
                            <commits :project="submodule" :l="subcommits"></commits>
                        </template>
                    </div>
                </div>
            </div>
        </li>

        <li v-if="count < l.length" class="more-commits">
            <a v-on:click="count *= 2">Show {{ l.length - count }} older commits.</a>
        </li>
    </ol>
</template>

<script>
    import RelativeTime from 'downloads/relative-time'

    export default {
        name: 'commits',
        props: ['project', 'l'],
        data() {
            return {
                count: 5
            }
        },
        computed: {
            commits() {
                if (this.count >= this.l.length) {
                    return this.l
                } else {
                    return this.l.slice(0, this.count)
                }
            }
        },
        components: {
            'relative-time': RelativeTime
        }
    }
</script>
