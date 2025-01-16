
# Sparq.js

**Sparq.js** is a lightweight, dependency-free, native JavaScript framework designed to accelerate and simplify modern web development. It combines a rich set of features into a single file so you can build fast, static websites without the overhead of external libraries.

> **Note:** Although the internal core reflects advanced functionalities (version **3.1 Ultimate Complete** with extended modules), this public release is presented as the initial version of the framework.

## Features

Sparq.js offers a modular architecture based on **22 modules**:

### Core Modules

1. **Module Registration**  
   A robust system to register and extend your application with custom modules.

2. **Components with Lifecycle**  
   Create reusable UI components with lifecycle hooks (`onInit`, `afterRender`, `onPropsChange`, `onDestroy`) for efficient DOM management.

3. **Reactive State Management**  
   Manage your app's state using a Proxy that automatically updates all subscribed components when changes occur.

4. **Routing Module (Hash & History)**  
   Define dynamic routes with support for parameters. Easily build single-page applications (SPAs) using hash- or history-based navigation.

5. **Dynamic Themes**  
   Quickly switch between themes by toggling CSS variables—no need for multiple stylesheets.

6. **Utilities Module**  
   Built-in helper functions for HTTP requests (fetch), debounce, clipboard operations, and more.

7. **Advanced Animations**  
   Implement smooth visual effects such as fade, slide, scale, and rotate to enhance the user experience.

8. **Testing Module**  
   Run synchronous or asynchronous tests with built-in assertions to ensure your code's quality.

9. **Documentation Generator (docGen)**  
   Automatically extract and generate documentation from code comments to keep your technical docs up-to-date.

10. **Events Module (Pub/Sub)**  
    Create a simple event bus system to enable inter-module communication via custom events.

11. **Storage Module**  
    Simplify the management of persistent data using APIs for `localStorage` or `sessionStorage`.

12. **Internationalization (i18n)**  
    Support multiple languages by easily adding translation phrases and switching locales on the fly.

### Extended Modules

13. **Form Management Module**  
    Advanced form validation with customizable rules and real-time error handling, seamlessly integrated with i18n.

14. **Native WebSockets Module**  
    Establish real-time communication with built-in WebSocket support and event-based interactions.

15. **Worker Threads Support**  
    Offload heavy tasks by integrating Web Workers, with a simple API for parallel script execution.

16. **Markdown Editor with Live Preview**  
    Render Markdown to HTML in real time, allowing you to build rich text editors with instant preview.

17. **Advanced Templating Engine**  
    Render templates with support for conditionals and loops through simple directives like `if` and `each`.

18. **Dynamic Cache Engine**  
    Cache HTTP responses and intensive calculations in memory with configurable expiration times.

19. **Static Site Generator (SSG)**  
    Convert Sparq.js projects into pre-rendered static websites ready for deployment.

20. **Server-Side Rendering (SSR)**  
    Export components and pages as pre-rendered HTML to enable basic server-side rendering.

21. **Charts and Visualization Module**  
    Create interactive charts and visualizations (line, bar, pie, etc.) using basic canvas drawing functions.

22. **CLI Tool**  
    A command-line interface to initialize projects, build resources, and start a development server.

## Installation

### Option 1: Download Locally
Download the `sparq.js` file from the repository and include it in your project:

```html
<script src="sparq.js"></script>
```

### Option 2: Direct CDN Link
Include Sparq.js directly in your project via the CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/SparqJS/sparq-js-project@refs/heads/main/sparq.js"></script>
```

## Usage

1. **Include Sparq.js in your Project**  
   Add the script to your HTML:

   ```html
   <script src="sparq.js"></script>
   ```

2. **Initialize Sparq.js (Optional)**  
   Configure Sparq.js to set the initial theme, enable routing, or customize other settings:

   ```javascript
   Sparq.init({
     theme: "light", // Set the initial theme
     router: true    // Enable hash-based routing
   });
   ```

3. **Utilize the Framework Modules**  
   Combine and use functionalities by invoking methods from the various modules:

   ```javascript
   // Toggle between themes
   Sparq.toggleTheme("dark");

   // Render a template using the advanced templating engine
   const template = "<h1>{{title}}</h1><p>{{content}}</p>";
   const data = { title: "Welcome", content: "Hello, world!" };
   const rendered = Sparq.getModule("template").render(template, data);
   console.log(rendered);

   // Listen and emit custom events
   const events = Sparq.getModule("events");
   events.on("customEvent", (data) => console.log("Event received:", data));
   events.emit("customEvent", { message: "Hello from Sparq.js!" });
   ```

## Examples

Explore the [examples folder](https://github.com/SparqJS/sparq-js-project/tree/main/examples) in the repository for detailed usage examples and interactive demos.

## Our Website

Visit our [Official Website](https://glittering-blancmange-0b53f0.netlify.app/) to learn more about Sparq.js!

## Documentation

For full documentation on every module and feature, please refer to our [Full Documentation](https://glittering-blancmange-0b53f0.netlify.app/doc).

## Contributing

Contributions are welcome! If you find a bug or have suggestions, please open an issue or submit a pull request. Make sure your contributions align with the project's coding standards.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/SparqJS/sparq-js-project/blob/main/LICENSE) file for details.

---

Start building with Sparq.js today and simplify your web development process!
```
