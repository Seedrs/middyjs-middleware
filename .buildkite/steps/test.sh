#!/bin/bash
#
# Runs all tests

set -euo pipefail

yarn install && yarn test
