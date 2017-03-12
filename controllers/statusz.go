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
	"net/http"
	"os"
	"regexp"

	"gopkg.in/macaron.v1"
)

const service = "SpongeHome"

func readStatus() interface{} {
	buildName := os.Getenv("OPENSHIFT_BUILD_NAME")
	if buildName == "" {
		return nil
	}

	buildNameRe := regexp.MustCompile(`^(.+)-(\d+)$`)
	buildNamePieces := buildNameRe.FindStringSubmatch(buildName)
	jobName := buildNamePieces[1]
	buildNum := buildNamePieces[2]
	buildTag := os.Getenv("OPENSHIFT_BUILD_NAMESPACE") + "/" + os.Getenv("OPENSHIFT_BUILD_NAME")

	return map[string]string{
		"BUILD_NUMBER": buildNum,
		"GIT_BRANCH":   os.Getenv("OPENSHIFT_BUILD_REFERENCE"),
		"GIT_COMMIT":   os.Getenv("OPENSHIFT_BUILD_COMMIT"),
		"JOB_NAME":     jobName,
		"BUILD_TAG":    buildTag,
		"SPONGE_ENV":   os.Getenv("SPONGE_ENV"),
		"SERVICE":      service,
	}
}

func StatuszHandler() macaron.Handler {
	status := readStatus()
	if status == nil {
		return nil
	}

	return func(ctx macaron.Render) {
		ctx.JSON(http.StatusOK, status)
	}
}
