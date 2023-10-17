# About

This project is a static React application that serves as the frontend for the SamCart Administrator panel.

# Installation

Download the source:

`git clone git@github.com:brod/qa-playwright-e2e` or `git clone https://github.com/brod/qa-playwright-e2e`

If you do not have npm installed, install it: https://www.npmjs.com/get-npm

This has been tested and verified to work with node versions starting at v10.16.1

Install dependencies:

`npm install`

# Testing

We run e2e tests using Playwright. By default, `npm run e2e` will run all the tests and run a coverage report. Currently we only run set of smoke tests on staging locally but eventually we will have these tests integrated within our CI pipeline properly

# Linting

We use the [Playwright test runner](https://www.npmjs.com/package/eslint-plugin-playwright) and lint against it. If your unit tests pass, the linter will automatically run after that. If you just want to check your style, use `npm run lint`
