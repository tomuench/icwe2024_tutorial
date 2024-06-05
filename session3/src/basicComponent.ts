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

	abstract render(): void;
}