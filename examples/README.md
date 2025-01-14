

# Sparq.js Examples

Welcome to the **Examples** folder for **Sparq.js**! This folder contains a variety of detailed, ultra-complete examples demonstrating the full range of Sparq.js features and modules. Use these examples as a learning resource and as starting templates to integrate Sparq.js into your own projects.

## Table of Contents

- [Introduction](#introduction)
- [Basic Usage Example](#basic-usage-example)
- [Component Module Example](#component-module-example)
- [Reactive State Example](#reactive-state-example)
- [Routing Example](#routing-example)
- [Dynamic Themes Example](#dynamic-themes-example)
- [Utilities Example](#utilities-example)
- [Advanced Animations Example](#advanced-animations-example)
- [Testing Module Example](#testing-module-example)
- [Documentation Generator Example](#documentation-generator-example)
- [Events (Pub/Sub) Example](#events-pubsub-example)
- [Storage and Internationalization (i18n) Example](#storage-and-internationalization-example)
- [Full Integration SPA Example](#full-integration-spa-example)

## Introduction

These examples cover the core modules of Sparq.js, including:

- **Module Registration & Components**  
- **Reactive State Management**  
- **Routing (Hash & History)**  
- **Dynamic Themes**  
- **Utilities for HTTP, Debounce & More**  
- **Advanced Animations**  
- **Testing & Documentation Generation**  
- **Events (Pub/Sub) Communication**  
- **Storage and Internationalization**

Each example is self-contained and designed to illustrate both individual modules as well as combined usage in an integrated Single Page Application (SPA).

## Basic Usage Example

Learn how to include and initialize Sparq.js, then explore basic features like code formatting, minification, and theme toggling.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Basic Sparq.js Example</title>
  <link rel="stylesheet" href="../styles.css">
  <script src="../sparq.js"></script>
</head>
<body>
  <h1>Basic Example</h1>
  <button id="toggleTheme">Toggle Theme</button>
  <script>
    // Toggle theme on button click (cycles between light and dark)
    document.getElementById("toggleTheme").addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
      const newTheme = currentTheme === "light" ? "dark" : "light";
      Sparq.toggleTheme(newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    });
    
    // Example usage of code formatting and minification
    const rawCode = "function hello(){console.log('Hello, world!');}";
    const formatted = Sparq.formatCode(rawCode);
    console.log("Formatted Code:", formatted);
    const minified = Sparq.minifyCode(formatted);
    console.log("Minified Code:", minified);
  </script>
</body>
</html>
```

## Component Module Example

This example demonstrates how to create, render, update, and destroy a component with lifecycle hooks.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Module Example</title>
  <link rel="stylesheet" href="../styles.css">
  <script src="../sparq.js"></script>
</head>
<body>
  <div id="component-container"></div>
  <button id="updateComponent">Update Component</button>
  <button id="destroyComponent">Destroy Component</button>
  <script>
    const componentModule = Sparq.getModule("component");

    // Create a component with lifecycle hooks
    const myComponent = componentModule.create(
      `<h2>{{title}}</h2><p>{{message}}</p>`,
      { title: "Hello", message: "This is a dynamic component." },
      {
        onInit: () => console.log("Component initializing..."),
        afterRender: (el) => console.log("Component rendered:", el),
        onPropsChange: (newProps) => console.log("Properties updated:", newProps),
        onDestroy: (el) => console.log("Component destroyed:", el)
      }
    );

    // Render the component into the container
    myComponent.render("#component-container");

    // Update component on button click
    document.getElementById("updateComponent").addEventListener("click", () => {
      myComponent.setProps({ title: "Updated Title", message: "The component has been updated!" });
      myComponent.render("#component-container");
    });

    // Destroy the component on button click
    document.getElementById("destroyComponent").addEventListener("click", () => {
      myComponent.destroy("#component-container");
    });
  </script>
</body>
</html>
```

## Reactive State Example

Initialize and subscribe to state changes to update your UI automatically.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reactive State Example</title>
  <link rel="stylesheet" href="../styles.css">
  <script src="../sparq.js"></script>
</head>
<body>
  <h1>Counter: <span id="counterDisplay">0</span></h1>
  <button id="increment">Increment Counter</button>
  <script>
    const stateModule = Sparq.getModule("state");
    stateModule.init({ counter: 0 });

    // Subscribe to state changes
    stateModule.subscribe((newState) => {
      document.getElementById("counterDisplay").textContent = newState.counter;
    });

    // Increment the counter on button click
    document.getElementById("increment").addEventListener("click", () => {
      const current = stateModule.get().counter;
      stateModule.update({ counter: current + 1 });
    });
  </script>
</body>
</html>
```

## Routing Example

Implement a simple Single Page Application (SPA) using the Routing module.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Routing Example</title>
  <link rel="stylesheet" href="../styles.css">
  <script src="../sparq.js"></script>
</head>
<body>
  <nav>
    <a href="#/">Home</a>
    <a href="#/about">About</a>
  </nav>
  <div id="content"></div>
  <script>
    const router = Sparq.getModule("router");
    
    // Home route
    router.add("/", () => {
      document.getElementById("content").innerHTML = "<h2>Home</h2><p>Welcome to the home page.</p>";
    });
    
    // About route
    router.add("/about", () => {
      document.getElementById("content").innerHTML = "<h2>About</h2><p>Learn more about Sparq.js.</p>";
    });
    
    // Initialize the router
    router.init();
  </script>
</body>
</html>
```

## Dynamic Themes Example

Switch themes dynamically by toggling CSS variables.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dynamic Themes Example</title>
  <link rel="stylesheet" href="../styles.css">
  <script src="../sparq.js"></script>
</head>
<body>
  <button id="toggleTheme">Toggle Theme</button>
  <script>
    const theme = Sparq.getModule("theme");
    
    // Define themes
    theme.add("dark", {
      "--color-bg": "#333",
      "--color-text": "#f1f1f1"
    });
    theme.add("light", {
      "--color-bg": "#fff",
      "--color-text": "#000"
    });
    
    // Set an initial theme
    let currentTheme = "light";
    theme.set(currentTheme);

    // Toggle theme on button click
    document.getElementById("toggleTheme").addEventListener("click", () => {
      currentTheme = currentTheme === "light" ? "dark" : "light";
      theme.set(currentTheme);
    });
  </script>
</body>
</html>
```

## Utilities Example

Demonstrate the use of helper functions for HTTP requests, debounce, and more.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Utilities Example</title>
  <link rel="stylesheet" href="../styles.css">
  <script src="../sparq.js"></script>
</head>
<body>
  <h1>Utilities Example</h1>
  <button id="delayedAction">Click Me (Debounced)</button>
  <script>
    const utils = Sparq.getModule("utils");
    
    // Example: Fetch JSON data from a demo API
    utils.fetchJSON("https://api.example.com/data")
      .then(data => console.log("Fetched data:", data))
      .catch(err => console.error(err));
    
    // Example: Debounce usage
    const debouncedAction = utils.debounce(() => {
      console.log("Debounced button action executed!");
    }, 300);

    document.getElementById("delayedAction").addEventListener("click", debouncedAction);
  </script>
</body>
</html>
```

## Advanced Animations Example

Animate elements using the Advanced Animations module.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Advanced Animations Example</title>
  <link rel="stylesheet" href="../styles.css">
  <script src="../sparq.js"></script>
</head>
<body>
  <div id="animationTarget" style="display:none; background: var(--color-accent); padding: 20px; margin: 20px;">
    Animated Element
  </div>
  <button id="startAnimation">Start Animation</button>
  <script>
    const animateModule = Sparq.getModule("animate");
    
    document.getElementById("startAnimation").addEventListener("click", () => {
      const element = document.getElementById("animationTarget");
      animateModule.fadeIn(element, 500);
    });
  </script>
</body>
</html>
```

## Testing Module Example

Run tests using the built-in Testing module.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Testing Example</title>
  <link rel="stylesheet" href="../styles.css">
  <script src="../sparq.js"></script>
</head>
<body>
  <h1>Testing Module Example</h1>
  <pre id="testResults"></pre>
  <script>
    const testModule = Sparq.getModule("test");

    // Add a simple test case
    testModule.add("Basic Math Test", ({ assertEquals, assertTrue }) => {
      const sum = 2 + 2;
      assertEquals(sum, 4, "2 + 2 should equal 4");
      assertTrue(sum === 4, "Sum must equal 4");
    });

    // Run tests (results appear in the console)
    testModule.run();
  </script>
</body>
</html>
```

## Documentation Generator Example

Automatically generate documentation from code comments using the docGen module.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Documentation Generator Example</title>
  <link rel="stylesheet" href="../styles.css">
  <script src="../sparq.js"></script>
</head>
<body>
  <h1>Documentation Generator (docGen) Example</h1>
  <pre id="docOutput"></pre>
  <script>
    const sourceCode = `
    /**
     * Adds two numbers together.
     * @param {number} a - The first number.
     * @param {number} b - The second number.
     * @returns {number} The sum of a and b.
     */
    function add(a, b) {
      return a + b;
    }
    `;
    const doc = Sparq.getModule("docGen").generateDoc(sourceCode);
    document.getElementById("docOutput").textContent = doc.join("\n\n");
  </script>
</body>
</html>
```

## Events (Pub/Sub) Example

Learn how to use the Events module for simple publish/subscribe communication.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Events Module Example</title>
  <link rel="stylesheet" href="../styles.css">
  <script src="../sparq.js"></script>
</head>
<body>
  <h1>Events (Pub/Sub) Example</h1>
  <button id="emitEvent">Emit Event</button>
  <script>
    const eventsModule = Sparq.getModule("events");

    // Subscribe to a custom event
    eventsModule.on("customEvent", (data) => {
      console.log("Received custom event data:", data);
    });

    // Emit the custom event on button click
    document.getElementById("emitEvent").addEventListener("click", () => {
      eventsModule.emit("customEvent", { message: "Hello from Sparq.js!" });
    });
  </script>
</body>
</html>
```

## Storage and Internationalization Example

Combine the Storage and i18n modules to store data and support multiple languages.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Storage and i18n Example</title>
  <link rel="stylesheet" href="../styles.css">
  <script src="../sparq.js"></script>
</head>
<body>
  <h1>Storage and Internationalization Example</h1>
  <script>
    // Storage example
    const storage = Sparq.getModule("storage");
    storage.setItem("user", { name: "Alice", age: 25 });
    const user = storage.getItem("user");
    console.log("User stored:", user);

    // Internationalization example
    const i18n = Sparq.getModule("i18n");
    i18n.add("en", { greeting: "Hello, World!" });
    i18n.add("es", { greeting: "¡Hola, Mundo!" });
    i18n.setLocale("en");
    console.log("Localized greeting:", i18n.t("greeting"));
  </script>
</body>
</html>
```

## Full Integration SPA Example

A comprehensive example that brings together multiple modules to create a fully functional Single Page Application (SPA).

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Full SPA Example</title>
  <link rel="stylesheet" href="../styles.css">
  <script src="../sparq.js"></script>
</head>
<body>
  <header>
    <nav>
      <a href="#/">Home</a>
      <a href="#/profile">Profile</a>
      <a href="#/settings">Settings</a>
    </nav>
  </header>
  <main>
    <div id="content"></div>
  </main>
  <footer>
    <p>&copy; 2025 Sparq. All rights reserved.</p>
  </footer>
  <script>
    // Initialize reactive state for the SPA
    const state = Sparq.getModule("state");
    state.init({ page: "home" });

    // Define routing for the SPA
    const router = Sparq.getModule("router");
    router.add("/", () => {
      state.update({ page: "home" });
      document.getElementById("content").innerHTML = "<h2>Home</h2><p>Welcome to the home page.</p>";
    });
    router.add("/profile", () => {
      state.update({ page: "profile" });
      document.getElementById("content").innerHTML = "<h2>Profile</h2><p>This is the profile page.</p>";
    });
    router.add("/settings", () => {
      state.update({ page: "settings" });
      document.getElementById("content").innerHTML = "<h2>Settings</h2><p>Manage your settings here.</p>";
    });
    router.init();

    // Example: Log page changes using the Events module
    const events = Sparq.getModule("events");
    state.subscribe((newState) => {
      events.emit("pageChanged", newState.page);
    });
    events.on("pageChanged", (page) => {
      console.log("Page changed to:", page);
    });
  </script>
</body>
</html>
```
