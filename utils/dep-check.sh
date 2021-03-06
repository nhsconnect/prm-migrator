#!/bin/bash

npm-recursive-install

echo "Starting scan"
echo "FAIL_ON_CVSS is " + $FAIL_ON_CVSS
/usr/share/dependency-check/bin/dependency-check.sh --project prm-migrator --scan . --out /report --format ALL --failOnCVSS $FAIL_ON_CVSS
echo "Scan complete"

export VULS=$(cat /report/dependency-check-report.json | jq '.dependencies | .[] | select(.vulnerabilities != null) | {fileName, filePath, vulnerabilities:.vulnerabilities[] | {cvssScore:.cvssScore | tonumber,severity}}' | jq -n '[inputs]')
echo $VULS

export HIGH_VULS=$(echo $VULS | jq --arg FAIL_ON_CVSS "$FAIL_ON_CVSS" '.[] | .vulnerabilities | select(.cvssScore >= $FAIL_ON_CVSS)')

if [ "$HIGH_VULS" ]; then
  echo "Vulnerabilities found!"
  exit 1
fi

exit 0