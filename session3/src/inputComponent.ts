
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

customElements.define('input-component', InputComponent);