# Session 2: Web Component from Scratch

## Introduction

In this session, we will dive into the fundamentals of Web Components, learn how to create custom elements using TypeScript, and understand the concepts of Shadow DOM and encapsulation. We will also explore lifecycle hooks, observed attributes, and handling attribute changes. By the end of this session, you will have the skills to build modular and reusable web components.

## Objectives

- Learn the fundamentals of Web Components.
- Create custom elements using TypeScript.
- Understand Shadow DOM and encapsulation.
- Use lifecycle hooks in Web Components.
- Implement observed attributes and handle attribute changes.

## Prerequisites

Make sure you have completed [Session 1: Workspace, TypeScript, and RollupJS](../session1/readme.md). We will use the artifacts and setup from that session.

## Steps

### 1. Learn the Fundamentals of Web Components

Web Components consist of three main technologies:
- **Custom Elements**: Define new HTML tags with custom behavior.
- **Shadow DOM**: Encapsulates the internal structure and style of the component.
- **HTML Templates**: Define reusable chunks of HTML.

### 2. Create Custom Elements Using TypeScript

We will extend our custom web component called `HelloWorld` from the previous session.  We will extend it with an attribute `name` to say hello to a name. 

Therefore, open `src/helloWorld.ts` and extend it by the following code:

```typescript
export class HelloWorld extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.render();
	}

	static get observedAttributes() {
		return ['name'];
	}

	attributeChangedCallback(
		name: string, 
		oldValue: string | null, 
		newValue: string | null) {
		if (oldValue !== newValue) {
			this.render();
		}
	}

	render() {
		if (this.shadowRoot) {
			this.shadowRoot.innerHTML = `
				<div>Hello ${this.getAttribute('name') || 'World!'}</div>
			`;
		}
	}
}

// Define the new element
customElements.define('hello-world', HelloWorld);
```

### 3. Understand Shadow DOM and Encapsulation

Shadow DOM allows us to encapsulate the internal structure and style of a component, preventing them from being affected by the rest of the page and vice versa. This encapsulation enhances modularity and reusability.

In the `HelloWorld` component, we used `this.attachShadow({ mode: 'open' })` to create a shadow root and attached our styles and content to it.

### 4. Lifecycle Hooks in Web Components

Web Components provide several lifecycle hooks that allow you to perform actions during different phases of the component's lifecycle:

- **connectedCallback**: Invoked when the element is added to the document.
- **disconnectedCallback**: Invoked when the element is removed from the document.
- **attributeChangedCallback**: Invoked when one of the element's attributes is added, removed, or changed.
- **adoptedCallback**: Invoked when the element is moved to a new document.

In the `HelloWorld` component, we use `connectedCallback` to render the component when it is added to the document and `attributeChangedCallback` to update the component when the `greeting` attribute changes.

### 5. Observed Attributes and Handling Attribute Changes

The `observedAttributes` static getter specifies which attributes to monitor for changes. When one of these attributes changes, the `attributeChangedCallback` is invoked.

In the `HelloWorld` component, we observe the `greeting` attribute and update the displayed message when it changes.

### 6. Integrate the Component with the Entry Point

To use the `HelloWorld` component, we need to import it and add it to our HTML
Open `src/index.ts` and modify it to import the `HelloWorld` component and use it:

```typescript
import './helloWorld';

// Append the new element to the body
const helloWorldElement = document.createElement('hello-world');
// That's the same as <hello-world name="xxx"></hello-world>
helloWorldElement.setAttribute('name', 'your name');
document.body.appendChild(helloWorldElement);
```

### 7. Interactive Component
We will create a second component called `InputComponent` that contains an input field. When the input value changes, it will update the name attribute of the `HelloWorld` component.

Create the file `src/inputComponent.ts` and add the following code:

```typescript
export class InputComponent extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.render();
		this.shadowRoot?.querySelector('input')?.addEventListener('input', this.onInputChange.bind(this));
	}

	onInputChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const helloWorldElement = document.querySelector('hello-world');
		if (helloWorldElement) {
			helloWorldElement.setAttribute('name', input.value);
		}
	}

	render() {
		if (this.shadowRoot) {
			this.shadowRoot.innerHTML = `
				<input type="text" placeholder="Enter greeting" />
			`;
		}
	}
}

// Define the new element
customElements.define('input-component', InputComponent);
``` 

Open `src/index.ts` and modify it to import the `InputComponent` and use both components:


```typescript

import './helloWorld';
import './inputComponent';

// Append the new element to the body
document.body.innerHTML = `
<input-component></input-component>
<hr/>
<hello-world></hello-world>
`;
```

### 8. Serve the Project

Run the following command to serve the project and watch for changes:

```bash
npm run serve
```

Open your web browser and navigate to `http://localhost:10001` to see the Hello World web component and Input Component in action.

## Conclusion
In this session, you learned the fundamentals of Web Components, created a custom element using TypeScript, and understood the concept of Shadow DOM and encapsulation. You also explored lifecycle hooks, observed attributes, and handling attribute changes. Additionally, you created a second component that interacts with the `HelloWorld` component, demonstrating how to build interactive and modular web components.


## Self Reflection Questions
1. How much boilerplate code we have?
2. What are the different lifecycle hooks available in Web Components, and what are their purposes?
3. How do observed attributes and the attributeChangedCallback method work together to handle changes in component properties?
4. What are the steps involved in creating and using a custom web component in a TypeScript project?
5. How can one Web Component interact with another, as demonstrated with the HelloWorld and InputComponent components? Good or Bad?