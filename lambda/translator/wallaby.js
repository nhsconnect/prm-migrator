/* ignore file coverage: just a config file */
module.exports = () => {
    return {
      loose: true,
      files: [
        '*.js', 
        { pattern: "tls/**/*", instrument: false },
        'test/*.js', 
        '!test/*.test.js'
      ],
      tests: [
        'test/*.test.js'
        ],
      hints: {
        ignoreCoverageForFile: /ignore file coverage/,
        ignoreCoverage: /ignore coverage/
      },
      env: {
        type: 'node',
        runner: 'node'
      },
  
      testFramework: 'jest'
    };
  };
  