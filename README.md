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
- Browser compatibility checks
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

## Basic Setup

- **Step 1** : Create `resources` folder which is going to be a root directory for all testing stuff

- **Step 2** : Under `resources` folder, let's create `tests` folder which will contain test files in a plain YAML format. Note that, this package `dancing-yaml` identifies a file as a test file only if it ends in `*test.yaml`. For how to write tests?

- **Step 3** : Many a times, `CSS` and `XPath` values used to identify html elements will be used in several places across test files. To keep all such values in centralized place, the folder `elements` needs to be created within `resources`. Just like test files, the element files need to be ending in `*element.yaml` The following snippet shows some example element yaml.

	```yaml
		### Login page elements' xpath and css

		login_email: "[name='email']"
		login_password: "[name='password']"
		login_button: "//button[normalize-space()='Login']"
		home_logo: "a[href*='home']"
	```

- **Step 4** : The next step is, folders `extracted-contents` and `snapshots` need to be created to save all contents extracted during testing to external files and to keep golden copies of screenshots that will be verified against app under tests during testing respectively.

- **Step 5** : Lastly, one config folder will be created to have all configurations one may want to have before running tests. The following snippet shows some example configs.


	```yaml
		browser: chrome
		headless: false
		device: Desktop Chrome
		baseUrl: https://github.com/5v1988/dancing-yaml
	```
Once all the above steps are done, the typical project is expected to be in the below structure.


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

## Write Tests

 — Tests using this library need to be written in Yaml files, otherwise known as test files. Each of these tests should have to be written following the format: `Arrange-Act-Assert`

 ```yaml
 tests:
  - name: Check Log In button state
    exclude: false
    headless: false

    arrange:
      - name: baseUrl
        baseUrl: https://giphy.com/login

    act:
      - name: Type in username
        action: type
        locator: "input[name='email']"
        value: 5v1988@gmail.com

      - name: Type in password
        action: type
        locator: "input[name='password']"
        pause: 3
        value: Test12345#

    assert:
      - name: Verify 'Log In' enabled
        type: element
        pause: 1
        locator: "//form//button[normalize-space()='Log In']"
        state: enabled
 ```

 — A test file can have more than one tests, however our recommendation is to have a few of them, organised by some commonalities

 — A test folder `tests` can contain several test files; No limits

— The high-level blocks — Arrange, Act and Assert, contain a sequence of steps to perform certain actions during testing.  