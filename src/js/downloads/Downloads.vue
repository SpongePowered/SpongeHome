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
                <div class="col-md-6 col-sm-8">
                    <div class="logo">
                        <img src="assets/img/icons/spongie-mark-reverse-dark.svg" alt="">
                        <h1>Sponge<span :class="['platform-badge', platform.id]">{{ platform.suffix }}</span></h1>
                    </div>
                    <h2>Downloads</h2>
                </div>
                <div class="col-md-6 col-sm-4 download-category" v-if="platform.category.versions">
                    <h3>{{ platform.category.name }} version</h3>
                    <div class="btn-group">
                        <router-link v-for="version of platform.category.versions.current" :key="version"
                                     :to="routeForCategory(version)"
                                     class="btn btn-primary">{{ version }}</router-link>
                        <template v-if="platform.category.versions.unsupported.length > 0">
                            <a aria-expanded="false" href="#" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
                            <ul class="dropdown-menu dropdown-menu-right">
                                <li v-for="version of platform.category.versions.unsupported">
                                    <router-link :to="routeForCategory(version)">{{ version }}</router-link>
                                </li>
                            </ul>
                        </template>
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
            <img src="assets/img/icons/spongie-mascot.png" alt="Spongie">
        </div>
    </section>
    </div>
</template>

<script>
    import 'core-js/fn/array/includes';

    import {API, Platforms, BuildTypes, Labels} from 'downloads/platforms'
    import Builds from 'downloads/Builds.vue'
    import VersionComparator from 'downloads/version-comparator'

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

                    const categories = {};

                    const categoryVersions = [];
                    const allCategoryVersions = this.platform.category.forProject(project);

                    for (const branchName of Object.keys(project.branches)) {
                        const data = project.branches[branchName];

                        const category = this.platform.category.forBuild(data.latest);
                        if (!category) {
                            console.error(`Cannot locate category version for branch '${branchName}'`);
                            continue;
                        }

                        let categoryData = categories[category];
                        if (!categoryData) {
                            categoryData = {};
                            categories[category] = categoryData;
                            categoryVersions.push(category);
                        }

                        if (BuildTypes[data.buildType] === BuildTypes.stable) {
                            categoryData.stable = true;
                        }

                        if (data.recommended) {
                            if (categoryData.recommended) {
                                console.error(`Multiple branches with recommended build for category ${category}`)
                            } else {
                                categoryData.recommended = data.recommended;
                            }
                        }
                    }

                    this.platform.categories = categories;

                    this.platform.category.versions = {
                        current: categoryVersions.sort(VersionComparator),
                        unsupported: allCategoryVersions.filter(version => !categories[version])
                    };

                    // Find latest stable category
                    let stableCategory;
                    for (let i = categoryVersions.length - 1; i >= 0; --i) {
                        if (categories[categoryVersions[i]].stable) {
                            stableCategory = categoryVersions[i];
                            break;
                        }
                    }

                    this.platform.defaultCategory = stableCategory || categoryVersions[categoryVersions.length - 1];
                    this.platform.loaded = true;

                    if (!this.redirectToDefaultVersion()) {
                        this.fetchBuilds()
                    }
                }, response => console.error("Failed to fetch platform info"))
            },
            fetchBuilds() {
                const params = {
                    [this.platform.category.id]: this.$route.params.category,
                };

                const categoryData = this.platform.categories[this.$route.params.category];

                // Load recommended build (if necessary)
                const showRecommended = categoryData && !this.$route.query.until && !this.$route.query.since;
                if (showRecommended && categoryData.recommended) {
                    if (!categoryData.recommended.build) {
                        this.loadingRecommended = true;
                        this.$http.get(`${API}/v1/${this.platform.group}/${this.platform.id}/downloads/${categoryData.recommended.version}`).then(response => {
                            const recommendedBuild = response.body;

                            recommendedBuild.label = Labels.recommended;
                            recommendedBuild.labels = [BuildTypes[recommendedBuild.type], Labels.recommended];
                            this.readArtifacts(recommendedBuild);

                            categoryData.recommended.build = recommendedBuild;
                            this.recommended = recommendedBuild;
                            this.loadingRecommended = false;
                        }, response => console.error("Failed to load recommended build"))
                    } else {
                        this.recommended = categoryData.recommended.build
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
                        build.labels = [BuildTypes[build.type]];

                        if (unsupported) {
                            build.labels.push(unsupported)
                        } else if (build.label) {
                            if (build.label in Labels) {
                                build.labels.push(Labels[build.label])
                            } else {
                                console.error(`Unknown label: ${build.label}`)
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
                }, response => console.error("Failed to fetch builds"))
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
                if (this.loadingRecommended || this.recommended || !builds || builds.length === 0) {
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
            routeForCategory(category) {
                return {name: 'downloads', params: {
                    project: this.platform.id,
                    buildType: this.$route.params.buildType,
                    category: category
                }}
            },
            redirectToDefaultVersion() {
                if (this.platform.loaded && !this.$route.params.category) {
                    this.$router.replace({name: 'downloads', params: {
                        project: this.platform.id,
                        category: this.platform.defaultCategory,
                    }});
                    return true
                } else {
                    return false
                }
            },
        },
        components: {
            builds: Builds
        }
    }
</script>
