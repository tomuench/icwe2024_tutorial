/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

class BasicComponent extends HTMLElement {
    get templateForRender() {
        return this.template || "";
    }
    static get observedAttributes() {
        return this._observedAttributes || [];
    }
    static _observedAttributes = [];
    static registerObservedAttribute(attribute) {
        if (!this._observedAttributes.includes(attribute)) {
            this._observedAttributes.push(attribute);
        }
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this[name] = newValue;
            this.render();
        }
    }
    connectedCallback() {
        this.render();
    }
    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = this.templateForRender;
            this.afterRender();
        }
    }
    afterRender() {
        // Override this method to do something after render
    }
}

function observedAttribute(target, propertyKey) {
    const constructor = target.constructor;
    constructor.registerObservedAttribute(propertyKey);
    Object.defineProperty(target, propertyKey, {
        get() {
            return this.getAttribute(propertyKey);
        },
        set(value) {
            if (value) {
                this.setAttribute(propertyKey, value);
            }
            else {
                this.removeAttribute(propertyKey);
            }
        },
    });
}
function component(tagName, template) {
    return function (constructor) {
        constructor.prototype.template = template;
        customElements.define(tagName, constructor);
    };
}

let ButtonComponent = class ButtonComponent extends BasicComponent {
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
};
ButtonComponent = __decorate([
    component('custom-button', `
	<button><slot></slot></button>
`)
], ButtonComponent);

let InputFieldComponent = class InputFieldComponent extends BasicComponent {
    label;
    value;
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
    handleInputChange(event) {
        const input = event.target;
        this.value = input.value;
        this.dispatchEvent(new CustomEvent('input-change', {
            detail: { value: input.value },
            bubbles: true,
            composed: true,
        }));
    }
    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = this.templateForRender;
            const labelElement = this.shadowRoot.querySelector('#label');
            const inputElement = this.shadowRoot.querySelector('#input');
            if (labelElement)
                labelElement.textContent = this.label || '';
            if (inputElement)
                inputElement.value = this.value || '';
        }
    }
};
__decorate([
    observedAttribute
], InputFieldComponent.prototype, "label", void 0);
__decorate([
    observedAttribute
], InputFieldComponent.prototype, "value", void 0);
InputFieldComponent = __decorate([
    component('input-field', `
	<label id="label"></label>
	<input type="text" id="input"/>
`)
], InputFieldComponent);

let GreetingListComponent = class GreetingListComponent extends BasicComponent {
    greetings = [];
    currentValue = '';
    registerEvents() {
        const inputField = this.shadowRoot?.querySelector('#inputField');
        const addButton = this.shadowRoot?.querySelector('#addButton');
        addButton?.addEventListener('button-click', () => {
            const newGreeting = this.currentValue || '';
            if (newGreeting) {
                this.greetings.push(newGreeting);
                this.render();
                this.currentValue = '';
                inputField.value = '';
            }
        });
        inputField?.addEventListener('input-change', ((event) => {
            this.currentValue = event.detail.value;
        }));
    }
    renderList() {
        const list = this.shadowRoot?.querySelector('#list');
        if (list) {
            list.innerHTML = '';
            this.greetings.forEach(greeting => {
                const listItem = document.createElement('li');
                listItem.textContent = greeting;
                list.appendChild(listItem);
            });
        }
    }
    afterRender() {
        if (this.shadowRoot) {
            this.renderList();
            this.registerEvents();
        }
    }
};
GreetingListComponent = __decorate([
    component('greeting-list', `
	<div class="container">
		<input-field label="Enter greeting:" id="inputField"></input-field>
		<custom-button id="addButton">Add Greeting</custom-button>
		<ul id="list"></ul>
	</div>
`)
], GreetingListComponent);
