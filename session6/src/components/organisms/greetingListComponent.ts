
import { BasicComponent, component } from '../../basics/index';
import { ButtonComponent } from '../atoms/index';
import { InputChangeData, InputFieldComponent } from '../molecules/index';

@component('greeting-list', `
	<div class="container">
		<input-field label="Enter greeting:" id="inputField"></input-field>
		<custom-button id="addButton">Add Greeting</custom-button>
		<ul id="list"></ul>
	</div>
`)
export class GreetingListComponent extends BasicComponent {
    greetings: string[] = [];

    currentValue: string = '';

    private registerEvents() {
        const inputField = this.shadowRoot?.querySelector('#inputField') as InputFieldComponent;
        const addButton = this.shadowRoot?.querySelector('#addButton') as ButtonComponent;

        addButton?.addEventListener('button-click', () => {
            const newGreeting = this.currentValue || '';
            if (newGreeting) {
                this.greetings.push(newGreeting);
                this.render();
                this.currentValue = '';
                inputField.value = '';
            }
        });

        inputField?.addEventListener('input-change', ((event: CustomEvent<InputChangeData>) => {
           this.currentValue = event.detail.value;
        }) as EventListener);
    }

    private renderList() {
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

    override afterRender() {
        if (this.shadowRoot) {
            this.renderList();
            this.registerEvents();
        }
    }
}