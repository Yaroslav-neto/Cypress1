const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'ih84fw',
  e2e: {
    baseUrl: 'http://qamid.tmweb.ru',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  watchForFileChanges: false,
  retries: 0,
  env: {
    device: "desktop",
    screenshotsFolder: "cypress/screenshots"
    // videosFolder: "cypress/videos"
  }
});
