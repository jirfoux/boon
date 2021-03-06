"use strict";
//@ts-check
(function () {
    // ALIAS //
    class Adapt {
        constructor(opts) {
            // el, data, watch, methods, options, init, validate
            if (!opts.options) { opts.options = {}; }
            const that = this;
            that._options = Object.freeze(opts);
            ["methods", "watch", "options", "validate"].forEach(name => Object.freeze(opts[name] || {}));
            that._changedAttrs = new Set();
            that._data = enrichData(that, opts.data || {}, opts.methods || {});

            const load = () => {
                if (opts.el instanceof Element) {
                    that._el = [opts.el];
                } else if (opts.el instanceof NodeList) {
                    that._el = Array.from(opts.el);
                } else if (Array.isArray(opts.el) && opts.el.every(e => e instanceof Element)) {
                    that._el = Array.from(opts.el);
                } else if (typeof opts.el == "string") {
                    that._el = Array.from(document.querySelectorAll(opts.el));
                }
                let invalid = false;
                if (!that._el ||
                    that._el.length == 0 ||
                    that._el.some(e => e == document.body || e == document.body.parentElement)) {
                    invalid = true;
                }
                if (!invalid) {
                    const parents = new Set();
                    for (const e of that._el) {
                        let parent = e.parentNode;
                        while (parent) {
                            parents.add(parent);
                            parent = parent.parentNode;
                        }
                    }
                    if (that._el.some(e => parents.has(e))) {
                        invalid = true;
                    }
                }
                if (invalid) {
                    throw new Error("no valid el");
                }
                scanDOM(that);
                setDirty(that);
                if (opts.init) {
                    opts.init.apply(that);
                }
            };
            if (document.readyState != "loading") {
                load();
            } else {
                document.addEventListener("DOMContentLoaded", load);
            }
        }
    }

    const setDirty = (adapt) => {
        if (!adapt._timeout) {
            adapt._timeout = setTimeout(() => {
                applyDOMChanges(adapt);
                adapt._timeout = null;
            }, 20);
        }
    };

    const enrichData = (adapt, data, methods) => {
        adapt._usedAttributes = {};
        let collect;
        const validataPropertyName = (key) => {
            if (key.startsWith("_")) {
                throw new Error("no '_'-keys");
            }
        };
        adapt._cachedData = {};
        Object.keys(data).forEach(key => {
            validataPropertyName(key);
            const value = data[key];
            if (typeof value == "function") {
                adapt._usedAttributes[key] = null;
                Object.defineProperty(adapt, key, {
                    get: () => adapt._cachedData[key]
                });
                return;
            }
            const callback = () => {
                callWatcher(adapt, key, value, value);
                setDirty(adapt);
            };
            if (Array.isArray(value)) {
                enrichArray(value, callback);
            } else if (typeof value == "object") {
                enrichObject(value, callback);
            }
            Object.defineProperty(adapt, key, {
                set: (x) => {
                    const old = data[key];
                    const validationResult = callValidator(adapt, key, x);
                    if (validationResult !== undefined) {
                        if (validationResult !== x) {
                            setDirty(adapt);
                        }
                        x = validationResult;
                    }
                    if (Array.isArray(x)) {
                        enrichArray(x, callback);
                    } else if (typeof x == "object") {
                        enrichObject(x, callback);
                    }
                    data[key] = x;
                    if (old !== x) {
                        callWatcher(adapt, key, old, x);
                        setDirty(adapt);
                    }
                },
                get: () => {
                    if (collect) {
                        collect.add(key);
                    }
                    return data[key];
                }
            });
        });
        Object.keys(methods).forEach(key => {
            validataPropertyName(key);
            Object.defineProperty(adapt, key, {
                get: () => methods[key]

            });
        });
        Object.keys(adapt._usedAttributes).forEach(key => {
            collect = new Set();
            const res = data[key].apply(adapt);
            if (!collect.size) {
                adapt._cachedData[key] = res;
            }
            adapt._usedAttributes[key] = Array.from(collect);
            collect.forEach(e => adapt._changedAttrs.add(e));
        });
        collect = null;
        Object.freeze(adapt._usedAttributes);

        return data;
    };

    const enrichObject = (object, callback) => {
        Object.keys(object).forEach(k => {
            if (!object._data) {
                Object.defineProperty(object, "_data", { writable: true });
                object._data = {};
            }
            if (object._data.hasOwnProperty(k)) {
                return;
            }
            if (Array.isArray(object[k])) {
                enrichArray(object[k], callback);
            } else if (typeof object[k] == "object") {
                enrichObject(object[k], callback);
            }
            object._data[k] = object[k];
            Object.defineProperty(object, k, {
                set: (x) => {
                    if (Array.isArray(x)) {
                        enrichArray(x, callback);
                    } else if (typeof x == "object") {
                        enrichObject(x, callback);
                    }
                    object._data[k] = x;
                    callback();
                },
                get: () => object._data[k]

            });
        });
    };

    const enrichArray = (array, callback) => {
        if (!array.custo) {
            ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"]
                .forEach(method => {
                    function neww(...args) {
                        Array.prototype[method].apply(array, args);
                        enrichElements();
                        callback();
                    }
                    Object.defineProperty(array, method, {
                        enumerable: false,
                        configurable: false,
                        writable: false,
                        value: neww
                    });
                });
            array.custo = true;
        }
        const enrichElements = () => {
            array.forEach(e => {
                if (Array.isArray(e)) {
                    enrichArray(e, callback);
                } else if (typeof e == "object") {
                    enrichObject(e, callback);
                }
            });
        };
        enrichElements();
    };

    const callWatcher = (adapt, key, oldValue, newValue) => {
        const opts = adapt._options;
        const watch = opts.watch;
        if (watch) {
            if (watch[key]) {
                watch[key].apply(adapt, [newValue, oldValue]);
            }
        }
        adapt._changedAttrs.add(key);
    };
    const callValidator = (adapt, key, newValue) => {
        const opts = adapt._options;
        const validate = opts.validate;
        if (validate) {
            if (validate[key]) {
                return validate[key].apply(adapt, [newValue]);
            }
        }
    };

    const getAllPropertyNames = (obj) => {
        const props = [];
        do {
            Object.getOwnPropertyNames(obj).forEach(function (prop) {
                if (!props.includes(prop)) {
                    props.push(prop);
                }
            });
        } while (obj = Object.getPrototypeOf(obj));

        return props;
    };

    const applyDOMChanges = (adapt) => {
        Object.entries(adapt._usedAttributes).forEach(e => {
            if (e[1].some(a => adapt._changedAttrs.has(a))) {
                adapt._cachedData[e[0]] = adapt._data[e[0]].apply(adapt);
            }
        });
        adapt._changedAttrs.clear();
        adapt._updateFunctions.forEach(uf => {
            const node = uf.node;
            const dir = uf.dir;
            const attribute = uf.attribute;
            if (node.nodeType == 1) {
                const calculatedValue = uf.func.apply(adapt);
                const calculatedString = toString(calculatedValue);
                if (dir == "attr") {
                    if (typeof calculatedValue != "object") {
                        if (node.getAttribute(attribute) !== calculatedString) {
                            node.setAttribute(attribute, calculatedString);
                        }
                    } else if (attribute == "class") {
                        node.setAttribute(attribute, "");
                        if (Array.isArray(calculatedValue)) {
                            calculatedValue.forEach(e => { if (e) node.classList.add(e); });
                        } else {
                            for (const key in calculatedValue) {
                                if (calculatedValue[key]) {
                                    node.classList.add(key);
                                }
                            }
                        }
                    }
                    if (uf.initClass) {
                        uf.initClass.forEach(c => node.classList.add(c));
                    }
                } else if (dir == "prop" && attribute) {
                    const old = node[attribute];
                    const neww = typeof old == "string" ? calculatedString : calculatedValue;
                    if (old !== neww) {
                        node[attribute] = neww;
                    }
                } else if (dir == "model") {
                    if (node.tagName.toLowerCase() == "input" && node.type == "checkbox") {
                        if (node.checked !== calculatedValue) {
                            node.checked = calculatedValue;
                        }
                    } else if (node.tagName.toLowerCase() == "input" && node.type == "radio") {
                        if (node.checked !== (node.value == calculatedString)) {
                            node.checked = node.value == calculatedString;
                        }
                    } else {
                        if (node.value !== calculatedString) {
                            node.value = calculatedString;
                        }
                    }
                } else if (dir == "visible") {
                    node.style["display"] = calculatedValue ? "" : "none";
                } else if (dir == "style") {
                    node.setAttribute("style", "");
                    for (const key in calculatedValue) {
                        node.style[key] = calculatedValue[key];
                    }
                    if (uf.initStyle) {
                        node.setAttribute("style", uf.initStyle + node.getAttribute("style"));
                    }
                }
            } else {
                let result = uf.expression;
                Object.entries(uf.areas).forEach(e => {
                    result = result.split(e[0]).join(toString(e[1].apply(adapt)));
                });
                node.textContent = result;
            }
        });
    };

    const scanDOM = (adapt) => {
        const reactNodes = [];
        const isReactNode = (node) => {
            // element node
            if ((node.nodeType == 1)) {
                const attrNames = node.getAttributeNames();
                for (const name of attrNames) {
                    if (dirs.includes(name) && node.getAttribute(name)) {
                        return true;
                    }
                    if (dirsStarts.some(start => name.startsWith(start))) {
                        return true;
                    }
                }
            } else if (node.nodeType == 3) {
                // text node
                const start = adapt._options.options.startTag || "{{";
                const end = adapt._options.options.endTag || "}}";

                const startInds = getIndicesOf(start, node.textContent);
                const endInds = getIndicesOf(end, node.textContent);
                if (startInds.length && startInds.length == endInds.length) {
                    for (let i = 0; i < startInds.length; i++) {
                        if (startInds[i] + start.length >= endInds[i]) {
                            return false;
                        }
                    }
                    return true;
                }
            }
        };
        const fillNodes = (node) => {
            if (isReactNode(node)) {
                reactNodes.push(node);
            }
            node.childNodes.forEach(fillNodes);
        };
        const getModifiers = (attr) => {
            const res = [];
            let index;
            while ((index = attr.lastIndexOf(".")) !== -1) {
                res.push(attr.slice(index + 1));
                attr = attr.slice(0, index);
            }
            return res.reverse();
        };
        adapt._el.forEach(fillNodes);
        adapt._updateFunctions = reactNodes//.filter((val, i, self) => self.indexOf(val) === i)
            .flatMap(node => {
                const results = [];
                if (node.nodeType == 1) {
                    const attrNames = node.getAttributeNames();
                    attrNames.forEach(name => {
                        const result = {};
                        result.node = node;
                        const addFunc = (name) => {
                            const expression = node.getAttribute(name);
                            result.func = getFunction(adapt, expression);
                            node.removeAttribute(name);
                        };
                        if (name.startsWith("b-attr:") || name.startsWith(":")) {
                            result.dir = "attr";
                            result.attribute = name.slice(name.indexOf(":") + 1);
                            if (result.attribute == "class") {
                                result.initClass = Array.from(node.classList);
                            }
                            addFunc(name);
                        } else if (name.startsWith("b-prop:")) {
                            result.dir = "prop";
                            const attribute = name.slice(name.indexOf(":") + 1);
                            let prop = null;

                            const names = getAllPropertyNames(node);
                            for (const name of names) {
                                if (attribute.toLowerCase() == name.toLowerCase()) {
                                    prop = name; break;
                                }
                            }
                            result.attribute = prop;
                            addFunc(name);
                        } else if (name == "b-model" || name.startsWith("b-model.")) {
                            result.dir = "model";
                            const key = node.getAttribute(name).trim();
                            const tagName = node.tagName.toLowerCase();
                            const modifiers = getModifiers(name);
                            node.addEventListener(modifiers.includes("lazy") ? "change" : "input", function () {
                                if (tagName == "input" && node.type == "checkbox") {
                                    adapt[key] = this.checked;
                                } else {
                                    adapt[key] = this.value;
                                }
                            });
                            addFunc(name);
                        } else if (name == "b-visible") {
                            result.dir = "visible";
                            addFunc(name);
                        } else if (name == "b-style") {
                            result.dir = "style";
                            const style = node.getAttribute("style");
                            if (style) {
                                result.initStyle = style;
                                if (!result.initStyle.endsWith(";")) {
                                    result.initStyle += ";";
                                }
                            }
                            addFunc(name);
                        } else if (name.startsWith("b-on:") || name.startsWith("@")) {
                            let event = name.slice(Math.max(name.indexOf(":"), name.indexOf("@")) + 1);
                            const index = event.indexOf(".");
                            if (index >= 0) {
                                event = event.slice(0, index);
                            }
                            const func = getFunction(adapt, node.getAttribute(name), true);
                            const modifiers = getModifiers(name);
                            const options = {
                                once: modifiers.includes("once"),
                                capture: modifiers.includes("capture")
                            };
                            node.addEventListener(event, (e) => {
                                adapt._event = e;
                                func.apply(adapt);
                                delete adapt._event;
                            }, options);
                            node.removeAttribute(name);
                            result.func = () => { };
                        }
                        if (result.dir) {
                            results.push(result);
                        }
                    });
                } else {
                    const result = {};
                    result.node = node;
                    result.expression = node.textContent;
                    result.areas = {};
                    const start = adapt._options.options.startTag || "{{";
                    const end = adapt._options.options.endTag || "}}";

                    const startInds = getIndicesOf(start, node.textContent);
                    const endInds = getIndicesOf(end, node.textContent);
                    for (let i = 0; i < endInds.length; i++) {
                        const key = node.textContent.substring(startInds[i], endInds[i] + end.length);
                        const val = key.slice(start.length, key.length - end.length);
                        result.areas[key] = getFunction(adapt, val);
                    }
                    results.push(result);
                }
                return results;
            });
    };
    const dirs = ["b-visible", "b-style"];
    const dirsStarts = ["b-on:", "@", "b-attr:", ":", "b-model", "b-prop"];
    const getIndicesOf = (searchStr, str) => {
        const searchStrLen = searchStr.length;
        if (searchStrLen == 0) {
            return [];
        }
        let startIndex = 0, index, indices = [];
        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
            indices.push(index);
            startIndex = index + searchStrLen;
        }
        return indices;
    };

    const getFunction = (adapt, expression, isEvent) => {
        expression = expression.trim();
        const datakeys = Object.keys(adapt._options.data || {});

        const pref = k => "let " + k + "=this." + k + ";";
        let funcPrefix = "";
        datakeys.forEach(k => {
            if (expression.includes(k)) {
                funcPrefix += pref(k);
            }
        });
        Object.keys(adapt._options.methods || {}).forEach(k => {
            if (expression.includes(k)) {
                funcPrefix += pref(k);
            }
        });

        let funcSuffix = ";";
        datakeys.forEach(k => {
            if (expression.includes(k)) {
                funcSuffix += "if(" + k + "!==this." + k + ")this." + k + "=" + k + ";";
            }
        });
        let funcBody = funcPrefix + (isEvent ? "" : "return ");
        if (isEvent) {
            funcBody = "const $event=this._event;" + funcBody;
        }
        const isFunc = Boolean((adapt._options.methods || {})[expression]) ||
            (expression.endsWith(")") && !expression.startsWith("(") && (expression.match(/\)/g) || "").length == 1 && (expression.match(/\(/g) || "").length == 1);
        if (isFunc) {
            if (!expression.endsWith(")")) {
                funcBody += expression + ".apply(this" + (isEvent ? ",[$event]" : "") + ")";
            } else {
                const paraIndex = expression.indexOf("(");
                const funcName = expression.slice(0, paraIndex);
                funcBody += funcName + ".apply(this,[" + expression.slice(paraIndex + 1, expression.length - 1) + "])";
            }
        } else {
            funcBody += expression;
        }
        if (isEvent) {
            funcBody += funcSuffix;
        }
        return new Function(funcBody);
    };

    const toString = (val) => {
        return typeof val == "object" ? JSON.stringify(val) : val + "";
    };

    if (!window.booon) {
        window.booon = {};
    }
    booon.adapt = (options) => new Adapt(options);
})();
