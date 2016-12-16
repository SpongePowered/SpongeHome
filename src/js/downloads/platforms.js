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

export const API = process.env.DOWNLOADS_API_URL || "https://dl-api.spongepowered.org";

export const BuildTypes = [
    {
        name: "Stable",
        id: 'stable',
        color: 'primary'
    },
    {
        name: "Experimental",
        id: 'bleeding',
        color: 'warning'
    }
];

export const Labels = {
    recommended: {
        name: "Recommended",
        color: 'success',
        title: "Recommended build"
    },
    latest: {
        name: "Latest",
        color: 'success',
        title: "Latest build"
    },
    unsupported: {
        name: "Unsupported",
        color: 'danger'
    }
};

const ArtifactTypes = {
    Main: {
        name: "Main",
        classifier: '',
        icon: 'fa-download',
        title: "Download"
    },
    Sources: {
        name: "Sources",
        classifier: 'sources',
        icon: 'fa-code',
        title: "Download the source code"
    },
    Javadocs: {
        name: "Javadocs",
        classifier: 'javadoc',
        icon: 'fa-graduation-cap',
        title: "Download the Java API documentation"
    },
    Shaded: {
        name: "Shaded",
        classifier: 'shaded',
        icon: 'fa-archive',
        title: "Download a package with all dependencies"
    },
    DevShaded: {
        name: "Dev",
        classifier: 'dev-shaded',
        icon: 'fa-wrench',
        title: "Download an un-obfuscated build with all dependencies for testing in a development environment"
    }
};

export const Platforms = {
    spongevanilla: {
        group: 'org.spongepowered',
        id: 'spongevanilla',
        name: "SpongeVanilla",
        suffix: "Vanilla",
        description: "SpongeVanilla is the implementation of the Sponge API on top of Vanilla Minecraft.",
        recommendation: "Recommended for running plugins without Forge mods.",
        category: createDependencyCategory('minecraft', "Minecraft"),
        artifactTypes: [
            ArtifactTypes.Main,
            ArtifactTypes.Sources,
            ArtifactTypes.DevShaded
        ]
    },
    spongeforge: {
        group: 'org.spongepowered',
        id: 'spongeforge',
        name: "SpongeForge",
        suffix: "Forge",
        description: "SpongeForge is the implementation of the Sponge API on the Minecraft Forge platform.",
        recommendation: "Recommended for running plugins together with Forge mods.",
        category: createDependencyCategory('minecraft', "Minecraft"),
        artifactTypes: [
            ArtifactTypes.Main,
            ArtifactTypes.Sources,
            ArtifactTypes.DevShaded
        ],
        addLabels(build) {
            const minecraftVersion = this.category.forBuild(build);
            const forgeVersion = build.dependencies.forge;
            if (forgeVersion) {
                build.labels.push({
                    name: `Forge ${forgeVersion.split('.')[3]}`,
                    color: 'forge',
                    title: "Recommended Forge version",
                    link: `http://files.minecraftforge.net/maven/net/minecraftforge/forge/index_${minecraftVersion}.html`
                })
            }
        }
    },
    spongeapi: {
        group: 'org.spongepowered',
        id: 'spongeapi',
        name: "SpongeAPI",
        suffix: "API",
        description: "SpongeAPI is the tool developers use to create plugins for the Sponge platform.",
        recommendation: "Recommended for plugin developers.",
        category: {
            name: 'API',
            id: 'version',
            extractVersion(version) {
                return version.split('.')[0]
            },
            forBuild(build) {
                return this.extractVersion(build.version)
            },
            forProject(project) {
                return project.versions.map(this.extractVersion)
            }
        },
        artifactTypes: [
            ArtifactTypes.Shaded,
            ArtifactTypes.Sources,
            ArtifactTypes.Javadocs
        ]
    }
};

function createDependencyCategory(dependency, name) {
    return {
        name: name,
        id: dependency,
        forBuild(build) {
            return build.dependencies[this.id]
        },
        forProject(project) {
            return project.dependencies[this.id]
        }
    }
}
