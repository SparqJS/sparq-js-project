# Sparq.js

**Sparq.js** is a lightweight, dependency-free, native JavaScript framework designed to accelerate and simplify modern web development. It combines a rich set of features into a single file so that you can build fast, static websites without the overhead of external libraries.

> **Note:** Although the core code internally reflects advanced functionalities (version 3.1 Ultimate Complete), this public release is presented as the initial version of the framework.

## Features

Sparq.js offers a modular architecture based on **12 key modules**:

1. **Module Registration**  
   A robust system to register and extend your application with custom modules.

2. **Components with Lifecycle**  
   Create reusable UI components with lifecycle hooks (`onInit`, `afterRender`, `onPropsChange`, `onDestroy`) for efficient DOM management.

3. **Reactive State Management**  
   Manage your app's state using a Proxy that automatically updates all subscribed components when changes occur.

4. **Routing Module (Hash & History)**  
   Define dynamic routes with support for parameters. Easily build single-page applications (SPAs) with hash- or history-based navigation.

5. **Dynamic Themes**  
   Quickly switch between themes by toggling CSS variables—no need for multiple stylesheets.

6. **Utilities Module**  
   Comes with built-in helper functions for HTTP requests (fetch), debounce, clipboard operations, and more.

7. **Advanced Animations**  
   Implement smooth visual effects such as fade, slide, scale, and rotate to enhance the user experience.

8. **Testing Module**  
   Run synchronous or asynchronous tests with built-in assertions to ensure your code's quality.

9. **Documentation Generator (docGen)**  
   Automatically extract and generate documentation from code comments, helping you maintain up-to-date technical docs.

10. **Events Module (Pub/Sub)**  
    Create a simple event bus system to enable inter-module communication via custom events.

11. **Storage Module**  
    Simplify the management of persistent data using APIs for `localStorage` or `sessionStorage`.

12. **Internationalization (i18n)**  
    Support multiple languages by easily adding translation phrases and switching locales on the fly.

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

1. **Include Sparq.js in your project**

   Simply add the script to your HTML:

   ```html
   <script src="sparq.js"></script>
   ```

2. **Initialize Sparq.js (Optional)**  
   You can configure Sparq.js by initializing it with your desired settings:

   ```javascript
   Sparq.init({
     theme: "light", // Set the initial theme
     router: true    // Enable hash-based routing
   });
   ```

3. **Utilize the Framework Modules**  
   Explore and combine the functionalities by invoking Sparq.js methods:

   ```javascript
   // Toggle between light and dark themes
   Sparq.toggleTheme("dark");

   // Format JavaScript code for readability
   const formattedCode = Sparq.formatCode("function test(){console.log('hello');}");
   console.log(formattedCode);

   // Minify the formatted code
   const minifiedCode = Sparq.minifyCode(formattedCode);
   console.log(minifiedCode);

   // Read and parse a file (CSV or JSON)
   const fileInput = document.getElementById("fileInput");
   Sparq.readFileAdvanced(fileInput.files[0]).then(content => console.log(content));

   // Compress an image with specified quality and scale
   const imageInput = document.getElementById("imageInput");
   Sparq.compressImage(imageInput.files[0], { quality: 0.7, scale: 0.5 })
     .then(blob => {
       const url = URL.createObjectURL(blob);
       console.log("Compressed image URL:", url);
     });
   ```

## Examples

Check out the [examples folder](https://github.com/SparqJS/sparq-js-project/tree/main/examples) in the repository for detailed usage examples and interactive demos.

## Live Demo

Visit our [Live Demo](https://glittering-blancmange-0b53f0.netlify.app/) to see Sparq.js in action!

## Documentation

For detailed documentation, please read our [Full Documentation](https://glittering-blancmange-0b53f0.netlify.app/doc).

## Contributing

Contributions are welcome! If you find a bug or have a suggestion, please open an issue or submit a pull request. Make sure your contributions align with the project's coding standards.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/SparqJS/sparq-js-project/blob/main/LICENSE) file for details.

---

Start building with Sparq.js today and simplify your web development process!

