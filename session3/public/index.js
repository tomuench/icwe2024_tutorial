class HelloWorld extends HTMLElement {
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
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(newValue);
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

class InputComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.render();
        this.shadowRoot?.querySelector('input')?.addEventListener('input', this.onInputChange.bind(this));
    }
    onInputChange(event) {
        console.log("HELLO");
        const input = event.target;
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
customElements.define('input-component', InputComponent);

// Append the new element to the body
document.body.innerHTML = `
<input-component></input-component>
<hr/>
<hello-world></hello-world>
`;
