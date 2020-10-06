"use strict";
(function () {
    // ALIAS //
    class NodeBuilder {
        constructor(tag) {
            this.tag = tag;
        }
        attr(key, value) {
            let attributes = this.attrs || (this.attrs = []);
            attributes.push({ k: key, v: value });
            return this;
        }
        id(id) {
            return this.attr("id", id);
        }
        clazz(clazz) {
            let classes = this.classes || (this.classes = []);
            classes.push(...(Array.isArray(clazz) ? clazz : [clazz]));
            return this;
        }
        html(html) {
            this.htmll = html;
            return this;
        }
        node(node) {
            let nodes = this.nodes || (this.nodes = []);
            nodes.push(node);
            return this;
        }
        buildString() {
            let result = "";
            result += "<" + this.tag + " ";
            if (this.classes) {
                result += "class=\"" + this.classes.join(" ") + "\" ";
            }
            if (this.attrs) {
                result += this.attrs.map(attr => attr.k + "=\"" + attr.v + "\"").join(" ");
            }
            result += ">";

            if (this.htmll) {
                if (this.htmll instanceof NodeBuilder) {
                    this.htmll = this.htmll.buildString();
                }
                result += this.htmll;
            }
            if (this.nodes) {
                result += this.nodes.map(node => {
                    if (typeof node == "string") {
                        return node;
                    } else if (node instanceof NodeBuilder) {
                        return node.buildString();
                    } else if (typeof node == "object" && node.nodeType == Node.ELEMENT_NODE) {
                        return node.outerHTML;
                    }
                    return "";
                }).join(" ");
            }
            result += "</" + this.tag + ">";
            return result;
        }
        buildNode(parent) {
            let result = document.createElement(this.tag);
            if (this.classes) {
                this.classes.forEach(clazz => clazz.trim().split(" ").forEach(c => result.classList.add(c)));
            }
            if (this.attrs) {
                this.attrs.forEach(attr => result.setAttribute(attr.k, attr.v));
            }
            if (this.htmll) {
                if (this.htmll instanceof NodeBuilder) {
                    this.htmll = this.htmll.buildString();
                }
                result.innerHTML = this.htmll || "";
            }
            if (this.nodes) {
                this.nodes.forEach(node => {
                    if (typeof node == "string") {
                        result.innerHTML += node;
                    } else if (node instanceof NodeBuilder) {
                        node.buildNode(result);
                    } else if (typeof node == "object" && node.nodeType == Node.ELEMENT_NODE) {
                        result.appendChild(node);
                    }
                });
            }
            if (parent) {
                let p = parent instanceof Element ? parent : document.querySelector(parent);
                if (p) {
                    p.appendChild(result);
                }
            }
            return result;
        }
    }
    if (!window.booon) {
        window.booon = {};
    }
    booon.nodeBuilder = (tag) => new NodeBuilder(tag);
})();
