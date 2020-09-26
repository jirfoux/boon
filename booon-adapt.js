"use strict";
//@ts-check
(function () {
    class Adapt {
        constructor(opts) {
            // el, data, watch, methods, options
            if (!opts.options) { opts.options = {}; }
            this._options = Object.freeze(opts);
            ["methods", "watch", "el", "options", "validators"].forEach(name => Object.freeze(opts[name] || {}));
            this._data = enrichData(this, opts.data || {}, opts.methods || {});
            let that = this;

            setInterval(() => {
                if (that._dirty) {
                    that._dirty = false;
                    applyDOMChanges(that);
                }
            }, 1000 / 5 /*TODO 15*/);

            booon(function () {
                that._el = opts.el instanceof Element ? opts.el : document.querySelector(opts.el);
                if (!that._el || that._el == document.body || that._el == document.body.parentElement) {
                    throw new Error("no valid el");
                }
                that._dirty = true;
                scan(that);
                if (opts.init) {
                    init.apply(that);
                }
            });
        }
    }

    function enrichData(adapt, data, methods) {
        Object.keys(data)
            .forEach(key => {
                if (key.startsWith("_")) {
                    throw new Error("no '_'-keys");
                }
                Object.defineProperty(adapt, key, {
                    set: function (x) {
                        const old = data[key];
                        const validationResult = callValidator(adapt, key, x);
                        if (validationResult !== undefined) {
                            if (validationResult !== x) {
                                adapt._dirty = true;
                            }
                            x = validationResult;
                        }
                        data[key] = x;
                        if (old !== x) {
                            callWatcher(adapt, key, old, x);
                            adapt._dirty = true;
                        }
                    },
                    get: function () {
                        return data[key];
                    }
                });
            });
        Object.keys(methods)
            .forEach(key => {
                if (key.startsWith("_")) {
                    throw new Error("no '_'-keys");
                }
                Object.defineProperty(adapt, key, {
                    get: function () {
                        return methods[key];
                    }
                });
            });
        return data;
    }
    function callWatcher(adapt, key, oldValue, newValue) {
        const opts = adapt._options;
        if (opts.watch) {
            if (opts.watch[key]) {
                opts.watch[key].apply(adapt, [oldValue, newValue]);
            }
        }
    }
    function callValidator(adapt, key, newValue) {
        const opts = adapt._options;
        if (opts.validators) {
            if (opts.validators[key]) {
                return opts.validators[key].apply(adapt, [newValue]);
            }
        }
    }

    function applyDOMChanges(adapt) {
        adapt._updateFunctions.forEach(uf => {
            const node = uf.node;
            const dir = uf.dir;
            if (node.nodeType == 1) {
                const calculatedValue = uf.func.apply(adapt);
                if (dir == "bind") {
                    if (typeof calculatedValue != "object") {
                        if (node.getAttribute(uf.attribute) !== calculatedValue) {
                            node.setAttribute(uf.attribute, calculatedValue);
                        }
                    } else if (uf.attribute == "class") {
                        node.setAttribute(uf.attribute, "");
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
                } else if (dir == "model") {
                    if (node.tagName.toLowerCase() == "input" && node.type == "checkbox") {
                        if (node.checked !== calculatedValue) {
                            node.checked = calculatedValue;
                        }
                    } else if (node.tagName.toLowerCase() == "input" && node.type == "radio") {
                        if (node.checked !== (node.value == calculatedValue)) {
                            node.checked = node.value == calculatedValue;
                        }
                    } else {
                        if (node.value !== calculatedValue) {
                            node.value = calculatedValue;
                        }
                    }
                } else if (dir == "text") {
                    node.innerText = calculatedValue;
                } else if (dir == "html") {
                    node.innerHTML = calculatedValue;
                } else if (dir == "visible") {
                    node.style["display"] = calculatedValue ? "" : "none";
                } else if (dir == "style") {
                    node.setAttribute("style", "");
                    for (const key in calculatedValue) {
                        node.style[key] = calculatedValue[key];
                    }
                    if (uf.initStyle) {
                        node.setAttribute("style", uf.initStyle + ";" + node.getAttribute("style"));
                    }
                }
            } else if (node.nodeType == 3) {
                let result = uf.expression;
                Object.entries(uf.areas).forEach(e => {
                    result = result.split(e[0]).join(e[1].apply(adapt));
                });
                node.textContent = result;
            }
        });
    }

    function scan(adapt) {
        let t1 = new Date().getTime();
        const reactNodes = [];
        fillNodes(adapt._el);
        function fillNodes(node) {
            if (isReactNode(node)) {
                reactNodes.push(node);
            }
            node.childNodes.forEach(fillNodes);
        }
        //console.log(reactNodes);

        adapt._updateFunctions = reactNodes
            .map(node => {
                const result = {};
                result.node = node;
                if (node.nodeType == 1) {
                    const attrNames = node.getAttributeNames();
                    attrNames.forEach(name => {
                        if (name.startsWith("b-bind:") || name.startsWith(":")) {
                            result.dir = "bind";
                            result.attribute = name.slice(name.indexOf(":") + 1);
                            if (result.attribute == "class") {
                                result.initClass = Array.from(node.classList);
                            }
                            addFunc(name);
                        } else if (name == "b-model") {
                            result.dir = "model";
                            const key = node.getAttribute(name).trim();
                            node.addEventListener("input", function (e) {
                                if (node.tagName.toLowerCase() == "input" && node.type == "checkbox") {
                                    adapt[key] = this.checked;
                                } else if (node.tagName.toLowerCase() == "input" && node.type == "radio") {
                                    adapt[key] = this.value;
                                } else {
                                    adapt[key] = this.value;
                                }
                            });
                            addFunc(name);
                        } else if (name == "b-text") {
                            result.dir = "text";
                            addFunc(name);
                        } else if (name == "b-html") {
                            result.dir = "html";
                            addFunc(name);
                        } else if (name == "b-visible") {
                            result.dir = "visible";
                            addFunc(name);
                        } else if (name == "b-style") {
                            result.dir = "style";
                            if (node.getAttribute("style")) {
                                result.initStyle = node.getAttribute("style");
                            }
                            addFunc(name);
                        } else if (name.startsWith("b-on:") || name.startsWith("@")) {
                            const event = name.slice(Math.max(name.indexOf(":"), name.indexOf("@")) + 1);
                            const func = getFunction(adapt, node.getAttribute(name), true);
                            node.addEventListener(event, function (e) {
                                if(e&&modifiers.includes("prevent")){
                                    e.preventDefault();
                                }
                                adapt._event = e;
                                func.apply(adapt);
                                delete adapt._event;
                            });
                            node.removeAttribute(name);
                            result.func = () => { };
                        }
                    });
                    function addFunc(name) {
                        const expression = node.getAttribute(name);
                        result.func = getFunction(adapt, expression);
                        node.removeAttribute(name);
                    }
                } else {
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
                }
                return result;
            });

        /*function getModifiers(attr) {
            const res = [];
            let index;
            while ((index = attr.lastIndexOf(".")) !== -1) {
                res.push(attr.slice(index + 1));
                attr = attr.slice(0, index);
            }
            return res.reverse();
        }*/

        console.log(adapt._updateFunctions);
        console.log((new Date().getTime() - t1) + " ms");

        function isReactNode(node) {
            // element node
            if ((node.nodeType == 1 && node != document.body)) {
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
        }
    }
    const dirs = ["b-model", "b-text", "b-html", "b-visible", "b-style"];
    const dirsStarts = ["b-on:", "@", "b-bind:", ":"];
    function getIndicesOf(searchStr, str) {
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
    }

    function getFunction(adapt, expression, event) {
        expression = expression.trim();
        const funcPrefix = (() => {
            const pref = k => "let " + k + "=this." + k + ";";
            let res = "";
            Object.keys(adapt._options.data || {}).forEach(k => {
                if (expression.includes(k)) {
                    res += pref(k);
                }
            });
            Object.keys(adapt._options.methods || {}).forEach(k => {
                if (expression.includes(k)) {
                    res += pref(k);
                }
            });
            return res;
        })();
        const funcSuffix = (() => {
            let res = ";";
            Object.keys(adapt._options.data || {}).forEach(k => {
                if (expression.includes(k)) {
                    res += "if(" + k + "!==this." + k + ")this." + k + "=" + k + ";";
                }
            });
            return res;
        })();
        let funcBody = funcPrefix + (event ? "" : "return ");
        if (event) {
            funcBody = "const $event=this._event;" + funcBody;
        }
        const isFunc = Boolean(adapt._options.methods[expression]) ||
            (expression.endsWith(")") && !expression.startsWith("(") && (expression.match(/\)/g) || "").length == 1 && (expression.match(/\(/g) || "").length == 1);
        if (isFunc) {
            if (!expression.endsWith(")")) {
                funcBody += expression + ".apply(this" + (event ? ",[$event]" : "") + ")";
            } else {
                const paraIndex = expression.indexOf("(");
                const funcName = expression.slice(0, paraIndex);
                funcBody += funcName + ".apply(this,[" + expression.slice(paraIndex + 1, expression.length - 1) + "])";
            }
        } else {
            funcBody += expression;
        }
        if (event) {
            funcBody += funcSuffix;
        }
        //console.log(funcBody);
        return new Function(funcBody);
    }

    booon.adapt = function (options) {
        return new Adapt(options);
    };
})();
