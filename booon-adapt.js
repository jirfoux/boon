"use strict";
//@ts-check
(function () {
    class Adapt {
        constructor(opts) {
            // el, data, watch, methods, options
            if (!opts.options) { opts.options = {}; }
            this._options = Object.freeze(opts);
            ["methods", "watch", "el", "options"].forEach(name => Object.freeze(opts[name] || {}));
            //recreateEl(this);
            this._el = opts.el instanceof Element ? opts.el : document.querySelector(opts.el);
            if (!this._el) {
                throw new Error("no valid el");
            }
            this._queue = [];
            this._data = enrichData(this, opts.data || {}, opts.methods || {});
            let that = this;
            this._funcPrefix = (() => {
                let res = "";
                Object.keys(opts.data || {}).forEach(k => {
                    res += "const " + k + "=this." + k + ";";
                });
                Object.keys(opts.methods || {}).forEach(k => {
                    res += "const " + k + "=this." + k + ";";
                });
                return res;
            })();

            setInterval(() => {
                this._queue.forEach(f => f());
                if (this._queue.length) {
                    this._queue = [];
                }

                if (this._render) {
                    this._render = false;
                    applyDOMChanges(this);
                    //recreateEl(this);
                }
            }, 1000 / 15);

            booon(function () {
                that._render = true;
                scan(that);
            });
        }

        _schedule(func) {
            this._queue.push(func);
        }
    }

    class UpdateFunction {
        /*node;
        expression;
        attribute;
        dir;
        func;
        areas;*/
    }
    /*function recreateEl(adapt) {
        adapt._el = booon(adapt._options.el);
        if (adapt._el.length > 1) {
            throw new Error("more than one root");
        }
    }*/
    function enrichData(adapt, data, methods) {
        Object.keys(data)
            .forEach(key => {
                if (key.startsWith("_")) {
                    throw new Error("no '_'-keys");
                }
                Object.defineProperty(adapt, key, {
                    set: function (x) {
                        const old = data[key];
                        data[key] = x;
                        if (old !== x) {
                            callWatcher(adapt, key, old, x);
                            adapt.render = true;
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
        if (adapt._options.watch) {
            if (adapt._options.watch[key]) {
                adapt._options.watch[key].apply(adapt, [oldValue, newValue]);
            }
        }
        adapt._render = true;
    }

    function applyDOMChanges(adapt) {
        adapt._updateFunctions.forEach(uf => {
            if (uf.node.nodeType == 1) {
                if (uf.dir == "bind") {
                    const calculatedValue = uf.func.apply(adapt);
                    if (uf.node.getAttribute(uf.attribute) !== calculatedValue) {
                        uf.node.setAttribute(uf.attribute, calculatedValue);
                    }
                } else if (uf.dir == "model") {
                    const calculatedValue = uf.func.apply(adapt);
                    if (uf.node.value !== calculatedValue) {
                        uf.node.value = calculatedValue;
                    }
                } else if (uf.dir == "text") {
                    uf.node.innerText = uf.func.apply(adapt);
                } else if (uf.dir == "html") {
                    uf.node.innerHTML = uf.func.apply(adapt);
                } else if (uf.dir == "visible") {
                    uf.node.style["display"] = uf.func.apply(adapt) ? "" : "none";
                } else if (uf.dir == "style") {

                }
            } else if (uf.node.nodeType == 3) {
                let result = uf.expression;
                Object.entries(uf.areas).forEach(e => {
                    result = result.split(e[0]).join(e[1].apply(adapt));
                });
                uf.node.textContent = result;
            }
        });
    }

    function scan(adapt) {
        adapt._reactNodes = [];
        fillNodes(adapt._el);
        function fillNodes(node) {
            if (isReactNode(node)) {
                adapt._reactNodes.push(node);
            }
            node.childNodes.forEach(fillNodes);
        }
        console.log(adapt._reactNodes);

        adapt._updateFunctions = adapt._reactNodes
            .map(node => {
                const result = new UpdateFunction();
                result.node = node;
                if (node.nodeType == 1) {
                    const attrNames = node.getAttributeNames();
                    attrNames.forEach(name => {
                        if (name.startsWith("b-bind:") || name.startsWith(":")) {
                            result.dir = "bind";
                            result.attribute = name.slice(name.indexOf(":") + 1);
                            result.func = getFunction(adapt, node.getAttribute(name));
                        } else if (name == "b-model") {
                            result.dir = "model";
                            result.func = getFunction(adapt, node.getAttribute(name));
                            node.addEventListener("input", function (e) {
                                adapt[node.getAttribute(name).trim()] = this.value;
                            });
                        } else if (name == "b-text") {
                            result.dir = "text";
                            result.func = getFunction(adapt, node.getAttribute(name));
                        } else if (name == "b-html") {
                            result.dir = "html";
                            result.func = getFunction(adapt, node.getAttribute(name));
                        } else if (name == "b-visible") {
                            result.dir = "visible";
                            result.func = getFunction(adapt, node.getAttribute(name));
                        }
                    });
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

        console.log(adapt._updateFunctions);

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

    function getFunction(adapt, expression) {
        expression = expression.trim();
        let funcBody = adapt._funcPrefix + "return ";
        const isFunc = Boolean(adapt._options.methods[expression]) ||
            (expression.endsWith(")") && !expression.startsWith("(") && (expression.match(/\)/g) || "").length == 1 && (expression.match(/\(/g) || "").length == 1);
        if (isFunc) {
            if (!expression.endsWith(")")) {
                funcBody += expression + ".apply(this)";
            } else {
                const paraIndex = expression.indexOf("(");
                const funcName = expression.slice(0, paraIndex);
                funcBody += funcName + ".apply(this,[" + expression.slice(paraIndex + 1, expression.length - 1) + "])";
            }
        } else {
            funcBody += expression;
        }
        //console.log(funcBody);
        return new Function(funcBody);
    }

    booon.adapt = function (options) {
        return new Adapt(options);
    };
})();
