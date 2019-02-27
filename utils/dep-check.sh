#!/bin/bash

npm-recursive-install

/usr/share/dependency-check/bin/dependency-check.sh --project prm-migrator --scan . --out /report --format ALL

export VULS=$(cat /report/dependency-check-report.json | jq '.dependencies | .[] | select(.vulnerabilities != null) | {fileName, filePath, vulnerabilities:.vulnerabilities[] | {cvssScore:.cvssScore | tonumber,severity}}' | jq -n '[inputs]')

echo $VUL

export HIGH_VULS=$(echo $VULS | jq '.[] | .vulnerabilities | select(.cvssScore >= 0.0)')

if [ "$HIGH_VULS" ]; then
  export CODEBUILD_BUILD_SUCCEEDING=0
fi