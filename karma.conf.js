module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
      { 'reporter:jasmine-seed': ['type', JasmineSeedReporter] },
    ],
    client: {
      clearContext: false,
      jasmine: {
        random: true,
        seed: '',
      },
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/angularexampleapp'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
      // check: {
      //   global: {
      //     statements: 54,
      //     lines: 56,
      //     branches: 52,
      //     functions: 41,
      //   },
      // },
    },
    reporters: ['progress', 'kjhtml', 'jasmine-seed'],
    reportSlowerThan: 100,
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--headless',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--hide-scrollbars',
          '--mute-audio',
        ],
      },
    },
    browsers: ['ChromeHeadlessNoSandbox'],
    browserNoActivityTimeout: 60000,
    singleRun: false,
    restartOnFileChange: true,
  });
};

// Helpers
function JasmineSeedReporter(baseReporterDecorator) {
  baseReporterDecorator(this);

  this.onBrowserComplete = (browser, result) => {
    const seed = result.order && result.order.random && result.order.seed;
    if (seed) this.write(`${browser}: Randomized with seed ${seed}.\n`);
  };

  this.onRunComplete = () => undefined;
}
