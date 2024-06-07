# Session 5: Offline-Ready Progressive Web App

## Introduction

In this session, we will transform our web application into an Offline-Ready Progressive Web App (PWA). We will implement PWA features such as service workers and caching to ensure the application works offline. Additionally, we will explore the principles of building resilient web apps.

## Objectives

- Implement PWA features such as service workers and caching.
- Ensure the application works offline.
- Understand the principles of building resilient web apps.

## Prerequisites

Make sure you have completed [Session 4: Connecting Web Components to a Page](../session4/readme.md). We will build upon the concepts and code from that session.

## Steps

### 1. Create a Service Worker

A service worker is a script that runs in the background and helps manage network requests and caching. We will create a service worker that caches the necessary files for our application to work offline.

#### Step 1.1: Create the Service Worker File

Create a new file named `serviceWorker.ts` in the `src` directory.

```bash
touch src/serviceWorker.ts
```

Open `src/serviceWorker.js` and add the following code:

```javascript
const CACHE_NAME = 'greeting-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.js',
  // Add other assets to cache here
];

// Install the service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate the service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch requests and serve from cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
```

#### Step 1.2: Extend RollupJS BuildScript

Our service worker must be published as a single file and not bundled as our existing `index.js`. Therefore, we have to modify our `rollup.config.mjs`.

```javascript
import typescript from 'rollup-plugin-typescript2';
import serve from 'rollup-plugin-serve';
import copy from 'rollup-plugin-copy';

export default [
  // Output ServiceWorker
	{
		input: 'src/serviceWorker.ts',
		output: {
			file: 'public/serviceWorker.js',
			format: 'es'
		},
		plugins: [
			typescript(),
		]
	},
  // Previous Application
	{
	input: 'src/index.ts',
	output: {
		file: 'public/index.js',
		format: 'es'
	},
	plugins: [
		typescript(),
		copy({
			targets: [
			  { src: 'src/pages/*', dest: 'public/' },
			]
		  }),
		serve('public'),
	]
}];

```


### 2. Register the Service Worker

To use the service worker, we need to register it in our application. We will do this in our main JavaScript file.

#### Step 2.1: Update the Entry Point

Open `src/index.ts` and add the following code to register the service worker:

```typescript
// src/index.ts

import './components/organisms/greetingListComponent';

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceWorker.js').then((registration) => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, (error) => {
      console.log('ServiceWorker registration failed: ', error);
    });
  });
}
```

### 3. Update the HTML Page

Ensure that our HTML page includes the necessary meta tags for PWA features and links to the service worker.

#### Step 3.1: Update the HTML Page

Open `public/index.html` and modify it to include meta tags and the updated script source:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Greeting List</title>
  <link rel="manifest" href="manifest.json"> <!-- Not existing yet !-->
  <meta name="theme-color" content="#6200ea">
  <script type="module" src="index.js"></script>
</head>
<body>
  <div class="container">
    <h1>Greeting List Application</h1>
    <p>Welcome to the Greeting List Application! This application demonstrates the use of web components following Atomic Design principles. You can enter a greeting message in the input field and click the "Add Greeting" button to add it to the list below. This example showcases how web components can be composed to build complex and reusable UI elements.</p>
    <greeting-list id="greetingList"></greeting-list>
  </div>
</body>
</html>
```

### 4. Create a Web App Manifest

The web app manifest provides metadata about the web application and is essential for PWA features such as installability.

#### Step 4.1: Create the Manifest File

Create a new file named `manifest.json` in the `src/pages` directory.

```bash
touch src/pages/manifest.json
```

Open `src/pages/manifest.json` and add the following code:

```json
{
  "name": "Greeting List Application",
  "short_name": "GreetingApp",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#6200ea",
  "description": "A simple greeting list application demonstrating the use of web components and PWA features.",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 5. Add Icons for the PWA

PWA requires icons for different sizes. Create an `icons` directory inside the `src/pages` directory and add icon images.

#### Step 5.1: Create Icons Directory and Add Icons

Create the `icons` directory and add icon images (e.g., `icon-192.png` and `icon-512.png`). 

```bash
mkdir -p src/pages/icons
# Add your icon images to the public/icons directory
# Alternativly: We provided some icons for you.
```

### 6. Build and Serve the Project

Use the scripts created in Session 1 to serve the project.

Run the following command to serve the project and watch for changes:

```bash
npm run serve
```

Open your web browser and navigate to `http://localhost:10001` to see the PWA in action. You should be able to install the app to your home screen and use it offline.

### 7. Test Offline Functionality

To test the offline functionality:

1. Open the application in your browser.
2. Open the Developer Tools (F12).
3. Go to the Application tab.
4. In the Service Workers section, check the box for "Offline" under "Service Workers".
5. Refresh the page and verify that the application works offline.

## Conclusion

In this session, you learned how to transform your web application into an Offline-Ready Progressive Web App (PWA). You implemented PWA features such as service workers and caching to ensure the application works offline. Additionally, you explored the principles of building resilient web apps. These skills will help you create more robust and user-friendly web applications.

## Self-Reflection Questions

1. **What is the role of a service worker in a Progressive Web App (PWA)?**
2. **How does caching improve the performance and offline capabilities of a web application?**
3. **What are the key components of a web app manifest, and why are they important?**
4. **What steps are involved in registering a service worker, and how does it enhance the functionality of a web application?**
5. **How can the principles and techniques learned in this session be applied to improve the resilience and user experience of other web applications?**
