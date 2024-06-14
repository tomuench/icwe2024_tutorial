# Session 4: Connecting Web Components to a Page

## Introduction

In this session, we will focus on integrating web components into HTML pages using Atomic Design principles. We will handle events and data binding, and structure a web application using components. By the end of this session, you will understand how to organize your components effectively and create a scalable web application structure.

**Attention**: The include of files into the index.ts is not described.

## Objectives

- Integrate web components into HTML pages using Atomic Design principles.
- Handle events and data binding.
- Structure a web application using components.

## Prerequisites

Make sure you have completed [Session 3: Boost the Developer Experience](../session3/readme.md). We will build upon the concepts and code from that session.

## Steps

### 1. Organize Source Directory Structure and add previous components

#### 1.1. Create Folders 
We will organize our source directory to follow the Atomic Design principles. Create directories for atoms, molecules, and organisms.

```bash
mkdir -p src/components/atoms
mkdir -p src/components/molecules
mkdir -p src/components/organisms

touch src/components/atoms/index.ts
touch src/components/molecules/index.ts
touch src/components/organisms/index.ts
```

### 1.2. Copy or create decorators and previous components

Create basics folder with an index:

```bash
mkdir -p src/basics
touch src/basics/index.ts
```

Move your previous components:

```bash
mv src/decorators.ts src/basics/
mv src/basicComponent.ts src/basics/
```

Afterwards you should export the files in the `basics/index.ts`.


### 2. Create Atom Components

#### Step 2.1: Create Button Component

Create a file named `buttonComponent.ts` in the `atoms` directory.

```bash
touch src/components/atoms/buttonComponent.ts
```

Open `src/components/atoms/buttonComponent.ts` and add the following code:

```typescript
import { BasicComponent, component } from '../../basics/index';

@component('custom-button', `
	<button><slot></slot></button>
`)
export class ButtonComponent extends BasicComponent {
	constructor() {
		super();
		this.addEventListener('click', this.handleClick);
	}

	handleClick() {
		this.dispatchEvent(new CustomEvent('button-click', {
			bubbles: true,
			composed: true,
		}));
	}

	disconnectedCallback() {
		this.removeEventListener('click', this.handleClick);
	}
}
```

Add the component to the `index.ts` of the atoms folder:

```typescript  
export * from './buttonComponent'
```

### 3. Create Molecule Components

#### Step 3.1: Create Input Field Component

Create a file named `inputFieldComponent.ts` in the `molecules` directory.

```bash
touch src/components/molecules/inputFieldComponent.ts
```

Open `src/components/molecules/inputFieldComponent.ts` and add the following code:

```typescript

import { BasicComponent, component, observedAttribute } from '../../basics/index';


export interface InputChangeData {
    value: string;
} 

@component('input-field', `
	<label id="label"></label>
	<input type="text" id="input"/>
`)
export class InputFieldComponent extends BasicComponent {
	@observedAttribute
	label!: string;

	@observedAttribute
	value!: string;

	constructor() {
		super();
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		const input = this.shadowRoot?.querySelector('input');
		if (input) {
			input.addEventListener('input', this.handleInputChange);
		}
	}

	disconnectedCallback() {
		const input = this.shadowRoot?.querySelector('input');
		if (input) {
			input.removeEventListener('input', this.handleInputChange);
		}
	}

	handleInputChange(event: Event) {
		const input = event.target as HTMLInputElement;
		this.value = input.value;
		this.dispatchEvent(new CustomEvent<InputChangeData>('input-change', {
			detail: { value: input.value },
			bubbles: true,
			composed: true,
		}));
	}

	render() {
		if (this.shadowRoot) {
			this.shadowRoot.innerHTML = this.templateForRender;
			const labelElement = this.shadowRoot.querySelector('#label');
			const inputElement = this.shadowRoot.querySelector<HTMLInputElement>('#input');
			if (labelElement) labelElement.textContent = this.label || '';
			if (inputElement) inputElement.value = this.value || '';
		}
	}
}
```

### 4. Create Organism Components

#### Step 4.1: Create Greeting List Component

Create a file named `greetingListComponent.ts` in the `organisms` directory.

```bash
touch src/components/organisms/greetingListComponent.ts
```

Open `src/components/organisms/greetingListComponent.ts` and add the following code:

```typescript
import { BasicComponent, component } from '../../basics/index';
import { ButtonComponent } from '../atoms/index';
import { InputChangeData, InputFieldComponent } from '../molecules/index';

@component('greeting-list', `
	<div class="container">
		<input-field label="Enter greeting:" id="inputField"></input-field>
		<custom-button id="addButton">Add Greeting</custom-button>
		<ul id="list"></ul>
	</div>
`)
export class GreetingListComponent extends BasicComponent {
    greetings: string[] = [];

    currentValue: string = '';

    private registerEvents() {
        const inputField = this.shadowRoot?.querySelector('#inputField') as InputFieldComponent;
        const addButton = this.shadowRoot?.querySelector('#addButton') as ButtonComponent;

        addButton?.addEventListener('button-click', () => {
            const newGreeting = this.currentValue || '';
            if (newGreeting) {
                this.greetings.push(newGreeting);
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

### 5. Create the Web Page

We will create an HTML page that uses our `GreetingListComponent` and provides some description around it.

#### Step 5.1: Create the HTML Page

Create an `index.html` file in the `public` directory (or create the `public` directory if it doesn't exist).

```bash
mkdir -p src/pages
touch src/pages/index.html
```

Open `src/pages/index.html` and add the following code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Greeting List</title>
	<script type="module" src="index.js"></script>
</head>
<body>
	<div class="container">
		<h1>Greeting List Application</h1>
		<p>Welcome to the Greeting List Application! This application demonstrates the use of web components following Atomic Design principles. You can enter a greeting message in the input field and click the "Add Greeting" button to add it to the list below. This example showcases how web components can be composed to build complex and reusable UI elements.</p>
		<greeting-list id="greetingList"></greeting-list>
	</div>
</body>
</html>
```

#### 5.2: Add Copy Plugin to RollupJS

First, you need to install `rollup-plugin-copy` as a development dependency.

```bash
npm install rollup-plugin-copy --save-dev
```

You need to update your rollup.config.mjs file to include the plugin and configure it to copy files to the desired location.

```javascript
import typescript from 'rollup-plugin-typescript2';
import html from '@rollup/plugin-html';
import serve from 'rollup-plugin-serve';
import copy from 'rollup-plugin-copy';

export default {
	input: 'src/index.ts',
	output: {
		file: 'public/index.js',
		format: 'es'
	},
	plugins: [
		typescript(),
		copy({
			targets: [
			  { src: 'src/pages/*', dest: 'public/' },
			]
		  }),
		serve('public'),
	]
};
``` 

### 6. Update the Entry Point

Ensure that the entry point correctly loads and initializes the components.

Open `src/index.ts` and ensure it contains:

```typescript
// src/index.ts

import './components/index';
```

If this file does not exists, export all your `atom`, `molecules` and `organisms` from it.

### 7. Build and Serve the Project

Run the following command to serve the project and watch for changes:

```bash
npm run serve
```

Open your web browser and navigate to `http://localhost:10001` to see the integrated components and the description in action.

## Conclusion

In this session, you learned how to integrate web components into HTML pages using Atomic Design principles. You handled events and data binding, and structured a web application using components. By organizing components into atoms, molecules, and organisms, and providing a descriptive HTML page, you created a scalable and maintainable application structure.

## Self-Reflection Questions

1. **How does Atomic Design help in organizing and managing web components?**
2. **What are the benefits of handling events and data binding in web components?**
3. **How do you structure a web application using components, and what are the advantages of this approach?**
4. **What challenges did you encounter when integrating multiple components, and how did you address them?**
5. **How can the principles and techniques learned in this session improve your overall web development workflow?**
