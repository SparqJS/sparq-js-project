"use strict";

/**
 * Sparq.js - Core Framework Mejorado
 * Versión 3.1 Ultimate Completo con Extensiones Brutales
 *
 * Módulos incluidos:
 * 1. Registro de Módulos
 * 2. Componentes (con Lifecycle)
 * 3. Estado Reactivo (Proxy)
 * 4. Ruteo (Hash y History)
 * 5. Temas Dinámicos (CSS Variables)
 * 6. Utilidades
 * 7. Animaciones Avanzadas
 * 8. Testing
 * 9. Generador de Documentación (docGen)
 * 10. Eventos (Pub/Sub)
 * 11. Almacenamiento (localStorage/sessionStorage)
 * 12. Internacionalización (i18n)
 * 
 * --- Extensiones Brutales ---
 * 13. Gestión de Formularios
 * 14. WebSockets nativos
 * 15. Soporte para Worker Threads
 * 16. Editor de Markdown con Previsualización
 * 17. Motor de Plantillas Avanzado
 * 18. Motor de Cache Dinámica
 * 19. Generador de Sitios Estáticos
 * 20. Renderizado Universal (SSR)
 * 21. Módulo de Gráficos y Visualización
 * 22. CLI (Interfaz de Línea de Comandos)
 */

/* ---------------------------------------------------------------------- */
/* Registro de Módulos                                                    */
/* ---------------------------------------------------------------------- */
const Sparq = (() => {
  const modules = {};
  function registerModule(name, factory) {
    if (modules[name]) {
      console.warn(`[Sparq] Módulo "${name}" ya existe. Se sobreescribirá.`);
    }
    modules[name] = factory();
  }
  function getModule(name) {
    return modules[name];
  }
  return { registerModule, getModule };
})();

/* ---------------------------------------------------------------------- */
/* 1. Módulo de Componentes con Lifecycle                                 */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("component", () => {
  function create(template, props = {}, hooks = {}) {
    return {
      render(target) {
        const el = document.querySelector(target);
        if (!el) throw new Error(`[Sparq:component] Target "${target}" no encontrado.`);
        if (hooks.onInit) hooks.onInit();
        let html = template;
        Object.keys(props).forEach(key => {
          const re = new RegExp(`{{\\s*${key}\\s*}}`, "g");
          html = html.replace(re, props[key]);
        });
        el.innerHTML = html;
        if (hooks.afterRender) hooks.afterRender(el);
      },
      setProps(newProps) {
        Object.assign(props, newProps);
        if (hooks.onPropsChange) hooks.onPropsChange(props);
      },
      destroy(target) {
        const el = document.querySelector(target);
        if (el && hooks.onDestroy) hooks.onDestroy(el);
        if (el) el.innerHTML = "";
      }
    };
  }
  return { create };
});

/* ---------------------------------------------------------------------- */
/* 2. Módulo de Estado Reactivo usando Proxy                              */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("state", () => {
  const listeners = new Set();
  let state = {};
  
  const handler = {
    set(target, prop, value) {
      target[prop] = value;
      listeners.forEach(fn => fn({ ...target }));
      return true;
    }
  };
  
  function init(initialState = {}) {
    state = new Proxy(Object.assign({}, initialState), handler);
  }
  function subscribe(listener) {
    if (typeof listener !== "function") throw new Error("[Sparq:state] Listener debe ser una función.");
    listeners.add(listener);
  }
  function unsubscribe(listener) {
    listeners.delete(listener);
  }
  function update(newState) {
    Object.keys(newState).forEach(key => state[key] = newState[key]);
  }
  function get() {
    return { ...state };
  }
  return { init, subscribe, unsubscribe, update, get };
});

/* ---------------------------------------------------------------------- */
/* 3. Módulo de Ruteo (Hash & History) con parámetros                      */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("router", () => {
  const routes = [];
  
  function add(path, callback) {
    const paramNames = [];
    const regexPath = path.replace(/:([\w]+)/g, (_, key) => {
      paramNames.push(key);
      return "([^\\/]+)";
    });
    const regex = new RegExp(`^${regexPath}$`);
    routes.push({ regex, paramNames, callback, path });
  }
  
  function _loadRoute(current) {
    for (let route of routes) {
      const match = current.match(route.regex);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        route.callback(params);
        return;
      }
    }
    console.error(`[Sparq:router] Ruta no encontrada: "${current}"`);
  }
  
  function init(options = { mode: "hash" }) {
    if (options.mode === "history") {
      window.onpopstate = () => {
        const current = window.location.pathname;
        _loadRoute(current);
      };
      _loadRoute(window.location.pathname);
    } else {
      function loadRoute() {
        const current = location.hash.slice(1) || "/";
        _loadRoute(current);
      }
      window.addEventListener("hashchange", loadRoute);
      loadRoute();
    }
  }
  
  function navigate(path) {
    if (window.history && history.pushState) {
      history.pushState(null, null, path);
      if (window.location.pathname === path) _loadRoute(path);
    } else {
      location.hash = path;
    }
  }
  
  return { add, init, navigate };
});

/* ---------------------------------------------------------------------- */
/* 4. Módulo de Temas Dinámicos                                           */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("theme", () => {
  const themes = {};
  function add(name, variables) {
    themes[name] = variables;
  }
  function set(name) {
    const theme = themes[name];
    if (!theme) throw new Error(`[Sparq:theme] Tema "${name}" no encontrado.`);
    Object.keys(theme).forEach(key => {
      document.documentElement.style.setProperty(key, theme[key]);
    });
  }
  return { add, set };
});

/* ---------------------------------------------------------------------- */
/* 5. Módulo de Utilidades                                                */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("utils", () => {
  async function fetchJSON(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`[Sparq:utils] Error al obtener ${url}`);
    return await response.json();
  }
  
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }
  
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    } else {
      const input = document.createElement("textarea");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      return Promise.resolve();
    }
  }
  
  function mergeObjects(...objs) {
    return Object.assign({}, ...objs);
  }
  
  return { fetchJSON, debounce, copyToClipboard, mergeObjects };
});

/* ---------------------------------------------------------------------- */
/* 6. Módulo de Animaciones Avanzadas                                      */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("animate", () => {
  function fadeIn(element, duration = 300) {
    if (!(element instanceof HTMLElement)) {
      console.error("[Sparq:animate] fadeIn: Element no válido.");
      return;
    }
    element.style.opacity = 0;
    element.style.display = "block";
    const start = performance.now();
    function step(timestamp) {
      const progress = (timestamp - start) / duration;
      element.style.opacity = Math.min(progress, 1);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function fadeOut(element, duration = 300) {
    if (!(element instanceof HTMLElement)) {
      console.error("[Sparq:animate] fadeOut: Element no válido.");
      return;
    }
    const start = performance.now();
    function step(timestamp) {
      const progress = (timestamp - start) / duration;
      element.style.opacity = Math.max(1 - progress, 0);
      if (progress < 1) requestAnimationFrame(step);
      else element.style.display = "none";
    }
    requestAnimationFrame(step);
  }
  function slideIn(element, duration = 300, from = "left") {
    if (!(element instanceof HTMLElement)) {
      console.error("[Sparq:animate] slideIn: Element no válido.");
      return;
    }
    element.style.display = "block";
    element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
    element.style.opacity = 0;
    let initialTransform;
    switch (from) {
      case "left": initialTransform = "translateX(-100%)"; break;
      case "right": initialTransform = "translateX(100%)"; break;
      case "top": initialTransform = "translateY(-100%)"; break;
      case "bottom": initialTransform = "translateY(100%)"; break;
      default: initialTransform = "translateX(-100%)";
    }
    element.style.transform = initialTransform;
    requestAnimationFrame(() => {
      element.style.opacity = 1;
      element.style.transform = "translateX(0) translateY(0)";
    });
  }
  function scaleIn(element, duration = 300) {
    if (!(element instanceof HTMLElement)) {
      console.error("[Sparq:animate] scaleIn: Element no válido.");
      return;
    }
    element.style.display = "block";
    element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
    element.style.opacity = 0;
    element.style.transform = "scale(0.5)";
    requestAnimationFrame(() => {
      element.style.opacity = 1;
      element.style.transform = "scale(1)";
    });
  }
  function rotateIn(element, duration = 500, degrees = 360) {
    if (!(element instanceof HTMLElement)) {
      console.error("[Sparq:animate] rotateIn: Element no válido.");
      return;
    }
    element.style.display = "block";
    element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
    element.style.opacity = 0;
    element.style.transform = `rotate(0deg)`;
    requestAnimationFrame(() => {
      element.style.opacity = 1;
      element.style.transform = `rotate(${degrees}deg)`;
    });
  }
  return { fadeIn, fadeOut, slideIn, scaleIn, rotateIn };
});

/* ---------------------------------------------------------------------- */
/* 7. Módulo de Testing (Test Runner)                                      */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("test", () => {
  const tests = [];
  function add(name, fn) {
    tests.push({ name, fn });
  }
  function assertEquals(actual, expected, message = "") {
    if (actual !== expected) {
      throw new Error(`Assertion Failed: ${message} | Expected: ${expected}, Got: ${actual}`);
    }
  }
  function assertTrue(value, message = "") {
    if (!value) {
      throw new Error(`Assertion Failed: ${message} | Expected true, Got: ${value}`);
    }
  }
  async function run() {
    let passed = 0, failed = 0;
    console.log("=== Sparq Testing ===");
    for (let test of tests) {
      try {
        const result = test.fn({ assertEquals, assertTrue });
        if (result instanceof Promise) await result;
        console.log(`✔  ${test.name}`);
        passed++;
      } catch (err) {
        console.error(`✖  ${test.name}`, err);
        failed++;
      }
    }
    console.log(`\nTests completados. Aprobados: ${passed}, Fallados: ${failed}`);
  }
  return { add, run, assertEquals, assertTrue };
});

/* ---------------------------------------------------------------------- */
/* 8. Módulo de Generador de Documentación (docGen)                         */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("docGen", () => {
  function generateDoc(sourceCode) {
    const docBlocks = sourceCode.match(/\/\*\*([\s\S]*?)\*\//g) || [];
    return docBlocks.map(block => block.replace(/\/\*\*|\*\//g, "").trim());
  }
  return { generateDoc };
});

/* ---------------------------------------------------------------------- */
/* 9. Módulo de Eventos (Pub/Sub)                                          */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("events", () => {
  const events = {};
  function on(eventName, listener) {
    if (!events[eventName]) events[eventName] = [];
    events[eventName].push(listener);
  }
  function off(eventName, listener) {
    if (!events[eventName]) return;
    events[eventName] = events[eventName].filter(l => l !== listener);
  }
  function emit(eventName, data) {
    if (!events[eventName]) return;
    events[eventName].forEach(listener => listener(data));
  }
  return { on, off, emit };
});

/* ---------------------------------------------------------------------- */
/* 10. Módulo de Almacenamiento (Storage)                                  */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("storage", () => {
  function setItem(key, value, storageType = "local") {
    const storage = storageType === "session" ? sessionStorage : localStorage;
    storage.setItem(key, JSON.stringify(value));
  }
  function getItem(key, storageType = "local") {
    const storage = storageType === "session" ? sessionStorage : localStorage;
    const item = storage.getItem(key);
    try {
      return JSON.parse(item);
    } catch (e) {
      return item;
    }
  }
  function removeItem(key, storageType = "local") {
    const storage = storageType === "session" ? sessionStorage : localStorage;
    storage.removeItem(key);
  }
  function clear(storageType = "local") {
    const storage = storageType === "session" ? sessionStorage : localStorage;
    storage.clear();
  }
  return { setItem, getItem, removeItem, clear };
});

/* ---------------------------------------------------------------------- */
/* 11. Módulo de Internacionalización (i18n)                               */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("i18n", () => {
  const translations = {};
  let currentLocale = "en";
  function add(locale, phrases) {
    translations[locale] = { ...(translations[locale] || {}), ...phrases };
  }
  function setLocale(locale) {
    currentLocale = locale;
  }
  function t(key) {
    return translations[currentLocale] && translations[currentLocale][key] ? translations[currentLocale][key] : key;
  }
  return { add, setLocale, t };
});

/* ================================
   EXTENSIONES BRUTALES PARA SPARQ.JS
   ================================ */

/* ---------------------------------------------------------------------- */
/* 12. Módulo de Gestión de Formularios                                  */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("form", () => {
  /**
   * Crea un manejador de formularios con validación en tiempo real.
   * @param {string} formSelector - Selector del formulario.
   * @param {object} rules - Objeto con reglas de validación para cada input.
   *                         Ej: { email: { rule: /^\S+@\S+\.\S+$/, message: "Email inválido" } }
   * @param {object} options - Opciones adicionales (por ejemplo, idioma para mensajes a través de i18n).
   */
  function createForm(formSelector, rules = {}, options = {}) {
    const form = document.querySelector(formSelector);
    if (!form) throw new Error(`[Sparq:form] Formulario "${formSelector}" no encontrado.`);
    
    const inputs = form.querySelectorAll("input, textarea, select");
    
    // Función de validación
    function validateField(field) {
      const fieldName = field.name;
      const ruleObj = rules[fieldName];
      if (!ruleObj) return true;
      const value = field.value;
      let isValid = true;
      if (ruleObj.rule instanceof RegExp) {
        isValid = ruleObj.rule.test(value);
      } else if (typeof ruleObj.rule === "function") {
        isValid = ruleObj.rule(value);
      }
      // Mostrar u ocultar mensaje de error
      let errorEl = field.nextElementSibling;
      if (!errorEl || !errorEl.classList.contains("sparq-error")) {
        errorEl = document.createElement("div");
        errorEl.classList.add("sparq-error");
        field.parentNode.insertBefore(errorEl, field.nextSibling);
      }
      errorEl.textContent = isValid ? "" : (options.i18n ? Sparq.getModule("i18n").t(ruleObj.message) : ruleObj.message);
      return isValid;
    }
    
    // Agregar eventos de validación
    inputs.forEach(input => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => validateField(input));
    });
    
    // Función para validar todo el formulario
    function validate() {
      let valid = true;
      inputs.forEach(input => {
        if (!validateField(input)) valid = false;
      });
      return valid;
    }
    
    // Permitir ejecutar callback on submit
    form.addEventListener("submit", (e) => {
      if (!validate()) {
        e.preventDefault();
      }
    });
    
    return { validate, form };
  }
  
  return { createForm };
});

/* ---------------------------------------------------------------------- */
/* 13. Módulo de WebSockets nativos                                      */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("websocket", () => {
  /**
   * Crea una conexión WebSocket y permite suscribirse a eventos.
   * @param {string} url - URL del servidor WebSocket.
   */
  function connect(url) {
    const ws = new WebSocket(url);
    const listeners = {};
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const eventName = data.event;
        if (listeners[eventName]) {
          listeners[eventName].forEach(fn => fn(data.payload));
        }
      } catch (e) {
        console.error("[Sparq:websocket] Error parseando mensaje", e);
      }
    };
    
    function on(eventName, callback) {
      if (!listeners[eventName]) listeners[eventName] = [];
      listeners[eventName].push(callback);
    }
    
    function send(eventName, payload) {
      ws.send(JSON.stringify({ event: eventName, payload }));
    }
    
    return { ws, on, send };
  }
  
  return { connect };
});

/* ---------------------------------------------------------------------- */
/* 14. Módulo de Soporte para Worker Threads                             */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("worker", () => {
  /**
   * Crea y comunica con un Web Worker.
   * @param {string} scriptURL - Ruta al script del worker.
   * @param {function} onMessage - Callback para procesar mensajes del worker.
   */
  function create(scriptURL, onMessage) {
    if (typeof Worker === "undefined") {
      throw new Error("[Sparq:worker] Web Workers no son soportados en este entorno.");
    }
    const worker = new Worker(scriptURL);
    worker.onmessage = (e) => {
      if (onMessage) onMessage(e.data);
    };
    function post(message) {
      worker.postMessage(message);
    }
    function terminate() {
      worker.terminate();
    }
    return { worker, post, terminate };
  }
  return { create };
});

/* ---------------------------------------------------------------------- */
/* 15. Módulo de Editor de Markdown                                      */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("markdown", () => {
  /**
   * Convierte texto Markdown a HTML utilizando reglas simples.
   * Nota: Para casos complejos se recomienda integrar una librería externa.
   * @param {string} md - Texto en Markdown.
   */
  function render(md) {
    let html = md;
    // Encabezados
    html = html.replace(/^###### (.*$)/gim, "<h6>$1</h6>");
    html = html.replace(/^##### (.*$)/gim, "<h5>$1</h5>");
    html = html.replace(/^#### (.*$)/gim, "<h4>$1</h4>");
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
    // Negrita y cursiva
    html = html.replace(/\*\*\*(.*?)\*\*\*/gim, "<b><i>$1</i></b>");
    html = html.replace(/\*\*(.*?)\*\*/gim, "<b>$1</b>");
    html = html.replace(/\*(.*?)\*/gim, "<i>$1</i>");
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');
    // Líneas
    html = html.replace(/\n$/gim, "<br/>");
    return html.trim();
  }
  
  /**
   * Renderiza y actualiza en vivo un editor Markdown.
   * @param {string} inputSelector - Selector del textarea de entrada.
   * @param {string} previewSelector - Selector del contenedor de previsualización.
   */
  function livePreview(inputSelector, previewSelector) {
    const inputEl = document.querySelector(inputSelector);
    const previewEl = document.querySelector(previewSelector);
    if (!inputEl || !previewEl) throw new Error("[Sparq:markdown] Elementos no encontrados.");
    inputEl.addEventListener("input", () => {
      previewEl.innerHTML = render(inputEl.value);
    });
  }
  
  return { render, livePreview };
});

/* ---------------------------------------------------------------------- */
/* 16. Módulo de Motor de Plantillas Avanzado                             */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("template", () => {
  /**
   * Renderiza una plantilla con directivas básicas:
   * - {{key}} para sustitución simple.
   * - {{#if condition}}...{{/if}} para condicionales.
   * - {{#each array}}...{{/each}} para bucles.
   * @param {string} tmpl - Cadena de plantilla.
   * @param {object} data - Datos para renderizar.
   */
  function render(tmpl, data) {
    // Reemplazo de variables simples
    tmpl = tmpl.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
      return data[key] !== undefined ? data[key] : "";
    });
    
    // Condicionales simples (solo soporta true/false)
    tmpl = tmpl.replace(/{{#if\s+(\w+)\s*}}([\s\S]*?){{\/if}}/g, (_, key, content) => {
      return data[key] ? content : "";
    });
    
    // Bucle simple
    tmpl = tmpl.replace(/{{#each\s+(\w+)\s*}}([\s\S]*?){{\/each}}/g, (_, key, content) => {
      if (Array.isArray(data[key])) {
        return data[key].map(item => {
          // Permite acceso a propiedades vía {{prop}} en el contexto de cada elemento
          return content.replace(/{{\s*(\w+)\s*}}/g, (match, prop) => {
            return item[prop] !== undefined ? item[prop] : "";
          });
        }).join("");
      }
      return "";
    });
    
    return tmpl;
  }
  return { render };
});

/* ---------------------------------------------------------------------- */
/* 17. Módulo de Motor de Cache Dinámica                                 */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("cache", () => {
  /**
   * Cache en memoria con expiración configurable.
   */
  const cacheStore = {};
  
  function set(key, value, ttl = 30000) { // ttl en milisegundos
    const expires = Date.now() + ttl;
    cacheStore[key] = { value, expires };
  }
  
  function get(key) {
    const cached = cacheStore[key];
    if (!cached) return null;
    if (Date.now() > cached.expires) {
      delete cacheStore[key];
      return null;
    }
    return cached.value;
  }
  
  function remove(key) {
    delete cacheStore[key];
  }
  
  function clear() {
    Object.keys(cacheStore).forEach(key => delete cacheStore[key]);
  }
  
  return { set, get, remove, clear };
});

/* ---------------------------------------------------------------------- */
/* 18. Módulo de Generador de Sitios Estáticos (SSG)                       */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("ssg", () => {
  /**
   * Genera contenido HTML estático a partir de rutas definidas.
   * Nota: Este módulo está pensado para ejecutarse en entornos Node.js o mediante scripts de build.
   * @param {Array} routes - Array de objetos { path, component }.
   */
  function generate(routes) {
    // En un entorno real se generaría archivos en disco.
    routes.forEach(route => {
      // Simulación de renderizado a HTML
      const content = typeof route.component === "function" ? route.component() : "";
      console.log(`Generando ${route.path}:\n${content}\n---`);
    });
  }
  
  return { generate };
});

/* ---------------------------------------------------------------------- */
/* 19. Módulo de Renderizado Universal (SSR)                              */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("ssr", () => {
  /**
   * Renderiza un componente a una cadena HTML.
   * Se espera que el componente tenga un método render que devuelva HTML.
   * @param {object} component - Componente con método render.
   */
  function renderComponent(component) {
    if (typeof component.render !== "function") {
      throw new Error("[Sparq:ssr] Componente inválido, no tiene método render.");
    }
    return component.render();
  }
  
  return { renderComponent };
});

/* ---------------------------------------------------------------------- */
/* 20. Módulo de Gráficos y Visualización                                */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("charts", () => {
  /**
   * Crea un gráfico simple (soporta 'line', 'bar' y 'pie') en un canvas.
   * Nota: Este es un ejemplo básico y se recomienda usar librerías dedicadas para gráficos complejos.
   * @param {string} canvasSelector - Selector del elemento canvas.
   * @param {object} config - Configuración del gráfico.
   */
  function createChart(canvasSelector, config) {
    const canvas = document.querySelector(canvasSelector);
    if (!canvas || !canvas.getContext) throw new Error("[Sparq:charts] Canvas no válido.");
    const ctx = canvas.getContext("2d");
    // Limpieza previa
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Ejemplo muy básico: solo dibuja texto según el tipo de gráfico.
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#333";
    ctx.fillText(`Gráfico ${config.type}`, 10, 30);
    // Aquí se podrían implementar gráficos dibujando en el canvas.
  }
  return { createChart };
});

/* ---------------------------------------------------------------------- */
/* 21. Módulo de CLI (Interfaz de Línea de Comandos)                       */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("cli", () => {
  /**
   * Estos métodos están pensados para ejecutarse en Node.js.
   * Se simulan comandos básicos: init, build y dev.
   */
  function init(projectName) {
    console.log(`Inicializando nuevo proyecto Sparq: ${projectName}`);
    // Aquí se generarían archivos y carpetas mínimas.
  }
  function build() {
    console.log("Construyendo y optimizando recursos...");
    // Aquí se ejecutarían tareas de build y empaquetado.
  }
  function dev() {
    console.log("Iniciando servidor de desarrollo local...");
    // Aquí se podría iniciar un servidor local (por ejemplo, con http-server o similar).
  }
  return { init, build, dev };
});

/* ---------------------------------------------------------------------- */
/* Exportación Global (opcional)                                          */
/* ---------------------------------------------------------------------- */
// En entornos de módulos se puede exportar la API de Sparq:
// export default Sparq;
