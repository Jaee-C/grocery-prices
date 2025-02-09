#!/usr/bin/env bash

SHORT_HASH=$(git rev-parse --short "$GITHUB_SHA")
BUILD_NO="$GITHUB_RUN_NUMBER"
BRANCH_NAME=$(echo "$GITHUB_REF_NAME" | tr '/' '-')

echo "$BUILD_NO.$SHORT_HASH-$BRANCH_NAME"
