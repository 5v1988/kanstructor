<h1 align="center">
	<br>
	<img width="480" src="src/media/dy-logo.svg" alt="Dancing-Yaml">
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
mkdir test-project && cd test-project #create and change to project dir
npm init
npm install dancing-yaml
```

**IMPORTANT:** Remember to install `node` and `npm` as pre-requisites before setting up the project using this package [Refer here for more info.](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)


Also, this package transtively depends on Playwright, it's required to install browsers needed for Playwright using this command below.


```sh
npx playwright install
```

## Quick Start

- **Step 1** : Create `resources` folder which is going to be a root directory for all testing stuff

- **Step 2** : Under `resources` folder, let's create `tests` folder which will contain test files in a plain YAML format. Note that, this package `dancing-yaml` identifies a file as a test file only if it ends in `*test.yaml`. [More on how to write tests?](#write-tests)

- **Step 3** : Many a times, `CSS` and `XPath` values used to identify html elements will be used in several places across test files. To keep all such values in centralized place, the folder `elements` needs to be created within `resources`. Just like test files, the element files need to be ending in `*element.yaml` The following snippet shows some example element yaml.

	```yaml
		### Login page elements' xpath and css

		login_email: "[name='email']"
		login_password: "[name='password']"
		login_button: "//button[normalize-space()='Login']"
		home_logo: "a[href*='home']"
	```

- **Step 4** : The next step is, folders `extracted-contents` and `snapshots` need to be created to save all contents extracted during testing to external files and to keep golden copies of screenshots that will be verified against app under tests during testing respectively.

- **Step 5** : All common configurations such as browser, env etc will have to be in the file: `config.yaml` under `config` folder. The following snippet shows some examples.


	```yaml
		browser: chrome
		headless: false
		device: Desktop Chrome
		url: https://github.com/5v1988/dancing-yaml
	```

— **Step 6** : Lastly, to run all tests, the test runner `runMe.js` needs to be created in the project as follows:

  ```js
    import runMe from 'dancing-yaml'
    runMe();
  ```
Not necessarily that the method name must always be `runMe`; The below is the sample structure once all setup is complete.


```sh
.
└── src
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    ├── resources
    │   ├── config
    │   │   └── config.yaml
    │   ├── elements
    │   │   └── forgot-password-element.yaml
    │   ├── extracted-contents
    │   ├── snapshots
    │   └── tests
    │       └── forgot-password-test.yaml
    └── runMe.js

```

## Write Tests

 — Tests are expected to be written in Yaml files, otherwise known as test files while using this package. Each of these tests should have to be written using well known testing format: `Arrange-Act-Assert`

 ```yaml
 tests:
  - name: Check Log In button state
    exclude: false
    headless: false

    arrange:
      - name: openUrl
        url: https://giphy.com/login

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

 — A test file can have more than one test, however, our recommendation is to have a few of them, organized by some commonalities

 — A test folder `tests` can contain several test files; No limits

— The high-level blocks — Arrange, Act and Assert, contain a sequence of steps to perform certain actions during testing.

### Arrange Reference

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
    <th>Keys</th>
    <th>Example</th>
  </tr>
  <tr>
    <td><pre>openUrl</pre></td>
    <td>Open an app url in browser</td>
    <td>Required — <br>
      name,<br>
      url<br>
      Optional — <br>
      pause
    </td>
    <td>
      <pre lang="yaml">
        - name: openUrl 
          url: https://github.com/5v1988
      </pre>  
    </td>
  </tr>
</table>


### Act Reference

<table>
  <tr>
    <th>Action</th>
    <th>Description</th>
    <th>Keys</th>
    <th>Example</th>
  </tr>
  <tr>
    <td><pre>type</pre></td>
    <td>Enter characters into textboxes</td>
    <td>Required — <br>
      name,<br>
      action,<br>
      locator,<br>
      value <br>
      Optional — <br>
      pause
    </td>
    <td>
      <pre lang="yaml">
          - name: Type in username
            action: type
            locator: "input[name='email']"
            value: 5v1988@gmail.com
        </pre>
    </td>
  </tr>
  <tr>
    <td>
      <pre>
        check,
        uncheck
      </pre>  
    </td>
    <td>Check (or Uncheck) radio button/checkbox</td>
    <td>Required — <br>
      name,<br>
      action,<br>
      locator,<br>
      Optional — <br>
      pause
    </td>
    <td>
      <pre lang="yaml">
        - name: Choose a gender
          action: check
          locator: "input[type='checkbox']"
      <pre>    
    </td>  
  </tr>
  <tr>
    <td>click, <br>
      doubleclick <br>
    </td>
    <td>Click (or Doubleclick) button/link</td>
    <td>Required — <br>
      name,<br>
      action,<br>
      locator,<br>
      Optional — <br>
      pause
    </td>
    <td>name: Type in username <br>
        action: click <br>
        locator: '#file-submit'
    </td>  
  </tr>
  <tr>
    <td>select</td>
    <td>Select a dropdown value</td>
    <td>Required — <br>
      name,<br>
      action,<br>
      locator,<br>
      value <br>
      Optional — <br>
      pause
    </td>
    <td>name: choose_dropdown <br>
        locator: "#dropdown" <br>
        action: select <br>
        value: Option 2
    </td>  
  </tr>
  <tr>
    <td>press</td>
    <td>Simulate a key press</td>
    <td>Required — <br>
      name,<br>
      action,<br>
      value <br>
      Optional — <br>
      pause
    </td>
    <td>
      name: Press enter <br>
      action: press <br>
      value: Enter
    </td>  
  </tr>
  <tr>
    <td>clear, <br>
        focus, <br>
        hover<br>
      </td>
    <td>Clear (or focus or hover) on html element</td>
    <td>Required — <br>
      name,<br>
      action,<br>
      locator <br>
      Optional — <br>
      pause
    </td>
    <td>
      name: hover over the login link <br>
      locator: "//button[normalize-space()='Login']" <br>
      action: hover <br>
    </td>  
  </tr>    
  <tr>
    <td>snapshot</td>
    <td>Take a screenshot of a current window</td>
    <td>Required — <br>
      name,<br>
      action,<br>
      path <br>
      Optional — <br>
      pause
    </td>
    <td>
      name: Take screenshot of login failure <br>
      pause: 1 <br>
      action: snapshot <br>
      path: "src/snapshots/login-fail-original.png" <br>
    </td>  
  </tr>
  <tr>
    <td>upload</td>
    <td>Upload a file to the app</td>
    <td>Required — <br>
      name,<br>
      action,<br>
      locator <br>
      path <br>     
      Optional — <br>
      pause
    </td>
    <td>
      name: Upload an image <br>
      action: upload <br>
      locator: '#file-upload' <br>
      path: src/example/innerText.txt <br>
    </td>  
  </tr>  
  <tr>
    <td>extract</td>
    <td>
      Extract a text contents from the current window <br>
      By default, Page source of the current window will be extracted <br>
      Locator must also be given only if `extractType` is given
    </td>
    <td>Required — <br>
      name,<br>
      action,<br>
      path <br>
      Optional — <br>
      locator <br>
      extractType — textContents, innerText, innerHTML <br> 
      pause
    </td>
    <td>
      name: Extract text contents from a form <br>
      action: extract <br>
      path: "src/extracted-contents/form.txt" <br>
      locator: "form#customer" <br>
      extractType: innerText <br>
    </td>  
  </tr>  
</table>


### Assert Reference

<table>
  <tr>
    <th>Type</th>
    <th>Description</th>
    <th>Keys</th>
    <th>Example</th>
  </tr>
  <tr>
    <td>element</td>
    <td>Assert the expectation by having element(s) on the page</td>
    <td>Required — <br>
      name,<br>
      type,<br>
      locator,<br>
      state (Accepted values: visible, invisible, enabled, disabled, checked, unchecked, containText),<br>
      text (Required only if state = containText)
      Optional — <br>
      pause
    </td>
    <td>
      name: Verify dropdown selected
      type: element
      locator: "//option[@selected]"
      state: containText
      text: Option 2
    </td>
  </tr>
  <tr>
    <td>text</td>
    <td>Verify if text displayed ( or not displayed)</td>
    <td>Required — <br>
      name,<br>
      type,<br>
      text,<br>
      state (Accepted values: visible, invisible)
      Optional — <br>
      pause
    </td>
    <td>
      name: verify_upload
      type: text
      text: innerText.txt
      state: 'visible'
    </td>
  </tr>
  <tr>
    <td>snapshot</td>
    <td>Compare the expected screenshot with the actual one on the current screen</td>
    <td>Required — <br>
      name,<br>
      type,<br>
      original,<br>
      reference<br>
      Optional — <br>
      pause
    </td>
    <td>
      name: Verify login failure screen
      type: snapshot
      original: "src/snapshots/login/login-fail-original.png"
      reference: "src/snapshots/login/login-fail-chrome-reference.png"
    </td>
  </tr>
<table>  


## Roadmap

— [X] Browser <br>
— [O] Summary report <br>
— [O] Parameterized tests <br>
— [O] API <br>
— [O] Mobile <br>

## Contribute

## Support

## License