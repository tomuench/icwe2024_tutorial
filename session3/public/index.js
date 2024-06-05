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
        customElements.define(tagName, constructor);
        constructor.prototype.template = template;
    };
}

let HelloWorld = class HelloWorld extends BasicComponent {
    name;
    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = this.templateForRender;
            const container = this.shadowRoot.getElementById('container');
            if (container) {
                container.textContent = this.name || 'Hello, World!';
            }
        }
    }
};
__decorate([
    observedAttribute
], HelloWorld.prototype, "name", void 0);
HelloWorld = __decorate([
    component('hello-world', `
	<div id="container"></div>
`)
], HelloWorld);

let InputComponent = class InputComponent extends BasicComponent {
    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = this.templateForRender;
            const input = this.shadowRoot.querySelector('input');
            if (input) {
                input.addEventListener('input', this.onInputChange.bind(this));
            }
        }
    }
    onInputChange(event) {
        const input = event.target;
        const helloWorldElement = document.querySelector('hello-world');
        if (helloWorldElement) {
            helloWorldElement.setAttribute('name', input.value);
        }
    }
};
InputComponent = __decorate([
    component('input-component', `
	<input type="text" placeholder="Enter greeting" />
`)
], InputComponent);

// Append the new element to the body
document.body.innerHTML = `
<input-component></input-component>
<hr/>
<hello-world></hello-world>
`;
