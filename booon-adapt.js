"use strict";
//@ts-check
(function () {
    class Adapt {
        constructor(options) {
            // el, data, watch, methods, options
            this._options = Object.freeze(options);
            ["methods", "watch", "el", "options"].forEach(name => Object.freeze(options[name] || {}));
            recreateEl(this);
            this._queue = [];
            this._data = enrichData(this, options.data || {}, options.methods || {});
            let that = this;
            this._funcPrefix = (() => {
                let res = "";
                Object.keys(options.data || {}).forEach(k => {
                    res += "const " + k + "=this." + k + ";";
                });
                Object.keys(options.methods || {}).forEach(k => {
                    res += "const " + k + "=this." + k + ";";
                })
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
    function recreateEl(adapt) {
        adapt._el = booon(adapt._options.el);
        if (adapt._el.length > 1) {
            throw new Error("more than one root");
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
        callBindFunctions(adapt);
    }

    function callBindFunctions(adapt) {
        if (adapt._bindFunctions) {
            adapt._bindFunctions.forEach(f => {
                const calculatedValue = f.func.apply(adapt);
                if (f.el.getAttribute(f.attr) !== calculatedValue) {
                    f.el.setAttribute(f.attr, calculatedValue);
                }
            });
        }
    }

    function scan(adapt) {
        adapt._bindFunctions = [];
        adapt._el.find("*")
            .merge(adapt._el)
            .each(e => {
                const attrNames = e.getAttributeNames();
                attrNames.forEach(name => {
                    const bindName = "b-bind:";
                    if (name.startsWith(bindName)) {
                        const realAttr = name.slice(bindName.length);
                        adapt._bindFunctions.push({
                            el: e,
                            attr: realAttr,
                            func: getFunction(adapt, e.getAttribute(name)),
                        });
                    }
                });
            });
        adapt._reactNodes = [];
        if (isReactNode(adapt._el[0])) {

        }
        const dirs = ["b-model", "b-text", "b-html", "b-visible"];
        const dirsStarts = ["b-on:", "@", "b-bind:", ":"];


        function isReactNode(node) {
            if ((node.nodeType == 1 && node != document.body)) {
                const attrNames = e.getAttributeNames();
                for (const name of attrNames) {
                    if (dirs.includes(name) && e.getAttribute(name)) {
                        return true;
                    }
                    if (dirsStarts.some(start => name.startsWith(start))) {
                        return true;
                    }
                }
            } else if (node.nodeType == 3) {
                const start = adapt._options.options.startTag || "{{";
                const end = adapt._options.options.endTag || "}}";

            }
        }
    }

    function getFunction(adapt, expression) {
        expression = expression.trim();
        const isFunc = Boolean(adapt._options.methods[expression]) ||
            (expression.endsWith(")") && !expression.startsWith("(") && (expression.match(/\)/g) || "").length == 1 && (expression.match(/\(/g) || "").length == 1);
        let funcBody = adapt._funcPrefix + "return ";
        if (isFunc) {
            if (!expression.endsWith(")")) {
                funcBody += expression + ".apply(this)";
            } else {
                const paraIndex = expression.indexOf("(");
                const funcName = expression.slice(0, paraIndex);
                funcBody += funcName + ".apply(this,[" + expression.slice(paraIndex + 1, expression.length - 1) + "])";
            }
        } else {
            funcBody += expression
        }
        console.log(funcBody);
        return new Function(funcBody);
    }

    booon.adapt = function (options) {
        return new Adapt(options);
    };
})();
