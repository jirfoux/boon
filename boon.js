"use strict";
if (document.documentMode) {
    setInterval(() => {
        document.body.innerHTML = "<h1>Internet Explorer is not supported</h1>";
    }, 3000);
}
const _distinct = (elements) => {
    return [...new Set(elements)];
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
        return this.elements;
    }
    copy() {
        return new Boon(this.elements);
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
        return new Boon(_distinct(this.elements.map(element => element.parentElement).filter(e => e)));
    }
    children() {
        return new Boon(_distinct(this.elements
            .flatMap(element => Array.from(element.childNodes))
            .filter(e => e && e.nodeType == Node.ELEMENT_NODE)));
    }
    siblings() {
        return new Boon(_distinct(this.elements
            .map(element => element.parentElement)
            .flatMap(element => Array.from(element.childNodes))
            .filter(e => e && e.nodeType == Node.ELEMENT_NODE)));
    }
    find(selector) {
        return new Boon(_distinct(Array.from(this.elements.map(element => element.querySelectorAll(selector))).map(nodeList => Array.from(nodeList)).flat()));
    }
    filter(predicate) {
        return new Boon(this.elements.filter(e => {
            if (typeof predicate == "string") {
                return e.matches(predicate);
            } else if (typeof predicate == "function") {
                return predicate(e);
            }
        }));
    }
    map(mapper) {
        return new Boon(this.elements.map(e => mapper(e)).filter(e => e instanceof Node));
    }
    //---NAVIGATION---
    //+++EVENT+++
    on(type, listener, capture) {
        return this.each(element => element.addEventListener(type, listener, capture));
    }
    click(listener) {
        return this.on("click", listener);
    }
    hover(enterListener, leaveListener) {
        if (enterListener) {
            this.on("mouseenter", enterListener);
        }
        if (leaveListener) {
            this.on("mouseleave", leaveListener);
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
        if (this.css("display" == "none")) {
            this.show();
        } else {
            this.hide();
        }
        return this;
    }
    css(property, value) {
        if (value === undefined) {
            let element = this[0];
            if (element) {
                return element.style[property];
            }
        } else {
            return this.each(element => element.style[property] = value);
        }
    }
    html(value) {
        if (value === undefined) {
            let element = this[0];
            if (element) {
                return element.innerHTML;
            }
        } else {
            return this.each(element => element.innerHTML = value || "");
        }
    }
    attr(attribute, value) {
        if (value === undefined) {
            let element = this[0];
            if (element) {
                return element.getAttribute(attribute);
            }
        } else {
            return this.each(element => value == null ? element.removeAttribute(attribute) : element.setAttribute(attribute, value));
        }
    }
    prop(property, value) {
        if (value === undefined) {
            let element = this[0];
            if (element) {
                return element[property];
            }
        } else {
            return this.each(element => element[property] = value || "");
        }
    }
    val(value) {
        return this.prop("value", value);
    }
    remove() {
        this.each(element => element.remove());
        delete this;
    }
}
const boon = function (value, argument) {
    if (!value) return;
    let valueType = typeof value;
    if (value instanceof Boon) {
        return new Boon(value.elements.slice());
    } else if (value instanceof NodeList) {
        return new Boon(Array.from(value))
    } else
        if (valueType == "function") {
            if (document.readyState == "complete") {
                value(argument);
            } else {
                document.addEventListener("DOMContentLoaded", value);
            }
        } else if ((valueType == "object" && (value.nodeType == Node.ELEMENT_NODE || value.nodeType == Node.DOCUMENT_NODE))//
            || valueType == "string") {
            return valueType == "object" ? new Boon([value]) : new Boon(Array.from((argument || document).querySelectorAll(value)));
        } else {
            return new Boon([]);
        }
}

window.boon = boon;
if (!window.$) {
    window.$ = window.boon;
}
