// protractor.conf.js

exports.config = {
    // Specify the URL of your Angular application
    baseUrl: 'http://localhost:4200',
  
    // Specify the framework you want to use (Jasmine or Mocha)
    framework: 'jasmine',
  
    // Specify the test specs files
    specs: [
      './e2e/**/*.spec.js' // This assumes your test spec files are located in a directory named 'e2e'
    ],
  
    // Specify the capabilities (browsers) you want to run your tests on
    capabilities: {
      browserName: 'chrome' // You can change this to 'firefox', 'safari', etc.
    },
  
    // Specify additional options to be passed to the WebDriver instance
    // Options include `directConnect`, `seleniumAddress`, etc.
    // See https://github.com/angular/protractor/blob/main/lib/config.ts for available options
    // directConnect: true, // Use this option if you're using Chrome or Firefox and don't need a Selenium Server
  
    // Specify options to be passed to Jasmine
    jasmineNodeOpts: {
      showColors: true, // Use colors in the command line report
      defaultTimeoutInterval: 30000 // Default timeout interval for test cases
    },
  
    // Optionally, you can specify other Protractor-specific options here
    // For example, `onPrepare`, `onComplete`, `params`, etc.
    // See https://github.com/angular/protractor/blob/main/lib/config.ts for available options
  };
  