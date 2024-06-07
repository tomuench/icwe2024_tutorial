# Session 6: Routing and Storing Data

## Introduction

In this session, we will focus on building a client-side multi-page application with routing, and learn how to store data using local storage. We will manage state within our Progressive Web App (PWA) and use server-side includes to manage multiple HTML files. By the end of this session, you will understand how to implement multi-page routing, persist data, and manage state in a web application.

## Objectives

- Implement client-side routing for a multi-page application.
- Use local storage for data persistence.
- Manage state within a PWA.

## Prerequisites

Make sure you have completed [Session 5: Offline-Ready Progressive Web App](../session5/readme.md). We will build upon the concepts and code from that session.

## Steps

### 1. Create Views

Create different HTML files for our multi-page application.

#### Step 1.1: Create another greetings View

Create a new file named `greetings.html` in the `public/views` directory.

```bash
touch src/pages/greetings.html
```

Open `src/pages/greetings.html` and add the following code:

```html
<!-- public/views/greetings.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Greetings</title>
  <link rel="stylesheet" href="../styles.css">
  <script type="module" src="../greetings.js" defer></script>
</head>
<body>
  <div class="container">
    <h1>Greetings</h1>
    <p>Manage your other greetings over here.</p>
    <greeting-list id="greetingList"></greeting-list>
    <p><a href="home.html">Go to Home</a></p>
  </div>
</body>
</html>
```

### 3. Create Entry Scripts for Views

Create JavaScript entry files for each view.

#### Step 3.1: Create Entry Script for Home View

Create a new file named `home.js` in the `public` directory.

```bash
touch public/home.js
```

Open `public/home.js` and add the following code:

```javascript
// public/home.js

// This script can be empty or contain specific logic for the home view
```

#### Step 3.2: Create Entry Script for Greetings View

Create a new file named `greetings.js` in the `public` directory.

```bash
touch public/greetings.js
```

Open `public/greetings.js` and add the following code:

```javascript
// public/greetings.js

import '../src/components/organisms/greetingListComponent.js';
```

### 4. Create Greeting List Component with Local Storage

We will update the `GreetingListComponent` to use local storage for storing and retrieving greetings.

#### Step 4.1: Update Greeting List Component

Open `src/components/organisms/greetingListComponent.ts` and modify it:

```typescript
// src/components/organisms/greetingListComponent.ts

import { BasicComponent } from '../../basicComponent';
import { component } from '../../decorators';
import '../atoms/buttonComponent';
import '../molecules/inputFieldComponent';

@component('greeting-list', `
  <style>
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    ul {
      list-style-type: none;
      padding: 0;
      width: 100%;
      max-width: 400px;
    }
    li {
      background: #f4f4f4;
      margin: 5px 0;
      padding: 10px;
      border-radius: 4px;
    }
  </style>
  <div class="container">
    <input-field label="Enter greeting:" id="inputField"></input-field>
    <custom-button id="addButton">Add Greeting</custom-button>
    <ul id="list"></ul>
  </div>
`)
export class GreetingListComponent extends BasicComponent {
  greetings: string[] = [];

  connectedCallback() {
    super.connectedCallback();
    const inputField = this.shadowRoot?.querySelector('#inputField') as InputFieldComponent;
    const addButton = this.shadowRoot?.querySelector('#addButton') as ButtonComponent;

    addButton.addEventListener('button-click', () => {
      const newGreeting = inputField.value || '';
      if (newGreeting) {
        this.greetings.push(newGreeting);
        this.render();
        localStorage.setItem('greetings', JSON.stringify(this.greetings));
        inputField.value = '';
      }
    });

    inputField.addEventListener('input-change', (event: CustomEvent) => {
      const value = event.detail.value;
      inputField.setAttribute('value', value);
    });

    this.greetings = JSON.parse(localStorage.getItem('greetings') || '[]');
    this.render();
  }

  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.template;
      const list = this.shadowRoot.querySelector('#list');
      if (list) {
        list.innerHTML = '';
        this.greetings.forEach(greeting => {
          const listItem = document.createElement('li');
          listItem.textContent = greeting;
          list.appendChild(listItem);
        });
      }
    }
  }
}
```

### 5. Update the HTML Page with Server-Side Includes

To manage multiple HTML files efficiently, we can use server-side includes (SSI). Make sure your server supports SSI (e.g., Apache or Nginx).

#### Step 5.1: Update the Home HTML Page

Open `public/views/home.html` and add the following code at the top:

```html
<!--#include virtual="/header.html" -->
```

#### Step 5.2: Update the Greetings HTML Page

Open `public/views/greetings.html` and add the following code at the top:

```html
<!--#include virtual="/header.html" -->
```

#### Step 5.3: Create the Header Include

Create a new file named `header.html` in the `public` directory.

```bash
touch public/header.html
```

Open `public/header.html` and add the following code:

```html
<!-- public/header.html -->
<nav>
  <ul>
    <li><a href="/views/home.html">Home</a></li>
    <li><a href="/views/greetings.html">Greetings</a></li>
  </ul>
</nav>
```

### 6. Update Styles

Create a CSS file to style the application.

#### Step 6.1: Create Styles File

Create a new file named `styles.css` in the `public` directory.

```bash
touch public/styles.css
```

Open `public/styles.css` and add the following code:

```css
/* public/styles.css */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f9f9f9;
}
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h1 {
  text-align: center;
  color: #333;
}
p {
  font-size: 16px;
  color: #666;
}
nav ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
}
nav ul li {
  display: inline;
}
nav ul li a {
  text-decoration: none;
  color: #6200ea;
}
```

### 7. Build and Serve the Project

Use the scripts created in Session 1 to build and serve the project.

#### Build the Project

Run the following command to build the project:

```bash
npm run build
```

#### Serve the Project

Ensure your server supports SSI and serve the project. If using a simple HTTP server for development, you can use a tool like `http-server` which supports SSI.

```bash
npm install -g http-server
http-server -c-1 --proxy http://localhost:8080
```

Open your web browser and navigate to `http://localhost:8080/views/home.html` to see the multi-page application with routing and data persistence in action.

## Conclusion

In this session, you learned how to implement client-side routing for a multi-page application using multiple HTML files and server-side includes

. You also learned how to use local storage for data persistence and manage state within a Progressive Web App (PWA). These skills will help you create more dynamic, responsive, and resilient web applications.

## Self-Reflection Questions

1. **What are the benefits of using multiple HTML files for a multi-page application?**
2. **How does local storage help in persisting data across sessions?**
3. **What is the role of server-side includes in managing multiple HTML files efficiently?**
4. **What challenges did you encounter when implementing routing and data persistence, and how did you overcome them?**
5. **How can the principles and techniques learned in this session be applied to improve the functionality and user experience of other web applications?**

Reflecting on these questions will help you understand the key concepts and practical implementations covered in this session.