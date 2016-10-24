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

export const Platforms = {
    spongevanilla: {
        id: 'spongevanilla',
        name: "SpongeVanilla",
        suffix: "Vanilla",
        description: "SpongeVanilla is the implementation of the Sponge API on top of Vanilla Minecraft.",
        recommendation: "Recommended for running plugins without Forge mods.",
        url: "https://repo.spongepowered.org/maven/org/spongepowered/spongevanilla/"
    },
    spongeforge: {
        id: 'spongeforge',
        name: "SpongeForge",
        suffix: "Forge",
        description: "SpongeForge is the implementation of the Sponge API on the Minecraft Forge platform.",
        recommendation: "Recommended for running plugins together with Forge mods.",
        url: "http://files.minecraftforge.net/maven/org/spongepowered/spongeforge/"
    },
    spongeapi: {
        id: 'spongeapi',
        name: "SpongeAPI",
        suffix: "API",
        description: "SpongeAPI is the tool developers use to create plugins for the Sponge platform.",
        recommendation: "Recommended for plugin developers.",
        url: "https://repo.spongepowered.org/maven/org/spongepowered/spongeapi/"
    }
};
