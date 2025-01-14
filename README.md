# Sparq.js

**Sparq.js** is a lightweight JavaScript utility library designed to simplify common development tasks in modern web projects. It offers advanced features like code formatting, minification, file management, image compression, and more, all in a single, dependency-free file.

## Features

- **Code Formatting and Minification**: Format and minify JavaScript code directly in the browser.
- **File Management**: Read and parse CSV/JSON files with ease.
- **Image Compression**: Compress images on the client-side with adjustable quality and scaling.
- **Theme Switching**: Toggle between light and dark themes dynamically.
- **Hash-based Router**: Create single-page application (SPA) routes with hash navigation.
- **Event Bus**: Publish and subscribe to custom events efficiently.
- **In-memory Database**: Store and manage temporary data in a lightweight, session-based memory structure.

## Installation

### Option 1: Download Locally
Download the `sparq.js` file from the repository and include it in your project:

```html
<script src="sparq.js"></script>
```

### Option 2: Direct CDN Link
Use the CDN JSDELIVR link to include Sparq.js directly in your project:

```html
<script src="https://cdn.jsdelivr.net/gh/SparqJS/sparq-js-project@main/sparq.js"></script>
```

> **Note:** Using the raw link from GitHub is not recommended for production environments. For better performance and reliability, consider hosting the file on a CDN or your own server.

## Usage

1. **Include Sparq.js in your project**
   ```html
   <script src="sparq.js"></script>
   ```

2. **Initialize Sparq.js**
   Optionally, you can initialize Sparq.js with configurations:
   ```javascript
   Sparq.init({
     theme: "light", // Set initial theme
     router: true     // Enable hash-based routing
   });
   ```

3. **Use the provided utilities**
   Explore the features by calling Sparq.js methods:

   ```javascript
   // Toggle between light and dark themes
   Sparq.toggleTheme("dark");

   // Format JavaScript code
   const formattedCode = Sparq.formatCode("function test(){console.log('hello');}");
   console.log(formattedCode);

   // Minify JavaScript code
   const minifiedCode = Sparq.minifyCode(formattedCode);
   console.log(minifiedCode);

   // Read a file (e.g., CSV or JSON)
   const fileInput = document.getElementById("fileInput");
   Sparq.readFileAdvanced(fileInput.files[0]).then(content => console.log(content));

   // Compress an image
   const imageInput = document.getElementById("imageInput");
   Sparq.compressImage(imageInput.files[0], { quality: 0.7, scale: 0.5 }).then(blob => {
     const url = URL.createObjectURL(blob);
     console.log("Compressed image URL:", url);
   });
   ```

## Examples

Visit the [examples folder](https://github.com/SparqJS/sparq-js-project/tree/main/examples) in the repository to see detailed usage examples and interactive demos.

## Contributing

Contributions are welcome! If you find a bug or have a suggestion, please open an issue or submit a pull request. Ensure your code adheres to the project's coding standards.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/SparqJS/sparq-js-project/blob/main/LICENSE) file for details.

---

Start building with Sparq.js today and simplify your web development process!

