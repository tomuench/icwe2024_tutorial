# Session 3: Boost the Developer Experience

## Introduction

In this session, we will enhance the development experience by creating a `BasicComponent` class that provides common logic for observed attributes and rendering. We will also introduce decorators for managing attribute observation and component registration. These tools will help streamline the creation and management of web components.

## Objectives

- Create a `BasicComponent` class for Web Components with logic for observed attributes and rendering.
- Implement a decorator for property setters to register attributes for observation.
- Implement a class decorator for component registration and template definition.
- Understand how these enhancements can boost developer productivity and maintainability.

## Prerequisites

Make sure you have completed [Session 2: Web Component from Scratch](../session2/readme.md). We will build upon the concepts and code from that session.

## Steps

### 1. Create the BasicComponent Class

The `BasicComponent` class will provide common logic for observed attributes and rendering, which can be extended by other web components.

In the `src` directory, create a new file named `basicComponent.ts`.

```bash
touch src/basicComponent.ts
```

Open `src/basicComponent.ts` and add the following code:

```typescript
export abstract class BasicComponent extends HTMLElement {
    
    get templateForRender() {
        return (this as any).template || "";
    }

	static get observedAttributes() {
		return this._observedAttributes || [];
	}

	private static _observedAttributes: string[] = [];

	static registerObservedAttribute(attribute: string) {
		if (!this._observedAttributes.includes(attribute)) {
			this._observedAttributes.push(attribute);
		}
	}

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
		if (oldValue !== newValue) {
            (this as any)[name] = newValue;
			this.render();
		}
	}

	connectedCallback() {
		this.render();
	}

	
	render() {
		if (this.shadowRoot) {
			this.shadowRoot.innerHTML = this.templateForRender;
            this.afterRender();
		}
	}

    protected afterRender() {
        // Override this method to do something after render
    }
	
}
```

We will create a decorator for property setters that registers the attribute for observation.

In the `src` directory, create a new file named `decorators.ts`.

```bash
touch src/decorators.ts
```

Open `src/decorators.ts` and add the following code:

```typescript
import { BasicComponent } from './basicComponent';

export function observedAttribute(target: BasicComponent, propertyKey: string) {
	const constructor = target.constructor as typeof BasicComponent;
	constructor.registerObservedAttribute(propertyKey);

	Object.defineProperty(target, propertyKey, {
		get() {
			return this.getAttribute(propertyKey);
		},
		set(value: string) {
			if (value) {
				this.setAttribute(propertyKey, value);
			} else {
				this.removeAttribute(propertyKey);
			}
		},
	});
}
```

### 3. Implement a Class Decorator for Component Registration

We will create a class decorator for component registration and template definition.

Open `src/decorators.ts` and add the following code:

```typescript
export function component(tagName: string, template: string) {
	return function (constructor: CustomElementConstructor) {
		constructor.prototype.template = template;
		customElements.define(tagName, constructor);
	};
}
```

### 4. Create an Enhanced HelloWorld Component

We will now create an enhanced `HelloWorld` component using the `BasicComponent` class and the decorators.

Open `src/helloWorld.ts` and modify it to use the `BasicComponent` class and decorators:

```typescript
import { BasicComponent } from './basicComponent';
import { observedAttribute, component } from './decorators';

@component('hello-world', `
	<div id="container"></div>
`)
export class HelloWorld extends BasicComponent {
	@observedAttribute
	name!: string;

	override afterRender() {
		if (this.shadowRoot) {
			const container = this.shadowRoot.getElementById('container');
			if (container) {
				container.textContent = this.name || 'Hello, World!';
			}
		}
	}
}
```

**Attention**: You have to activate experimentalDecorators in your Typescript-Config.

### 5. Create an Enhanced InputComponent

We will create an `InputComponent` that interacts with the `HelloWorld` component, using the `BasicComponent` class and decorators.

Open `src/inputComponent.ts` and modify it as follows:

```typescript
import { BasicComponent } from './basicComponent';
import { component } from './decorators';
import { HelloWorld } from './helloWorld';

@component('input-component', `
	<input type="text" placeholder="Enter greeting" />
`)
export class InputComponent extends BasicComponent {
	override afterRender() {
		if (this.shadowRoot) {
			const input = this.shadowRoot.querySelector('input');
			if (input) {
				input.addEventListener('input', this.onInputChange.bind(this));
			}
		}
	}

	onInputChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const helloWorldElement = document.querySelector('hello-world') as HelloWorld;

		if (helloWorldElement) {
			helloWorldElement.setAttribute('name', input.value);
		}
	}
}
```

### 6. Update the Entry Point to Use Both Components

Open `src/index.ts` and modify it to use the enhanced `HelloWorld` and `InputComponent` components:

```typescript
// src/index.ts

import './helloWorld';
import './inputComponent';

// Append the new elements to the body
document.body.innerHTML = `
<input-component></input-component>
<hr/>
<hello-world></hello-world>
`;
```

### 7. Serve the Project

Run the following command to serve the project and watch for changes:

```bash
npm run serve
```

Open your web browser and navigate to `http://localhost:10001` to see the enhanced `HelloWorld` and `InputComponent` in action.

## Conclusion

In this session, you learned how to create a `BasicComponent` class for Web Components with logic for observed attributes and rendering. You also implemented decorators for property setters and class registration, which streamline the development process. By leveraging these tools, you can boost developer productivity and maintainability in your projects.

## Self-Reflection Questions

1. **How does the `BasicComponent` class simplify the creation and management of Web Components?**
2. **What advantages do decorators offer in managing observed attributes and component registration?**
3. **How does the class decorator `@component` streamline the definition and registration of custom elements?**
4. **In what ways does the `@observedAttribute` decorator improve the handling of attribute changes in Web Components?**
5. **Reflecting on the implementation of the enhanced `HelloWorld` and `InputComponent`, how do these enhancements improve the development experience compared to the approach in Session 2?**
