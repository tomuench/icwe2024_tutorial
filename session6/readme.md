# Session 6: Routing and Storing Data

## Introduction

In this session, we will focus on building a client-side multi-page application with routing and learn how to store data using local storage. We will manage state within our Progressive Web App (PWA) and use server-side includes (SSI) syntax to manage multiple HTML files. Additionally, we will create a `GreetingProvider` class for accessing local storage, ensuring it is a singleton, and using a specific page as a key.

## Objectives

- Implement client-side routing for a multi-page application.
- Use local storage for data persistence.
- Manage state within a PWA.
- Use server-side includes syntax and replace placeholders during the build process because we just use serve by rol
- Build a `GreetingProvider` as a singleton class for accessing local storage.
- Use a specific id as a key in `GreetingProvider`.

## Prerequisites

Make sure you have completed [Session 5: Offline-Ready Progressive Web App](../session5/readme.md). We will build upon the concepts and code from that session. Assume you have a finished `index.html` before starting this session.

## Steps

### 1. Add Navigation by Server-Side Includes and Create Home Page

We will create a navigation bar using server-side includes and create a `home.html` file with some description of the greetings page.

#### Step 1.1: Create Menu Include

Create a new file named `menu.html` in the `src` directory.

```bash
mkdir -p src/pages/partials
touch src/pages/partials/menu.html
touch src/pages/partials/header.html
```

Open `src/partials/menu.html` and add the following code:

```html
<!-- src/partials/menu.html -->
<nav>
  <ul>
    <li><a href="index.html">Home</a></li>
    <li><a href="greetings.html?id=1">Greetings List 1</a></li>
    <li><a href="greetings.html?id=2">Greetings List 2</a></li>
  </ul>
</nav>
```


Open `src/partials/header.html` and add the following code:

```html
<!-- src/partials/header.html -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script type="module" src="index.js"></script>
```

#### Step 1.2: Update index.html

Assuming you have a finished `src/pages/index.html`, modify it to include the menu and add a description for the home page. The GreetingsComponent will be moved to a new page.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Home</title>
  <!--#include virtual="/partials/header.html" -->
</head>
<body>
  <!--#include virtual="/partials/menu.html" -->
  <div class="container">
    <h1>Welcome to the Greeting List Application!</h1>
    <p>This application allows you to manage multiple greeting lists. Navigate to the greetings page to add and view greetings.</p>
  </div>
</body>
</html>
```


#### Step 1.3: Move Greetings from index.html to greetings.html

Create a new file named `greetings.html` in the `src/pages` directory.

```bash
touch src/pages/greetings.html
```

Open `src/pages/greetings.html` and add the following code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Greetings</title>
  <!--#include virtual="/partials/header.html" -->
</head>
<body>
  <div class="menu">
    <!--#include virtual="/partials/menu.html" -->
  </div>
  <div class="container">
    <h1>Greetings</h1>
    <p>Manage your greetings here.</p>
    <greeting-list id="greetingList"></greeting-list>
    <p><a href="home.html">Go to Home</a></p>
  </div>
  <script>
    // Set the listId parameter inside the greetings.html
    const urlParams = new URLSearchParams(window.location.search);
    const listId = urlParams.get('id') || 'default';
    document.getElementById('greetingList').setAttribute('id', listId);
  </script>
</body>
</html>
```

Add `greetings.html` to `serviceWorker.js` to store it offline.

### 3. Create GreetingProvider Singleton

We will create a `GreetingProvider` class to handle local storage access, ensuring it is a singleton and using a specific page as a key.

#### Step 3.1: Create GreetingProvider Class

Create a new file named `providers/greetingProvider.ts` in the `src` directory.

```bash
mkdir -p src/providers
touch src/providers/greetingProvider.ts
```

Open `src/providers/greetingProvider.ts` and add the following code:

```typescript
// src/greetingProvider.ts

export default class GreetingProvider {
  private static instances: { [key: string]: GreetingProvider } = {};
  private key: string;

  private constructor(page: string) {
    this.key = `greetings_${page}`;
  }

  public static getInstance(page: string): GreetingProvider {
    if (!GreetingProvider.instances[page]) {
      GreetingProvider.instances[page] = new GreetingProvider(page);
    }
    return GreetingProvider.instances[page];
  }

  public getGreetings(): string[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  public addGreeting(greeting: string): void {
    const greetings = this.getGreetings();
    greetings.push(greeting);
    localStorage.setItem(this.key, JSON.stringify(greetings));
  }
}
```

### 4. Update Greeting List Component

We will update the `GreetingListComponent` to use `GreetingProvider` for storing and retrieving greetings based on the listId.

#### Step 4.1: Update Greeting List Component

Open `src/components/organisms/greetingListComponent.ts` and modify it:

```typescript
// src/components/organisms/greetingListComponent.ts

import { BasicComponent, component } from '../../basics/index';
import { ButtonComponent } from '../atoms/index';
import { InputChangeData, InputFieldComponent } from '../molecules/index';
import GreetingProvider from '../../providers/greetingProvider';

@component('greeting-list', `
  <div class="container">
    <input-field label="Enter greeting:" id="inputField"></input-field>
    <custom-button id="addButton">Add Greeting</custom-button>
    <ul id="list"></ul>
  </div>
`)
export class GreetingListComponent extends BasicComponent {
    greetings: string[] = [];
    provider: GreetingProvider | undefined;

    currentValue: string = '';

    constructor() {
        super();
        this.initializeAndLoadGreetings();
    }


    private addGreeting(greeting: string): void {
        this.provider?.addGreeting(greeting);
        this.greetings.push(greeting);
    }


    private initializeAndLoadGreetings() {
        const listId = this.getAttribute('data-list-id') || 'default';
        this.provider = GreetingProvider.getInstance(listId);
        this.greetings = this.provider.getGreetings();
    }

    private registerEvents() {
        const inputField = this.shadowRoot?.querySelector('#inputField') as InputFieldComponent;
        const addButton = this.shadowRoot?.querySelector('#addButton') as ButtonComponent;

        addButton?.addEventListener('button-click', () => {
            const newGreeting = this.currentValue || '';
            if (newGreeting) {
                this.addGreeting(newGreeting);
                this.render();
                this.currentValue = '';
                inputField.value = '';
            }
        });

        inputField?.addEventListener('input-change', ((event: CustomEvent<InputChangeData>) => {
            this.currentValue = event.detail.value;
        }) as EventListener);
    }

    private renderList() {
        const list = this.shadowRoot?.querySelector('#list');
        if (list) {
            list.innerHTML = '';
            this.greetings.forEach(greeting => {
                const listItem = document.createElement('li');
                listItem.textContent = greeting;
                list.appendChild(listItem);
            });
        }
    }

    override afterRender() {
        if (this.shadowRoot) {
            this.renderList();
            this.registerEvents();
        }
    }
}
```

### 5. Update Rollup Configuration for SSI Replacement

We will update the Rollup configuration and a custom plugin to replace SSI placeholders with the actual content.

#### Step 5.3: Update `rollup.config.mjs`

Open `rollup.config.mjs` and modify it to include `ssi-replace-plugin.js`. The file is already provided:

```javascript
// rollup.config.mjs
import typescript from 'rollup-plugin-typescript2';
import serve from 'rollup-plugin-serve';
import copy from 'rollup-plugin-copy';
import ssiReplace from './config/ssi-replace-plugin.mjs';

export default [
	{
		input: 'src/serviceWorker.ts',
		output: {
			file: 'public/serviceWorker.js',
			format: 'es'
		},
		plugins: [
			typescript(),
		]
	},
	{
		input: 'src/index.ts',
		output: {
			file: 'public/index.js',
			format: 'es'
		},
		plugins: [
			typescript(),
			copy({
				targets: [
					{
						src: ['src/pages/*.json', 'src/pages/icons/*.png'],
						dest: 'public/'
					},
					{
						src: ['src/pages/icons/*.png'],
						dest: 'public/icons',
					},
					{
						src: 'src/pages/*.html',
						dest: 'public/',
						transform: (contents, filename) => ssiReplace(contents,filename)
					},
				]
			}),
			serve('public'),
		]
	}];
```

### 6. Build and Serve the Project

Run the following command to serve the project and watch for changes:

```bash
npm run serve
```

Open your web browser and navigate to `http://localhost:10001/` to see the multi-page application with routing and data persistence in action.

## Conclusion

In this session, you learned how to implement client-side routing for a multi-page application using multiple HTML files and server-side includes. You also learned how to use local storage for data persistence and manage state within a Progressive Web App (PWA). Additionally, you configured Rollup to replace SSI placeholders with actual content during the build process using `rollup-plugin-copy` and a custom plugin.

## Self-Reflection Questions

1. **What are the benefits of using multiple HTML files for a multi-page application?**
2. **How does local storage help in persisting data across sessions?**
3. **What is the role of server-side includes in managing multiple HTML files efficiently?**
4. **How does the custom Rollup plugin help in replacing SSI placeholders during the build process?**
5. **How can the principles and techniques learned in this session be applied to improve the functionality and user experience of other web applications?**
