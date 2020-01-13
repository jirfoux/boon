"use strict";
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
        return new Boon(this.elements.slice());
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
    parent() {
        return new Boon([...new Set(this.elements.map(element => element.parentElement).filter(e => e))]);
    }
    //+++EVENT+++
    on(type, listener) {
        return this.each(element => element.addEventListener(type, listener));
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
        return this.each(element => element.style.display = null);
    }
    hide() {
        return this.each(element => element.style.display = "none");
    }
    find(selector) {
        return new Boon([...new Set(Array.from(this.elements.map(element => element.querySelectorAll(selector))).map(nodeList => Array.from(nodeList)).flat())]);
    }
    attr(attribute, value) {
        if (value === undefined) {
            let element = this.getElement();
            if (element) {
                return element.getAttribute(attribute);
            }
        } else {
            return this.each(element => value == null ? element.removeAttribute(attribute) : element.setAttribute(attribute, value));
        }
    }
    prop(property, value) {
        if (value === undefined) {
            let element = this.getElement();
            if (element) {
                return element[property];
            }
        } else {
            return this.each(element => element[property] = value);
        }
    }
    val(value) {
        return this.prop("value", value);
    }
    filter(predicate) {
        return new Boon(this.elements.filter(predicate));
    }
}
const boon = function (value, argument) {
    if (!value) return;
    let valueType = typeof value;
    if (value instanceof Boon) {
        return new Boon(value.elements);
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
