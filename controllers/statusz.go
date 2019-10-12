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

package controllers

import (
	"os"
	"gopkg.in/macaron.v1"
	"net/http"
)

const (
	buildNum  = "BUILD_NUMBER"
	gitBranch = "GIT_BRANCH"
	gitCommit = "GIT_COMMIT"
	jobName   = "JOB_NAME"
	buildTag  = "BUILD_TAG"
	spongeEnv = "SPONGE_ENV"
	service   = "SERVICE"
)

func env(name string) string {
	val := os.Getenv(name)
	if val == "" {
		return "unknown"
	}
	return val
}

func GetStatusz(ctx *macaron.Context) {
	ctx.JSON(http.StatusOK, map[string]string{
		buildNum:  env(buildNum),
		gitBranch: env(gitBranch),
		gitCommit: env(gitCommit),
		jobName:   env(jobName),
		buildTag:  env(buildTag),
		spongeEnv: env(spongeEnv),
		service:   "SpongeHome",
	})
}
