export class HelloWorld extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `<h1>Hello, World!</h1>`;
	}
}
// Define the new element
customElements.define('hello-world', HelloWorld);