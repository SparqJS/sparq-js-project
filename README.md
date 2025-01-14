# Sparq.js Project

Sparq.js is a lightweight and extensible JavaScript library designed to simplify common development tasks, from theme switching to file handling, code execution, image compression, and more.

## Key Features

1. **Extensibility with Modules**  
   Easily register and use custom modules with `Sparq.registerModule()`.

2. **Code Formatting and Minification**  
   Advanced tools for formatting and minifying JavaScript code with `Sparq.formatCode()` and `Sparq.minifyCode()`.

3. **Dynamic Code Execution**  
   Execute JavaScript code directly in the browser using `Sparq.runCode()` and `Sparq.runCodeWithContext()`.

4. **File Handling**  
   Read JSON, CSV, and text files with `Sparq.readFileAdvanced()`.

5. **Image Compression**  
   Compress images with adjustable quality and scaling using `Sparq.compressImage()`.

6. **Theme Switching**  
   Easily toggle between light and dark themes with `Sparq.toggleTheme()`.

7. **Dynamic Component Loading**  
   Load and inject HTML components dynamically into your app using `Sparq.loadComponent()`.

8. **Simple Hash-Based Router**  
   Implement a basic routing system with `Sparq.router`.

9. **Event Bus System**  
   A built-in publish/subscribe system for managing events with `Sparq.eventBus`.

10. **In-Memory Data Storage**  
    Manage temporary data storage using `Sparq.memoryDB`.

## Installation

Simply include `sparq.js` in your project:

```html
<script src="sparq.js"></script>
```

## Getting Started

Here's a basic example to use Sparq.js in your project:

```html
<script>
  // Toggle between light and dark themes
  Sparq.toggleTheme('light');
  
  // Format JavaScript code
  const formattedCode = Sparq.formatCode('function test(){console.log("Hello World");}');
  console.log('Formatted Code:', formattedCode);
</script>
```

## Contributions

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/SparqJS/sparq-js-project/issues).

## License

This project is licensed under the [MIT License](LICENSE).
