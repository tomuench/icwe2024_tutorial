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

export function component(tagName: string, template: string) {
	return function (constructor: CustomElementConstructor) {
		constructor.prototype.template = template;
		customElements.define(tagName, constructor);
	};
}