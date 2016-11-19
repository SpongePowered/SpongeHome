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

<template>
    <ol class="builds">
        <li v-for="build in builds" class="build" :id="build.version">
            <h4>{{ build.version }} <span v-for="label in build.labels" :class="['label', 'label-' + label.color]">{{ label.name }}</span></h4>

            <div class="artifacts">
                <a v-for="artifact in build.artifacts" :href="artifact.url" :title="artifact.type.title"
                   :class="['btn', btnClass, artifact.primary ? 'btn-primary' : 'btn-default']">
                    <i :class="['fa', artifact.type.icon]"></i> <span>{{ artifact.primary ? 'Download' : artifact.type.name }}</span></a>
            </div>

            <relative-time class="build-time" :t="build.published"></relative-time>

            <div class="changelog" v-if="!primary || build.changelog">
                <commits :project="platform" :l="build.changelog" v-if="build.changelog && build.changelog.length > 0"></commits>
                <div class="changelog-comment" v-else>
                    <span v-if="build.changelog">No changes.</span>
                    <span v-else>No changelog available.</span>
                </div>
            </div>
            <div class="clearfix"></div>
        </li>
    </ol>
</template>

<script>
    import RelativeTime from 'downloads/relative-time'
    import Commits from 'downloads/Commits.vue'

    export default {
        props: {
            platform: String,
            builds: Array,
            primary: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            btnClass() {
                return this.primary ? 'btn' : 'btn-sm'
            }
        },
        components: {
            'relative-time': RelativeTime,
            commits: Commits
        }
    }
</script>
