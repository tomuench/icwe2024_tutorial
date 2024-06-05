
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
				<div>Hello ${this.getAttribute('name') || 'Hello, World!'}</div>
			`;
		}
	}
}

// Define the new element
customElements.define('hello-world', HelloWorld);