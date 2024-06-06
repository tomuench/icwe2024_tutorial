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