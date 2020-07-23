// @ts-check
"use strict";
if (document.documentMode) {
    setInterval(() => {
        document.body.innerHTML = "<h1>Internet Explorer is not supported</h1>";
    }, 1000);
}
class Boon {
    constructor(elements) {
        if (!Array.isArray(elements))
            throw new Error("no array");
        this.elements = Array.from(elements);
        for (let i = 0; i < this.elements.length; i++) {
            this[i] = this.elements[i];
        }
    }
    each(func) {
        this.elements.forEach(element => func(element));
        return this;
    }
    get length() {
        return this.elements.length;
    }
    get all() {
        return this.elements.slice();
    }
    //+++CLASS+++
    addClass(c) {
        return this.each(element => element.classList.add(c));
    }
    removeClass(c) {
        return this.each(element => element.classList.remove(c));
    }
    toggleClass(c) {
        return this.each(element => element.classList.toggle(c));
    }
    //---CLASS---
    //+++NAVIGATION+++
    parent() {
        return boon(boon._distinct(this.elements.map(element => element.parentElement)));
    }
    children() {
        return boon(boon._distinct(this.elements
            .flatMap(element => Array.from(element.childNodes))));
    }
    siblings() {
        function s(elem) {
            var siblings = [];
            var sibling = elem.parentNode.firstChild;
            while (sibling) {
                if (sibling.nodeType === 1 && sibling !== elem) {
                    siblings.push(sibling);
                }
                sibling = sibling.nextSibling;
            }
            return siblings;
        };
        return boon(boon._distinct(this.elements
            .flatMap(element => s(element))
        ));

        /*return boon(boon._distinct(this.elements
            .map(element => element.parentElement)
            .filter(element => element)
            .flatMap(element => Array.from(element.childNodes))));*/
    }
    find(selector) {
        return boon(boon._distinct(this.elements
            .flatMap(element => Array.from(element.querySelectorAll(selector)))));
    }
    filter(predicate) {
        return boon(this.elements.filter(e => {
            if (typeof predicate == "string") {
                return e.matches(predicate);
            } else if (typeof predicate == "function") {
                return predicate(e);
            }
        }));
    }
    limit(num) {
        return boon(this.elements.slice(0, num))
    }
    map(mapper) {
        return boon(this.mapToArray(mapper));
    }
    mapToArray(mapper) {
        return this.elements.map(e => mapper(e));
    }
    //---NAVIGATION---
    //+++EVENT+++
    on(type, listener, capture) {
        return this.each(element => element.addEventListener(type, listener, capture));
    }
    click(listener) {
        return this.on("click", listener);
    }
    hover(enterListener, leaveListener, capture) {
        if (enterListener) {
            this.on("mouseenter", enterListener, capture);
        }
        if (leaveListener) {
            this.on("mouseleave", leaveListener, capture);
        }
        return this;
    }
    //---EVENT---
    show() {
        return this.css("display", "");
    }
    hide() {
        return this.css("display", "none");
    }
    toggle() {
        if (this.css("display") == "none") {
            this.show();
        } else {
            this.hide();
        }
        return this;
    }
    css(property, value) {
        if (value === undefined) {
            return this._a(element => element.style[property]);
        } else {
            return this.each(element => element.style[property] = value);
        }
    }
    html(value) {
        if (value === undefined) {
            return this._a(element => element.innerHTML);
        } else {
            return this.each(element => element.innerHTML = value || "");
        }
    }
    text(value) {
        if (value === undefined) {
            return this._a(element => element.innerText);
        } else {
            return this.each(element => element.innerText = value || "");
        }
    }
    attr(attribute, value) {
        if (value === undefined) {
            return this._a(element => element.getAttribute(attribute));
        } else {
            return this.each(element => value == null ? element.removeAttribute(attribute) : element.setAttribute(attribute, value));
        }
    }
    prop(property, value) {
        if (value === undefined) {
            return this._a(element => element[property]);
        } else {
            return this.each(element => element[property] = value);
        }
    }
    val(value) {
        return this.prop("value", value);
    }
    remove() {
        this.each(element => element.remove());
    }
    data(key, value) {
        if (value === undefined) {
            return this._a(element => element.dataset[key]);
        } else {
            return this.each(element => {
                if (value == null) {
                    delete element.dataset[key];
                } else {
                    element.dataset[key] = typeof value == "object" ? JSON.stringify(value) : value
                }
            });
        }
    }
    //apply function for first element and return result
    _a(func) {
        let element = this[0];
        if (element) {
            return func(element);
        }
    }
    merge(value) {
        const newBoon = boon(value);
        const newElements = newBoon.elements;
        this.each(element => { if (!newElements.includes(element)) newElements.push(element); });
        return boon(newElements);
    }
}
const boon = function (value, argument) {
    if (!value) return new Boon([]);
    let valueType = typeof value;
    if (value instanceof Boon) {
        return value;
    } else if (value instanceof NodeList) {
        return new Boon(Array.from(value))
    } else if (Array.isArray(value)) {
        return new Boon(value.filter(boon._validNode))
    } else
        if (valueType == "function") {
            if (document.readyState == "complete") {
                value(argument);
            } else {
                document.addEventListener("DOMContentLoaded", () => value(argument));
            }
        } else if (boon._validNode(value)) {
            return new Boon([value]);
        } else if (valueType == "string") {
            return boon((argument || document).querySelectorAll(value));
        } else {
            return new Boon([]);
        }
}
boon._distinct = (elements) => { return [...new Set(elements)]; }
boon._validNode = node => node && (node.nodeType == Node.ELEMENT_NODE || node.nodeType == Node.DOCUMENT_NODE);
window.boon = boon;
