
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