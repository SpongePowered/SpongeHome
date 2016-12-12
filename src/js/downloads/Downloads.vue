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
    <div>
    <header>
        <div class="container">
            <div class="row">
                <div class="col-lg-5 col-md-6">
                    <div class="logo">
                        <img src="/assets/img/icons/spongie-mark-reverse-dark.svg" />
                        <h1>Sponge<span :class="['platform-badge', platform.id]">{{ platform.suffix }}</span></h1>
                    </div>
                    <h2>Downloads</h2>
                </div>
                <div class="col-md-3 col-sm-6 download-category" v-if="platform.buildTypes">
                    <h3>Build type</h3>
                    <ul id="build-types">
                        <li v-for="type in platform.buildTypes">
                            <router-link :to="routeForBuildType(type)"
                                         :class="['label', 'label-' + type.color]"><span>{{ type.name }}</span></router-link>
                        </li>
                    </ul>
                </div>
                <div class="col-lg-4 col-md-3 col-sm-6 download-category" v-if="platform.category.versions">
                    <h3>{{ platform.category.name }} version</h3>
                    <div class="btn-group">
                        <router-link v-for="version of platform.category.versions.current"
                                     :to="routeForCategory(version)"
                                     class="btn btn-primary">{{ version }}</router-link>
                        <a aria-expanded="false" href="#" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
                        <ul class="dropdown-menu dropdown-menu-right">
                            <li v-for="version of platform.category.versions.unsupported">
                                <router-link :to="routeForCategory(version)">{{ version }}</router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <section id="builds" v-if="builds">
        <div id="recommended-build" v-if="recommended">
            <div class="container">
                <div class="row">
                    <h3>{{ recommended.label.title }}</h3>
                    <builds :platform="platform.name" :builds="[recommended]" primary></builds>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row" id="all-builds" v-if="builds.length > 0">
                <h3>All builds</h3>
                <builds :platform="platform.name" :builds="builds"></builds>
            </div>

            <div class="container" id="no-builds" v-else-if="!recommended">
                <p><strong>Oh no!</strong> Unfortunately, there are no builds available for the current selection.</p>
                <h4>Possible solutions:</h4>
                <p><ul>
                <li v-for="type in getAlternativeBuildTypes()">
                    <router-link :to="adaptRouteForBuildType(type)"
                    >Search for <span :class="['label', 'label-' + type.color]">{{ type.name }}</span> builds.</router-link>
                </li>
                <li v-if="$route.query.until"><router-link :to="{query: {since: $route.query.until}}"
                >Search for newer builds.</router-link></li>
                <li v-if="$route.query.since"><router-link :to="{query: {until: $route.query.since}}"
                >Search for older builds.</router-link></li>
                </ul></p>
            </div>

            <div class="row navigation" v-if="builds.length > 0">
                <router-link v-if="$route.query.until || $route.query.since"
                             :to="{query: {since: builds[0].published}}" class="btn btn-sm btn-default newer">
                    <i class="fa fa-chevron-left"></i> Newer</router-link>
                <router-link v-if="builds.length >= 9"
                        :to="{query: {until: builds[builds.length-1].published}}" class="btn btn-sm btn-default older"
                >Older <i class="fa fa-chevron-right"></i></router-link>
            </div>
        </div>
    </section>

    <section id="download-loader" v-if="loading">
        <div class="container">
            <h1>Loading builds...</h1>
            <p>Spongie is loading them as fast as possible!</p>
            <img src="/assets/img/icons/spongie-mascot.png" alt="Spongie" />
        </div>
    </section>
    </div>
</template>

<script>
    import 'core-js/fn/set';
    import 'core-js/fn/array/from';
    import 'core-js/fn/array/find';
    import 'core-js/fn/array/includes';

    import {API, Platforms, BuildTypes, Labels} from 'downloads/platforms'
    import Builds from 'downloads/Builds.vue'

    export default {
        name: 'downloads',
        data() {
            // Required to initialize properties properly
            return {
                loading: false,
                loadingRecommended: false,
                platform: null,
                builds: null,
                recommended: null
            }
        },
        created() {
            this.updateData()
        },
        watch: {
            $route: 'updateData'
        },
        methods: {
            updateData() {
                this.platform = Platforms[this.$route.params.project];

                // Redirect to default build type and category if not explicitly specified
                if (this.redirectToDefaultVersion()) {
                    return
                }

                this.builds = null;
                this.recommended = null;
                this.loading = true;
                this.loadingRecommended = false;

                if (this.platform.loaded) {
                    this.fetchBuilds()
                } else {
                    this.fetchPlatform()
                }
            },
            fetchPlatform() {
                this.$http.get(`${API}/v1/${this.platform.group}/${this.platform.id}`).then(response => {
                    const project = response.body;

                    const buildTypes = [], buildTypesData = {};

                    const currentCategoryVersions = new Set(this.platform.category.forProject(project));
                    const unsupportedCategoryVersions = new Set(currentCategoryVersions);

                    for (const type of BuildTypes) {
                        if (!type.id in project.buildTypes) {
                            continue
                        }

                        buildTypes.push(type);

                        const data = project.buildTypes[type.id];
                        const buildTypeData = {
                            type: type,
                        };

                        if (data.recommended) {
                            buildTypeData.recommended = {}
                        }

                        buildTypesData[type.id] = buildTypeData;

                        const category = this.platform.category.forBuild(data.latest);
                        if (category) {
                            buildTypeData.categoryVersion = category;
                            unsupportedCategoryVersions.delete(category);
                        }
                    }

                    const unsupportedCategoryVersionsArray = Array.from(unsupportedCategoryVersions);

                    for (const version of unsupportedCategoryVersionsArray) {
                        currentCategoryVersions.delete(version)
                    }

                    this.platform.buildTypes = buildTypes;

                    // Vue does not support iterating over sets currently, https://github.com/vuejs/vue/issues/2410
                    this.platform.category.versions = {
                        current: Array.from(currentCategoryVersions),
                        unsupported: unsupportedCategoryVersionsArray
                    };

                    this.platform.buildTypesData = buildTypesData;
                    this.platform.loaded = true;

                    if (!this.redirectToDefaultVersion()) {
                        this.fetchBuilds()
                    }
                }, response => console.log("ERROR"))
            },
            fetchBuilds() {
                const params = {
                    type: this.$route.params.buildType,
                };

                params[this.platform.category.id] = this.$route.params.category;

                const buildTypeData = this.platform.buildTypesData[this.$route.params.buildType];

                // Load recommended build (if necessary)
                const showRecommended = !this.$route.query.until && !this.$route.query.since;
                if (showRecommended && buildTypeData.recommended) {
                    const recommendedBuild = buildTypeData.recommended[this.$route.params.category];

                    if (recommendedBuild == null) {
                        this.loadingRecommended = true;
                        this.$http.get(`${API}/v1/${this.platform.group}/${this.platform.id}/downloads/recommended`,{params: params}).then(response => {
                            const recommendedBuild = response.body;

                            recommendedBuild.label = Labels.recommended;
                            recommendedBuild.labels = [buildTypeData.type, Labels.recommended];
                            this.readArtifacts(recommendedBuild);

                            buildTypeData.recommended[this.$route.params.category] = recommendedBuild;
                            this.recommended = recommendedBuild;
                            this.loadingRecommended = false;
                        }, response => {
                            if (response.status == 404) {
                                // No recommended build available
                                buildTypeData.recommended[this.$route.params.category] = false;
                                this.loadingRecommended = false;
                                this.markLatestBuild(this.builds)
                            }

                            console.log("ERROR")
                        })
                    } else if (recommendedBuild) {
                        this.recommended = recommendedBuild
                    }
                }

                params.changelog = true;
                params.until = this.$route.query.until;
                params.since = this.$route.query.since;

                this.$http.get(`${API}/v1/${this.platform.group}/${this.platform.id}/downloads`, {params: params}).then(response => {
                    const unsupported = this.platform.category.versions.unsupported.includes(this.$route.params.category)
                            && Labels.unsupported;

                    const builds = response.body;
                    for (const build of builds) {
                        build.labels = [buildTypeData.type];

                        if (unsupported) {
                            build.labels.push(unsupported)
                        } else if (build.label) {
                            if (build.label in Labels) {
                                build.labels.push(Labels[build.label])
                            } else {
                                console.log(`Unknown label: ${build.label}`)
                            }
                        }

                        this.platform.addLabels && this.platform.addLabels(build);
                        this.readArtifacts(build)
                    }

                    if (showRecommended) {
                        this.markLatestBuild(builds)
                    }

                    this.loading = false;
                    this.builds = builds
                }, response => console.log("ERROR"))
            },
            readArtifacts(build) {
                const artifacts = [];

                let first = true;
                for (const type of this.platform.artifactTypes) {
                    if (type.classifier in build.artifacts) {
                        const artifact = build.artifacts[type.classifier];
                        artifact.type = type;
                        artifact.primary = first;
                        artifacts.push(artifact)
                    }

                    first = false
                }

                build.artifacts = artifacts
            },
            markLatestBuild(builds) {
                if (this.loadingRecommended || this.recommended || !builds || builds.length == 0) {
                    return
                }

                if (builds[0].label) {
                    // Don't mark builds with a label
                    return
                }

                const latestBuild = builds.shift();

                latestBuild.label = Labels.latest;
                latestBuild.labels.push(Labels.latest);

                this.recommended = latestBuild;
            },
            routeForBuildType(buildType) {
                return {name: 'downloads-build-type', params: {
                    project: this.platform.id,
                    buildType: buildType.id
                }}
            },
            adaptRouteForBuildType(buildType) {
                return {name: 'downloads', params: {
                    project: this.platform.id,
                    buildType: buildType.id,
                    category: this.$route.params.category
                }, query: this.$route.query}
            },
            routeForCategory(category) {
                return {name: 'downloads', params: {
                    project: this.platform.id,
                    buildType: this.$route.params.buildType,
                    category: category
                }}
            },
            redirectToDefaultVersion() {
                if (this.platform.loaded && (!this.$route.params.buildType || !this.$route.params.category)) {
                    const buildType = this.$route.params.buildType || this.platform.buildTypes[0].id;
                    this.$router.replace({name: 'downloads', params: {
                        project: this.platform.id,
                        buildType: buildType,
                        category: this.$route.params.category || this.platform.buildTypesData[buildType].categoryVersion
                    }});
                    return true
                } else {
                    return false
                }
            },
            getAlternativeBuildTypes() {
                return this.platform.buildTypes.filter(type => type.id != this.$route.params.buildType);
            }
        },
        components: {
            builds: Builds
        }
    }
</script>
