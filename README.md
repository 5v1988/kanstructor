<h1 align="center">
	<br>
	<img width="480" src="media/dy-logo.svg" alt="Dancing-Yaml">
	<br>
	<br>
</h1>

> Write, test and repeat using YAML syntax

## Highlights

- No programming
- Automated tests in plain Yaml
- Visual regression tests in minutes
— Check browser compatibility
- Designed for test engineers, product teams

## Installation

```sh
npm init
npm install dancing-yaml
```

**IMPORTANT:** Remember to install node and npm as a pre-requisite before setting up the project using this package [For more info.](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)


Also, this package transtively depends on Playwright, it's required to install browsers needed for Playwright using this command below.


```sh
npx playwright install
```

## Project Setup

```sh
.
├── node_modules
├── package-lock.json
├── package.json
└── resources
    ├── config
    │   └── config.yaml
    ├── elements
    │   └── forgot-password-element.yaml
    ├── extracted-contents
    ├── snapshots
    └── tests
        └── forgot-password-test.yaml
```

