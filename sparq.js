"use strict";

/**
 * Sparq.js - Core Framework
 * Versión 3.1 Ultimate Completo
 * 
 * Incluye:
 * 1. Registro de Módulos
 * 2. Módulo de Componentes (con lifecycle)
 * 3. Módulo de Estado Reactivo (con Proxy)
 * 4. Módulo de Ruteo Hash y History (con parámetros múltiples)
 * 5. Módulo de Temas Dinámicos (CSS Variables)
 * 6. Módulo de Utilidades (fetch, debounce, clipboard, etc.)
 * 7. Módulo de Animaciones Avanzadas (fade, slide, scale, rotate)
 * 8. Módulo de Testing (sincronía/asíncrono, aserciones)
 * 9. Módulo de Documentación (docGen real)
 * 10. Módulo de Eventos (Pub/Sub)
 * 11. Módulo de Almacenamiento (localStorage/sessionStorage)
 * 12. Módulo de i18n (Internacionalización)
 */

// Registro de Módulos
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
/* 1. Módulo de Componentes con Lifecycle                                */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("component", () => {
  // Permite definir componentes con hooks de ciclo de vida
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
/* 2. Módulo de Estado Reactivo usando Proxy                             */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("state", () => {
  // Estado interno y listeners
  const listeners = new Set();
  let state = {};
  
  // Proxy para interceptar cambios
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
/* 3. Módulo de Ruteo (Hash & History) con parámetros                     */
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
      // Inicialización
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
/* 5. Módulo de Utilidades                                               */
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
/* 6. Módulo de Animaciones Avanzadas                                     */
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
/* 7. Módulo de Testing (Test Runner)                                     */
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
/* 8. Módulo de Generador de Documentación (docGen)                        */
/* ---------------------------------------------------------------------- */
Sparq.registerModule("docGen", () => {
  function generateDoc(sourceCode) {
    const docBlocks = sourceCode.match(/\/\*\*([\s\S]*?)\*\//g) || [];
    return docBlocks.map(block => block.replace(/\/\*\*|\*\//g, "").trim());
  }
  return { generateDoc };
});

/* ---------------------------------------------------------------------- */
/* 9. Módulo de Eventos (Pub/Sub)                                         */
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
/* 10. Módulo de Almacenamiento (Storage)                                 */
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
/* 11. Módulo de Internacionalización (i18n)                              */
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

/* ---------------------------------------------------------------------- */
/* Exportación Global (opcional)                                          */
/* ---------------------------------------------------------------------- */
// Para entornos de módulo, se puede exportar.
// export default Sparq;
