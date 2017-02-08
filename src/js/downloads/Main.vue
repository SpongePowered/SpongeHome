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
                        <img src="assets/img/icons/spongie-mark-reverse-dark.svg" />
                        <h1>Sponge</h1>
                    </div>
                    <h2>Downloads</h2>
                </div>
            </div>
        </div>
    </header>

    <section id="downloads">
        <div class="container">
            <platforms></platforms>
        </div>
    </section></div>
</template>

<script>
    import Platforms from 'downloads/Platforms.vue'

    export default {
        name: 'main',
        components: {
            platforms: Platforms
        }
    }
</script>
