// sparq.js - Versión avanzada con observaciones integradas
// ¡Pegar tal cual en un archivo .js!

(function(global) {
    "use strict";
  
    // Evita sobrescribir si ya existe un global Sparq
    if (global.Sparq) {
      console.warn("[Sparq] A global Sparq object already exists. Using existing object.");
      return;
    }
  
    /**
     * Objeto principal Sparq.
     * @namespace
     */
    const Sparq = {
  
      /********************************************************
       * 1) EXTENSIBILIDAD Y MODULARIDAD
       ********************************************************/
      modules: {},
      /**
       * Registra módulos (plugins) personalizados.
       * @param {string} name - Nombre del módulo.
       * @param {Function} factory - Retorna un objeto con métodos.
       */
      registerModule(name, factory) {
        if (typeof name !== 'string' || typeof factory !== 'function') {
          throw new Error("registerModule error: invalid parameters.");
        }
        this.modules[name] = factory();
        console.log(`[Sparq] Module "${name}" registered successfully.`);
      },
  
      /********************************************************
       * 2) FORMATEO DE CÓDIGO (ANÁLISIS BÁSICO)
       ********************************************************/
      /**
       * Formatea código JS con indentación, sin romper strings/comentarios.
       * @param {string} code
       * @returns {string} Código formateado
       */
      formatCode(code) {
        if (typeof code !== "string") {
          return "[Sparq.formatCode] Error: input must be a string.";
        }
        const tokens = [];
        let current = "";
        let inString = false;
        let stringChar = null;
        let inComment = false;
        let commentType = "";
        let indentLevel = 0;
  
        const pushToken = (tk) => {
          if (tk.trim()) {
            tokens.push(tk);
          } else if (tk.includes("\n")) {
            tokens.push("\n");
          }
        };
  
        for (let i = 0; i < code.length; i++) {
          const c = code[i];
          const next = code[i + 1] || "";
  
          // Comentarios
          if (!inString && !inComment && c === "/" && (next === "/" || next === "*")) {
            inComment = true;
            commentType = (next === "/") ? "line" : "block";
            pushToken(current);
            current = c;
            continue;
          }
          if (inComment) {
            current += c;
            if (commentType === "line" && c === "\n") {
              pushToken(current);
              current = "";
              inComment = false;
              commentType = "";
            } else if (commentType === "block" && c === "*" && next === "/") {
              current += "/";
              i++;
              pushToken(current);
              current = "";
              inComment = false;
              commentType = "";
            }
            continue;
          }
  
          // Strings
          if (!inString && (c === '"' || c === "'")) {
            pushToken(current);
            current = c;
            inString = true;
            stringChar = c;
            continue;
          } else if (inString && c === stringChar) {
            current += c;
            pushToken(current);
            current = "";
            inString = false;
            stringChar = null;
            continue;
          }
          if (inString) {
            current += c;
            continue;
          }
  
          // Llaves y operadores
          if ("{};=+-*/<>!".includes(c)) {
            pushToken(current);
            current = "";
            if (c === '{') {
              tokens.push("{\n");
              indentLevel++;
              tokens.push("  ".repeat(indentLevel));
              continue;
            } else if (c === '}') {
              indentLevel = Math.max(0, indentLevel - 1);
              tokens.push("\n" + "  ".repeat(indentLevel) + "}\n");
              tokens.push("  ".repeat(indentLevel));
              continue;
            } else if (c === ';') {
              tokens.push(";\n" + "  ".repeat(indentLevel));
              continue;
            } else {
              tokens.push(` ${c} `);
              continue;
            }
          }
  
          // Saltos de línea
          if (c === "\n") {
            pushToken(current);
            current = "";
            tokens.push("\n" + "  ".repeat(indentLevel));
            continue;
          }
  
          current += c;
        }
        pushToken(current);
  
        return tokens.join("")
          .replace(/\s+\n/g, "\n")
          .replace(/\n\s+/g, "\n" + "  ".repeat(indentLevel));
      },
  
      /********************************************************
       * 3) MINIFICACIÓN AVANZADA (RESPETA STRINGS)
       ********************************************************/
      /**
       * Minifica código JS sin romper strings ni comentarios esenciales.
       * @param {string} code
       * @returns {string} Código minificado
       */
      minifyCode(code) {
        if (typeof code !== "string") {
          return "[Sparq.minifyCode] Error: input must be string.";
        }
        let result = "";
        let inString = false;
        let stringChar = "";
  
        for (let i = 0; i < code.length; i++) {
          const c = code[i];
          const next = code[i + 1] || "";
  
          if (!inString && (c === '"' || c === "'")) {
            inString = true;
            stringChar = c;
            result += c;
            continue;
          } else if (inString && c === stringChar) {
            inString = false;
            stringChar = "";
            result += c;
            continue;
          }
          if (inString) {
            result += c;
            continue;
          }
  
          // Comentarios
          if (c === "/" && next === "/") {
            while (i < code.length && code[i] !== "\n") i++;
            continue;
          }
          if (c === "/" && next === "*") {
            i += 2;
            while (i < code.length - 1 && !(code[i] === "*" && code[i + 1] === "/")) i++;
            i++;
            continue;
          }
  
          // Espacios redundantes
          if (/\s/.test(c)) {
            if (!/\s/.test(next) && next !== "") {
              result += " ";
            }
            continue;
          }
          result += c;
        }
        return result.trim();
      },
  
      /********************************************************
       * 4) CODE RUNNER (JS PURO)
       ********************************************************/
      /**
       * Ejecuta código JS usando new Function. Devuelve error detallado.
       * @param {string} code
       * @returns {Object} { success: boolean, result?: any, error?: string }
       */
      runCode(code) {
        if (typeof code !== 'string') {
          return { success: false, error: "[Sparq.runCode] Code must be a string." };
        }
        try {
          const func = new Function(code);
          const res = func();
          return { success: true, result: res };
        } catch (e) {
          return { success: false, error: e.message };
        }
      },
  
      /**
       * Ejecuta JS con un contexto de variables inyectadas.
       * @param {string} code
       * @param {Object} context
       * @returns {Object} { success: boolean, result?: any, error?: string }
       */
      runCodeWithContext(code, context = {}) {
        if (typeof code !== "string") {
          return { success: false, error: "[Sparq.runCodeWithContext] code must be a string." };
        }
        const paramNames = Object.keys(context);
        const paramValues = Object.values(context);
        try {
          const func = new Function(...paramNames, code);
          const res = func(...paramValues);
          return { success: true, result: res };
        } catch (e) {
          return { success: false, error: e.message };
        }
      },
  
      /********************************************************
       * 5) MANEJO DE ARCHIVOS: CSV/JSON, GUARDAR, COMPRIMIR IMAGEN
       ********************************************************/
      readFileAdvanced(fileInput) {
        return new Promise((resolve, reject) => {
          if (!(fileInput instanceof File)) {
            return reject("[Sparq.readFileAdvanced] not a File object.");
          }
          const reader = new FileReader();
          reader.onload = function(e) {
            let content = e.target.result;
            if (fileInput.name.endsWith(".csv")) {
              const rows = content.split("\n").filter(r => r.trim() !== "");
              const headers = rows[0].split(",").map(h => h.trim());
              const data = rows.slice(1).map(row => {
                const values = row.split(",").map(v => v.trim());
                return headers.reduce((acc, header, idx) => {
                  acc[header] = values[idx];
                  return acc;
                }, {});
              });
              return resolve(data);
            }
            if (fileInput.name.endsWith(".json")) {
              try {
                return resolve(JSON.parse(content));
              } catch (err) {
                console.warn("[Sparq.readFileAdvanced] Invalid JSON, returning raw text.");
              }
            }
            resolve(content);
          };
          reader.onerror = (err) => reject("[Sparq.readFileAdvanced] " + err.message);
          reader.readAsText(fileInput);
        });
      },
  
      saveFile(content, filename) {
        if (typeof content !== "string") {
          console.error("[Sparq.saveFile] content must be string.");
          return;
        }
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename || "download.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
  
      compressImage(imageFile, opts = {}) {
        return new Promise((resolve, reject) => {
          if (!(imageFile instanceof File)) {
            return reject("[Sparq.compressImage] not a File.");
          }
          const quality = typeof opts.quality === "number" ? opts.quality : 0.7;
          const scale = typeof opts.scale === "number" ? opts.scale : 0.5;
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              canvas.width = img.width * scale;
              canvas.height = img.height * scale;
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              canvas.toBlob(blob => {
                resolve(blob);
              }, "image/jpeg", quality);
            };
            img.onerror = (err) => reject("[Sparq.compressImage] Image load error: " + err.message);
          };
          reader.onerror = (err) => reject("[Sparq.compressImage] File reading error: " + err.message);
          reader.readAsDataURL(imageFile);
        });
      },
  
      /********************************************************
       * 6) TEMAS DINÁMICOS
       ********************************************************/
      themes: {
        light: { "--bg-color": "white", "--text-color": "black" },
        dark: { "--bg-color": "black", "--text-color": "white" }
      },
      applyTheme(themeName) {
        const themeVars = this.themes[themeName];
        if (!themeVars) {
          console.warn(`[Sparq] Theme "${themeName}" not found, skipping.`);
          return;
        }
        Object.keys(themeVars).forEach(key => {
          document.documentElement.style.setProperty(key, themeVars[key]);
        });
      },
      toggleTheme(theme) {
        // Si existe un tema con ese nombre, lo aplicamos
        if (this.themes[theme]) {
          this.applyTheme(theme);
        } else {
          // fallback: set data-theme
          document.documentElement.setAttribute("data-theme", theme);
        }
      },
  
      /********************************************************
       * 7) CARGA DINÁMICA DE COMPONENTES
       ********************************************************/
      loadComponent(url, elementId) {
        if (typeof url !== 'string' || typeof elementId !== 'string') {
          console.error("[Sparq.loadComponent] invalid params");
          return;
        }
        if (!("fetch" in window)) {
          console.warn("[Sparq.loadComponent] fetch not supported in this browser.");
          return;
        }
        fetch(url)
          .then(res => {
            if (!res.ok) {
              throw new Error("Network response was not ok: " + res.statusText);
            }
            return res.text();
          })
          .then(html => {
            const container = document.getElementById(elementId);
            if (!container) {
              console.error(`[Sparq.loadComponent] container "${elementId}" not found.`);
              return;
            }
            container.innerHTML = html;
          })
          .catch(err => console.error("[Sparq.loadComponent] error:", err.message));
      },
  
      /********************************************************
       * 8) ENRUTADOR HASH
       ********************************************************/
      router: {
        routes: {},
        register(path, callback) {
          if (typeof path !== "string" || typeof callback !== "function") {
            console.error("[Sparq.router.register] invalid params");
            return;
          }
          this.routes[path] = callback;
        },
        init() {
          window.addEventListener("hashchange", () => this.resolve());
          this.resolve();
        },
        resolve() {
          const hashPath = window.location.hash || "#/";
          // ignorar query (p.e. #/home?query=1)
          const routeKey = hashPath.split("?")[0];
          const route = this.routes[routeKey];
          if (route) {
            route();
          } else {
            console.warn(`[Sparq.router] No route found for "${hashPath}"`);
          }
        }
      },
  
      /********************************************************
       * 9) EVENT BUS (publish/subscribe)
       ********************************************************/
      eventBus: {
        events: {},
        on(eventName, callback) {
          if (!this.events[eventName]) this.events[eventName] = [];
          this.events[eventName].push(callback);
        },
        emit(eventName, data) {
          if (!this.events[eventName]) return;
          this.events[eventName].forEach(fn => fn(data));
        },
        off(eventName, callback) {
          if (!this.events[eventName]) return;
          this.events[eventName] = this.events[eventName].filter(fn => fn !== callback);
        }
      },
  
      /********************************************************
       * 10) LOCALSTORAGE CONFIG
       ********************************************************/
      config: {
        save(key, value) {
          if (!key || typeof key !== "string") {
            console.error("[Sparq.config.save] invalid key");
            return;
          }
          try {
            localStorage.setItem(key, JSON.stringify(value));
          } catch (e) {
            console.error("[Sparq.config.save] error:", e.message);
          }
        },
        load(key) {
          if (!key || typeof key !== "string") {
            console.error("[Sparq.config.load] invalid key");
            return null;
          }
          try {
            return JSON.parse(localStorage.getItem(key));
          } catch (e) {
            console.error("[Sparq.config.load] error:", e.message);
            return null;
          }
        },
        clear(key) {
          if (!key || typeof key !== "string") {
            console.error("[Sparq.config.clear] invalid key");
            return;
          }
          try {
            localStorage.removeItem(key);
          } catch (e) {
            console.error("[Sparq.config.clear] error:", e.message);
          }
        }
      },
  
      /********************************************************
       * [EXTRA 1] WATCH LOCAL CHANGES (STORAGE, BEFOREUNLOAD)
       ********************************************************/
      watchLocalChanges(callback) {
        if (typeof callback !== "function") {
          console.error("[Sparq.watchLocalChanges] callback must be function.");
          return;
        }
        window.addEventListener("storage", (e) => {
          callback({ type: "storage", event: e });
        });
        window.addEventListener("beforeunload", () => {
          callback({ type: "unload", message: "Window is unloading" });
        });
      },
  
      /********************************************************
       * [EXTRA 2] PREVIEW HTML (STRING -> DOM)
       ********************************************************/
      previewHTML(htmlString, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
          console.error("[Sparq.previewHTML] container not found:", containerId);
          return;
        }
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = htmlString;
        container.innerHTML = "";
        container.appendChild(tempDiv);
      },
  
      /********************************************************
       * [EXTRA 3] MEMORY DB (Con límite)
       ********************************************************/
      memoryDB: {
        data: {},
        maxSize: 100,
        set(key, value) {
          if (Object.keys(this.data).length >= this.maxSize) {
            console.warn("[Sparq.memoryDB] is full. Clear or increase maxSize.");
          }
          this.data[key] = value;
          return this.data[key];
        },
        get(key) {
          return this.data[key];
        },
        delete(key) {
          delete this.data[key];
        },
        clear() {
          this.data = {};
        }
      },
  
      /********************************************************
       * [EXTRA 4] INIT FRAMEWORK
       ********************************************************/
      /**
       * Inicializa Sparq con configuración dada, activa módulos, router, etc.
       * @param {Object} config
       */
      init(config) {
        if (typeof config !== "object") {
          console.warn("[Sparq.init] config must be an object.");
          return;
        }
        this.logger.info("[Sparq] Initializing with config:", config);
  
        // Activar módulos con .enable si existe
        Object.keys(config).forEach(mod => {
          if (this[mod] && typeof this[mod].enable === "function") {
            this[mod].enable(config[mod]);
          }
        });
  
        // Aplicar tema
        if (config.theme) {
          this.toggleTheme(config.theme);
        }
  
        // Activar router
        if (config.router) {
          this.router.init();
        }
  
        try {
          localStorage.setItem("sparqConfig", JSON.stringify(config));
        } catch (e) {
          this.logger.warn("[Sparq.init] Could not save config to localStorage:", e.message);
        }
      },
  
      /********************************************************
       * [EXTRA 5] GENERAR UID
       ********************************************************/
      generateUID(prefix = "id") {
        const rand = Math.random().toString(36).substring(2, 9);
        return `${prefix}-${Date.now()}-${rand}`;
      },
  
      /********************************************************
       * [EXTRA 6] COOKIES HANDLER
       ********************************************************/
      cookies: {
        set(name, value, days = 7) {
          if (typeof name !== "string" || !name.trim()) {
            throw new Error("[Sparq.cookies.set] Invalid cookie name.");
          }
          if (typeof value !== "string") {
            throw new Error("[Sparq.cookies.set] Cookie value must be string.");
          }
          const d = new Date();
          d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
          const expires = "expires=" + d.toUTCString();
          document.cookie = `${name}=${value};${expires};path=/`;
        },
        get(name) {
          if (typeof name !== "string") {
            console.error("[Sparq.cookies.get] name must be string.");
            return null;
          }
          const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
          return match ? match[2] : null;
        },
        delete(name) {
          this.set(name, "", -1);
        }
      },
  
      /********************************************************
       * [EXTRA 7] VALIDAR FORM
       ********************************************************/
      validateForm(formId, rules) {
        const form = document.getElementById(formId);
        if (!form) {
          console.error(`[Sparq.validateForm] form "${formId}" not found.`);
          return [{ formId, message: "Form not found" }];
        }
        const errors = [];
        (rules || []).forEach(({ field, rule, message }) => {
          const input = form[field];
          if (!input) {
            errors.push({ field, message: `Field "${field}" not found in form.` });
            return;
          }
          const val = input.value.trim();
          if (!rule(val)) {
            errors.push({ field, message });
          }
        });
        return errors.length ? errors : true;
      },
  
      /********************************************************
       * [EXTRA 8] MOBILE DETECTION
       ********************************************************/
      isMobile() {
        return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
      },
  
      /********************************************************
       * [EXTRA 9] COPY TO CLIPBOARD (CON Fallback)
       ********************************************************/
      copyToClipboard(text) {
        if (!navigator.clipboard) {
          // Fallback
          const temp = document.createElement("textarea");
          temp.value = text;
          document.body.appendChild(temp);
          temp.select();
          try {
            document.execCommand("copy");
          } catch (err) {
            console.error("copyToClipboard fallback error:", err);
          }
          document.body.removeChild(temp);
          return Promise.resolve();
        } else {
          return navigator.clipboard.writeText(text);
        }
      },
  
      /********************************************************
       * [EXTRA 10] GET URL PARAMS
       ********************************************************/
      getUrlParams() {
        const params = {};
        const queryString = window.location.search.slice(1);
        if (!queryString) return params;
        queryString.split("&").forEach(pair => {
          const [k, v] = pair.split("=");
          params[decodeURIComponent(k)] = decodeURIComponent(v || "");
        });
        return params;
      },
  
      /********************************************************
       * [EXTRA 11] sleep(ms)
       ********************************************************/
      sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
  
    }; // Fin objeto Sparq
  
    // Exponemos Sparq como objeto global
    global.Sparq = global.Sparq || Sparq;
  
  })(window);
  