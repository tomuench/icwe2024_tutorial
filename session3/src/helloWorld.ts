
import { BasicComponent } from './basicComponent';
import { observedAttribute, component } from './decorators';

@component('hello-world', `
	<div id="container"></div>
`)
export class HelloWorld extends BasicComponent {
	@observedAttribute
	name!: string;

	render() {
		if (this.shadowRoot) {
			this.shadowRoot.innerHTML = this.templateForRender;
			const container = this.shadowRoot.getElementById('container');
			if (container) {
				container.textContent = this.name || 'Hello, World!';
			}
		}
	}
}