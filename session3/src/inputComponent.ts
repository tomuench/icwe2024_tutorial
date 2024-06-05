import { BasicComponent } from './basicComponent';
import { component } from './decorators';
import { HelloWorld } from './helloWorld';

@component('input-component', `
	<input type="text" placeholder="Enter greeting" />
`)
export class InputComponent extends BasicComponent {
	render() {
		if (this.shadowRoot) {
			this.shadowRoot.innerHTML = this.templateForRender;
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