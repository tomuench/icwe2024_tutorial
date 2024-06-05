# Vanilla JS - PWA from Scratch

## Introduction
This guide provides step-by-step instructions for setting up a basic project using Rollup and TypeScript. The project setup includes initializing a Node.js project, installing dependencies, and configuring Rollup and TypeScript.

## Prerequisites
Node.js and npm installed on your machine.

## Chapter 1: Setup

### 1. Initialize the Node.js Project
Start by initializing a new Node.js project. Run the following command and provide the necessary details as prompted.

```bash 
npm init
```

When prompted, fill in the following details:


``` bash
name: ICWE2024 [Your-Name]
version: 1.0.0
description: Write what you want
scripts: []
```


### 2. Install Rollup
Install Rollup as a development dependency.

```bash 
npm install rollup --save-dev
```

### 3. Create Rollup Configuration
Create a file named `rollup.config.mjs` and add the following configuration:

```javascript
export default {
	input: 'src/index.ts',
	output: {
		file: 'public/index.js',
		format: 'es'
	}
};
```
### 4. Create TypeScript Configuration

Create a file named `tsconfig.json` and add the following configuration:

```json
{
    "compilerOptions": {
      "target": "ES2022",
      "module": "ES2022",
      "rootDir": "./src",
      "strict": true,
    }
}
```

### 5. Install TypeScript and Rollup Plugins

In this chapter, we focus on installing TypeScript and the necessary Rollup plugins to enable TypeScript compilation, HTML file generation, and serving the files via a local development server.

```bash
npm install tslib --save-dev
npm install rollup-plugin-typescript2 --save-dev
npm install @rollup/plugin-html --save-dev
npm install rollup-plugin-serve --save-dev
```

First, we need to install `tslib`, which is a runtime library for TypeScript. This library is essential for handling certain TypeScript features during runtime.

Next, we install `@rollup-plugin-typescript2`, a TypeScript plugin for Rollup. This plugin is essential for compiling TypeScript files within the Rollup build process. It offers several benefits such as faster builds, incremental compilation, and better error messages compared to other TypeScript Rollup plugins.

The `@rollup/plugin-html` plugin generates an HTML file to include the output script from the Rollup build. This plugin simplifies the process of creating an HTML file and ensures that the generated JavaScript file is correctly linked.

Finally, we install the `@rollup-plugin-serve plugin`, which serves the Rollup output files on a local development server. This is particularly useful for testing and development purposes, as it allows you to see your changes in real-time.

### 6. Update Rollup Configuration
In this chapter, we update the Rollup configuration to include the installed plugins. This configuration is crucial for enabling TypeScript compilation, HTML file generation, and serving files through a local development server.

First, we import the necessary plugins into our `rollup.config.mjs` file:


```javascript
import typescript from 'rollup-plugin-typescript2';
import html from '@rollup/plugin-html';
import serve from 'rollup-plugin-serve';

export default {
	input: 'src/index.ts',
	output: {
		file: 'public/index.js',
		format: 'es'
	},
	plugins: [
		typescript(),
		html(),
		serve('public'),
	]
};
```
The new plugins sections describes the order of used plugins. In our case:

- **typescript()**: This plugin compiles TypeScript files. By including this plugin, we ensure that all TypeScript files in the project are compiled into JavaScript according to the settings specified in `tsconfig.json`.
- **html()** : This plugin generates an `index.html` file that includes the index.js script produced by Rollup. This simplifies the process of linking the JavaScript output to an HTML file for testing and development purposes.
- **serve('public')**: This plugin serves the files in the public directory on a local server. By default, the server runs on port 10001, but you can specify different options if needed. This is useful for real-time development and testing, allowing you to view your changes in the browser immediately.

### 7. Add scripts for build and serve
Update the scripts section of your `package.json` file to include commands for building and serving the project.

```javascript
{
  "name": "ICWE2024",
  "version": "1.0.0",
  "description": "Write what you want",
  "scripts": {
    "build": "rollup -c rollup.config.mjs",
    "serve": "rollup -c rollup.config.mjs -w"
  },
  "devDependencies": {
    //...
  }
}
```

- **build**: This script runs Rollup using the configuration specified in rollup.config.mjs. It compiles the TypeScript files and generates the output JavaScript file in the public directory.

- **serve**: This script also runs Rollup but in watch mode (-w). This means Rollup will watch for changes in the source files and automatically rebuild the project. The serve plugin in the Rollup configuration will start a local development server to serve the files in the public directory.

Afterwards you can run these script in your shell:

```bash
npm run build
# or 
npm run serve
```


### 9. Add your first web component
First, ensure that you have a src directory in your project root. This directory will contain all your TypeScript source files. Inside the src directory, create a new TypeScript file named `helloWorld.ts`. This file will contain the code for our Hello World web component.

```bash
mkdir src
touch src/index.ts
touch src/helloWorld.ts
```

Open `src/helloWorld.ts` and add the following code:

```typescript
export class HelloWorld extends HTMLElement {
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `<h1>Hello, World!</h1>`;
	}
}

// Define the new element
customElements.define('hello-world', HelloWorld);
``` 

Inside the src directory, create another TypeScript file named index.ts. This file will serve as the entry point for our application. Open `src/index.ts` and add the following code to import and use the Hello World web component:

```typescript

import './helloWorld';

// Append the new element to the body
document.body.innerHTML = "<hello-world></hello-world>";
```

### 10. Start your project

Now serve your project and open your browser at `http://localhost:10001`.

### 11. Questions for self reflection
- Can you describe the role of each plugin (typescript, html, and serve) in the Rollup build pipeline and how they contribute to the overall build process?
- Why is it beneficial to define custom elements, like the Hello World web component, in separate files and import them into the main entry point?
- How do the build and serve scripts in package.json streamline the development workflow, and what advantages do they offer over manually running Rollup commands?
- What are the key advantages of using a module bundler like Rollup for a TypeScript project, particularly when developing web components?
- Reflecting on the process of setting up the Rollup configuration and creating a web component, what challenges did you encounter, and how did you overcome them?