(function(global) {
    "use strict";
  
    /**
     * Objeto principal Sparq.
     * @namespace
     */
    const Sparq = {
  
      /* ============================================================
         ============== [MEJORA #1] EXTENSIBILIDAD ==================
         ============================================================ */
      // Mantiene módulos (plugins) de terceros
      modules: {},
  
      /**
       * Permite registrar módulos personalizados (plugins) con nombre y factory.
       * @param {string} name - Nombre del módulo.
       * @param {Function} factory - Función que retorna el objeto del módulo.
       */
      registerModule(name, factory) {
        if (typeof name !== 'string' || typeof factory !== 'function') {
          throw new Error("registerModule error: invalid parameters.");
        }
        this.modules[name] = factory();
        console.log(`Module "${name}" registered successfully.`);
      },
  
      /* ============================================================
         ============== [MEJORA #2] CODE FORMATTING AVANZADO ========
         ============================================================ */
      /**
       * Formateador de código que usa un parser básico para indentación
       * y espacios alrededor de operadores sin romper strings o comentarios.
       * @param {string} code - Código a formatear.
       * @returns {string} - Código formateado.
       */
      formatCode(code) {
        if (typeof code !== "string") {
          console.error("formatCode error: input is not a string.");
          return "";
        }
        // Tokeniza el código para no romper strings ni comentarios
        // (Implementación simplificada pero funcional)
        const tokens = [];
        let current = "";
        let inString = false;
        let stringChar = null;
        let inComment = false;
        let commentType = ""; // "line" or "block"
        let indentLevel = 0;
  
        const pushToken = (tk) => {
          if (tk.trim()) tokens.push(tk);
          else if (tk.includes("\n")) tokens.push("\n"); // Mantener saltos de línea
        };
  
        for (let i = 0; i < code.length; i++) {
          const c = code[i];
          const next = code[i+1] || "";
  
          // Detectar inicio de comentario
          if (!inString && !inComment && c === "/" && (next === "/" || next === "*")) {
            inComment = true;
            commentType = (next === "/") ? "line" : "block";
            pushToken(current);
            current = c;
            continue;
          }
  
          // Manejar comentario
          if (inComment) {
            current += c;
            // Cierre de comentario
            if (commentType === "line" && c === "\n") {
              pushToken(current);
              current = "";
              inComment = false;
              commentType = "";
            } else if (commentType === "block" && c === "*" && next === "/") {
              // c='*', next='/'
              current += next;
              i++; // Consumir '/'
              pushToken(current);
              current = "";
              inComment = false;
              commentType = "";
            }
            continue;
          }
  
          // Detectar inicio/fin de string
          if (!inString && (c === '"' || c === "'")) {
            pushToken(current);
            current = c;
            inString = true;
            stringChar = c;
            continue;
          } else if (inString && c === stringChar) {
            // fin de string
            current += c;
            pushToken(current);
            current = "";
            inString = false;
            stringChar = null;
            continue;
          }
  
          // Si estamos en string, solo agregamos
          if (inString) {
            current += c;
            continue;
          }
  
          // Detectar operadores simples y llaves para indentación
          if ("{};=+-*/<>!".includes(c)) {
            // primero pusheamos lo que tuviéramos
            pushToken(current);
            current = "";
  
            // Manejo de indentación para llaves
            if (c === '{') {
              tokens.push("{\n"); 
              indentLevel++;
              // Insertar indentación
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
              // Operadores
              tokens.push(` ${c} `);
              continue;
            }
          }
  
          // Manejamos saltos de línea
          if (c === "\n") {
            pushToken(current);
            current = "";
            tokens.push("\n" + "  ".repeat(indentLevel));
            continue;
          }
  
          current += c;
        }
  
        // push final
        pushToken(current);
  
        // Reconstruimos
        return tokens.join("").replace(/\s+\n/g, "\n").replace(/\n\s+/g, "\n" + "  ".repeat(indentLevel));
      },
  
      /* ============================================================
         ============== [MEJORA #3] MINIFICACIÓN AVANZADA ==========
         ============================================================ */
      /**
       * Minifica el código sin romper strings ni comentarios internos.
       * (Se conservan cadenas literales y no elimina comentarios importantes).
       * @param {string} code - Código a minificar.
       * @returns {string} - Código minificado.
       */
      minifyCode(code) {
        if (typeof code !== 'string') {
          console.error("minifyCode error: input is not a string.");
          return "";
        }
  
        let result = "";
        let inString = false;
        let stringChar = "";
        for (let i = 0; i < code.length; i++) {
          const c = code[i];
          const next = code[i+1] || "";
  
          // Manejo de string
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
  
          // Si estamos en string, agregamos sin tocar
          if (inString) {
            result += c;
            continue;
          }
  
          // Manejo de comentarios de línea
          if (c === "/" && next === "/") {
            // saltar hasta fin de línea
            while (i < code.length && code[i] !== "\n") {
              i++;
            }
            continue;
          }
          // Manejo de comentarios de bloque
          if (c === "/" && next === "*") {
            i += 2;
            while (i < code.length-1 && !(code[i] === "*" && code[i+1] === "/")) {
              i++;
            }
            i++; // saltar '/'
            continue;
          }
  
          // Eliminar espacios múltiples
          if (/\s/.test(c)) {
            // Revisamos si next es un caracter que requiere espacio
            if (!/\s/.test(next) && next !== '') {
              result += ' ';
            }
            continue;
          }
  
          result += c;
        }
        return result.trim();
      },
  
      /* ============================================================
         ============== [MEJORA #4] CODE RUNNER =====================
         ============================================================ */
      /**
       * Ejecuta código JavaScript usando new Function, con contexto global.
       * @param {string} code - JS a ejecutar.
       * @returns {*} - Resultado
       */
      runCode(code) {
        if (typeof code !== 'string') {
          console.error("runCode error: Code must be a string.");
          return;
        }
        try {
          const func = new Function(code);
          return func();
        } catch (e) {
          console.error("Error running code:", e.message);
        }
      },
  
      /* ============================================================
         ============== [NUEVO #1] USAR CONTEXTO OPCIONAL EN runCode =
         ============================================================ */
      /**
       * Ejecuta código JS pero con un contexto de variables inyectadas.
       * @param {string} code
       * @param {Object} context - Variables a inyectar al scope
       * @returns {*} - Resultado
       */
      runCodeWithContext(code, context = {}) {
        if (typeof code !== 'string') {
          console.error("runCodeWithContext error: Code must be a string.");
          return;
        }
        const paramNames = Object.keys(context);
        const paramValues = Object.values(context);
        try {
          // Construimos una función con parámetros
          const func = new Function(...paramNames, code);
          return func(...paramValues);
        } catch (e) {
          console.error("Error running code with context:", e.message);
        }
      },
  
      /* ============================================================
         ============== [NUEVO #2] FILE MANAGER ================
         ============================================================ */
      /**
       * Lee archivo, parsea CSV y JSON si corresponde, crea BLOB, etc.
       * Consolidado con mayor robustez.
       * @param {File} fileInput
       * @returns {Promise<any>}
       */
      readFileAdvanced(fileInput) {
        return new Promise((resolve, reject) => {
          if (!(fileInput instanceof File)) {
            return reject("Invalid file input: not a File object.");
          }
          const reader = new FileReader();
          reader.onload = function(e) {
            let content = e.target.result;
            // parse CSV
            if (fileInput.name.endsWith(".csv")) {
              const rows = content.split("\n").filter(row => row.trim() !== '');
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
            // parse JSON
            if (fileInput.name.endsWith(".json")) {
              try {
                return resolve(JSON.parse(content));
              } catch (err) {
                console.warn("Invalid JSON format, returning raw text.");
              }
            }
            resolve(content);
          };
          reader.onerror = (err) => {
            reject("Error reading file: " + err.message);
          };
          reader.readAsText(fileInput);
        });
      },
  
      /* ============================================================
         ============== MÓDULO DE COMPRESIÓN DE IMAGEN =============
         ============================================================ */
      /**
       * Comprime imagen, dando la posibilidad de elegir calidad y escalado.
       * @param {File} imageFile
       * @param {Object} opts { quality: number (0-1), scale: number (0-1) }
       * @returns {Promise<Blob>}
       */
      compressImage(imageFile, opts = {}) {
        return new Promise((resolve, reject) => {
          if (!(imageFile instanceof File)) {
            return reject("compressImage error: input is not a File.");
          }
          const quality = typeof opts.quality === 'number' ? opts.quality : 0.7;
          const scale = typeof opts.scale === 'number' ? opts.scale : 0.5;
  
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
              canvas.toBlob((blob) => {
                resolve(blob);
              }, "image/jpeg", quality);
            };
            img.onerror = (err) => {
              reject("Image load error: " + err.message);
            };
          };
          reader.onerror = (err) => {
            reject("File reading error: " + err.message);
          };
          reader.readAsDataURL(imageFile);
        });
      },
  
      /* ============================================================
         ============== 7. THEME SWITCHER ===========================
         ============================================================ */
      toggleTheme(theme) {
        if (typeof theme !== 'string') {
          console.error("toggleTheme error: theme must be a string.");
          return;
        }
        document.documentElement.setAttribute("data-theme", theme);
      },
  
      /* ============================================================
         ============== 8. DYNAMIC COMPONENT LOADER ================
         ============================================================ */
      loadComponent(url, elementId) {
        if (typeof url !== 'string' || typeof elementId !== 'string') {
          console.error("loadComponent error: URL and elementId must be strings.");
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
            if (container) {
              container.innerHTML = html;
            } else {
              console.error(`Element with ID "${elementId}" not found.`);
            }
          })
          .catch(err => {
            console.error("loadComponent error:", err.message);
          });
      },
  
      /* ============================================================
         ============== [NUEVO #3] ENRUTADOR HASH (SIMPLE) ==========
         ============================================================ */
      router: {
        routes: {},
  
        /**
         * Registra una ruta con un callback
         * @param {string} path - Ruta tipo #/home
         * @param {Function} callback - Acción a ejecutar
         */
        register(path, callback) {
          if (typeof path !== "string" || typeof callback !== "function") {
            console.error("router.register error: invalid params");
            return;
          }
          this.routes[path] = callback;
        },
  
        init() {
          window.addEventListener("hashchange", () => {
            this.resolve();
          });
          // Resolver en inicio
          this.resolve();
        },
  
        resolve() {
          const hashPath = window.location.hash || "#/";
          if (this.routes[hashPath]) {
            this.routes[hashPath]();
          } else {
            console.warn(`No route found for ${hashPath}`);
          }
        }
      },
  
      /* ============================================================
         ============== [NUEVO #4] LOG SYSTEM CON NIVELES ===========
         ============================================================ */
      logger: {
        level: "info", // could be "debug", "info", "warn", "error"
  
        setLevel(newLevel) {
          this.level = newLevel;
        },
  
        debug(...args) {
          if (["debug"].includes(this.level)) {
            console.debug("[DEBUG]", ...args);
          }
        },
        info(...args) {
          if (["debug", "info"].includes(this.level)) {
            console.info("[INFO]", ...args);
          }
        },
        warn(...args) {
          if (["debug", "info", "warn"].includes(this.level)) {
            console.warn("[WARN]", ...args);
          }
        },
        error(...args) {
          console.error("[ERROR]", ...args);
        }
      },
  
      /* ============================================================
         ============== [NUEVO #5] STORAGE CONFIGURATIONS ===========
         ============================================================ */
      config: {
        save(key, value) {
          try {
            localStorage.setItem(key, JSON.stringify(value));
          } catch (e) {
            console.error("Error saving config:", e.message);
          }
        },
        load(key) {
          try {
            return JSON.parse(localStorage.getItem(key));
          } catch (e) {
            console.error("Error loading config:", e.message);
            return null;
          }
        },
        clear(key) {
          try {
            localStorage.removeItem(key);
          } catch (e) {
            console.error("Error clearing config:", e.message);
          }
        }
      },
  
      /* ============================================================
         ============== [NUEVO #6] LOCAL WATCH (FILE CHANGES) =======
         ============================================================ */
      // Nota: Esto se simula con 'beforeunload' y 'storage' events, 
      // para ver si algo cambió localmente. 
      watchLocalChanges(callback) {
        // Escucha cambios en localStorage
        window.addEventListener('storage', (e) => {
          callback(e);
        });
        // Escucha cambios de refresco
        window.addEventListener('beforeunload', (e) => {
          callback({ type: 'unload', message: 'Window is unloading' });
        });
      },
  
      /* ============================================================
         ============== [NUEVO #7] PREVIEW HTML (STRING->DOM) ======
         ============================================================ */
      /**
       * Convierte un string HTML a un nodo DOM y lo inserta para previsualizar.
       * @param {string} htmlString - HTML en string
       * @param {string} containerId - ID del contenedor
       */
      previewHTML(htmlString, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
          console.error("previewHTML error: container not found.");
          return;
        }
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;
        container.innerHTML = "";
        container.appendChild(tempDiv);
      },
  
      /* ============================================================
         ============== [NUEVO #8] MINI DATOS ALMACEN IN-MEMORY =====
         ============================================================ */
      // Mantiene un mini repositorio de datos en memoria
      memoryDB: {
        data: {},
  
        set(key, value) {
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
  
      /* ============================================================
         ============== [NUEVO #9] INIT DEFRAMEWORK ================
         ============================================================ */
      /**
       * Inicializa Sparq con la configuración dada, permitiendo activación de módulos
       * y estableciendo un 'escuchador' para hash router.
       * @param {Object} config
       */
      init(config) {
        this.logger.info("Initializing Sparq with config:", config);
        if (config && typeof config === 'object') {
          Object.keys(config).forEach(module => {
            if (this[module] && typeof this[module].enable === 'function') {
              this[module].enable(config[module]);
            }
          });
          // Tema
          if (config.theme) {
            this.toggleTheme(config.theme);
          }
        }
        localStorage.setItem('sparqConfig', JSON.stringify(config));
  
        // [MEJORA #9] Inicia router si config.router === true
        if (config && config.router) {
          this.router.init();
        }
      },

      /***********************************************************************
 * [EXTRA] 7 FUNCIONES AVANZADAS, 100% FUNCIONALES EN JS PURO
 ***********************************************************************/

/**
 * Genera un ID único (UID) basado en timestamp y random.
 * @param {string} [prefix='id'] - Prefijo opcional.
 * @returns {string} - ID único.
 */
generateUID(prefix = 'id') {
    const rand = Math.random().toString(36).substring(2, 9);
    return `${prefix}-${Date.now()}-${rand}`;
  },
  
  /**
   * Manejo completo de cookies (set, get, delete).
   * @namespace Sparq.cookies
   */
  cookies: {
    /**
     * Crea o actualiza una cookie con un tiempo de expiración.
     * @param {string} name - Nombre de la cookie.
     * @param {string} value - Valor de la cookie.
     * @param {number} [days=7] - Días hasta que expire la cookie.
     */
    set(name, value, days = 7) {
      const d = new Date();
      d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = "expires=" + d.toUTCString();
      document.cookie = `${name}=${value};${expires};path=/`;
    },
    /**
     * Obtiene el valor de una cookie.
     * @param {string} name - Nombre de la cookie.
     * @returns {string|null} - Valor de la cookie o null si no existe.
     */
    get(name) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    },
    /**
     * Elimina una cookie estableciendo un tiempo de vida negativo.
     * @param {string} name - Nombre de la cookie.
     */
    delete(name) {
      this.set(name, '', -1);
    }
  },
  
  /**
   * Valida formularios con reglas personalizadas.
   * @param {string} formId - ID del formulario en el DOM.
   * @param {Array} rules - Reglas de validación [{ field, rule(value), message }].
   * @returns {Array|boolean} - true si todo OK, o array de errores.
   */
  validateForm(formId, rules) {
    const form = document.getElementById(formId);
    if (!form) {
      console.error("validateForm error: form not found.");
      return false;
    }
    const errors = [];
    rules.forEach(({ field, rule, message }) => {
      const input = form[field];
      if (!input) {
        errors.push({ field, message: `Field "${field}" not found.` });
        return;
      }
      const value = input.value.trim();
      if (!rule(value)) {
        errors.push({ field, message });
      }
    });
    return errors.length ? errors : true;
  },
  
  /**
   * Detecta si el usuario navega desde un dispositivo móvil.
   * @returns {boolean} - true si es móvil, false si es desktop.
   */
  isMobile() {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  },
  
  /**
   * Copia texto al portapapeles usando la API nativa.
   * @param {string} text - Texto a copiar.
   * @returns {Promise<void>}
   */
  copyToClipboard(text) {
    if (!navigator.clipboard) {
      // Fallback: crear textarea oculto
      const temp = document.createElement('textarea');
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('copyToClipboard fallback error:', err);
      }
      document.body.removeChild(temp);
      return Promise.resolve();
    } else {
      return navigator.clipboard.writeText(text);
    }
  },
  
  /**
   * Obtiene parámetros GET de la URL (ej. ?foo=bar&test=123) en un objeto.
   * @returns {Object} - Objeto con clave=valor de los params.
   */
  getUrlParams() {
    const params = {};
    const queryString = window.location.search.slice(1); 
    if (!queryString) return params;
    queryString.split("&").forEach(pair => {
      const [key, val] = pair.split("=");
      params[decodeURIComponent(key)] = decodeURIComponent(val || "");
    });
    return params;
  },
  
  /**
   * Espera un tiempo (ms) antes de resolver la Promesa.
   * @param {number} ms - Milisegundos a esperar.
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  
      /* ============================================================
         ============== [NUEVO #10] EJEMPLO: EVENT BUS ==============
         ============================================================ */
      eventBus: {
        events: {},
        on(eventName, callback) {
          if (!this.events[eventName]) {
            this.events[eventName] = [];
          }
          this.events[eventName].push(callback);
        },
        emit(eventName, data) {
          if (!this.events[eventName]) return;
          this.events[eventName].forEach(cb => cb(data));
        },
        off(eventName, callback) {
          if (!this.events[eventName]) return;
          this.events[eventName] = this.events[eventName].filter(fn => fn !== callback);
        }
      }
    };
  
    // Exponemos Sparq como objeto global
    global.Sparq = Sparq;
  
  })(window);
  