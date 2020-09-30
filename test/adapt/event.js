const tap = require("tap");
const test = tap.test;
const { getDom, getBooon, getAdapt } = require("./dom");

const dom = getDom();
const booon = getBooon(dom);
const adapt = getAdapt(booon);

test("event", t => {
    t.plan(2);
    setTimeout(() => {
        const c1Node = booon("#main>.event>.c1")[0];
        submitEvent(c1Node, "click");
        const c2Node = booon("#main>.event>.c2")[0];
        submitEvent(c2Node, "click");
        const c3Node = booon("#main>.event>.c3")[0];
        submitEvent(c3Node, "click");
        setTimeout(() => {
            t.equal(adapt.num, 15);
            t.ok(adapt.ee);
        }, 300);
    }, 300);
});

function submitEvent(node, event) {
    const ev = dom.window.document.createEvent("HTMLEvents");
    ev.initEvent(event, false, true);
    node.dispatchEvent(ev);
}