#!/bin/bash

npm-recursive-install

echo "Starting scan"
/usr/share/dependency-check/bin/dependency-check.sh --project prm-migrator --scan . --out /report --format ALL --failOnCVSS 0
echo "Scan complete"

export VULS=$(cat /report/dependency-check-report.json | jq '.dependencies | .[] | select(.vulnerabilities != null) | {fileName, filePath, vulnerabilities:.vulnerabilities[] | {cvssScore:.cvssScore | tonumber,severity}}' | jq -n '[inputs]')
echo $VULS

export HIGH_VULS=$(echo $VULS | jq '.[] | .vulnerabilities | select(.cvssScore >= 0.0)')

if [ "$HIGH_VULS" ]; then
  echo "Vulnerabilities found!"
  exit 1
fi

exit 0