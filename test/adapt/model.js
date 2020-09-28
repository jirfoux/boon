const tap = require("tap");
const test = tap.test;
const { getDom, getBooon, getAdapt } = require("./dom");

const dom = getDom();
const booon = getBooon(dom);
const adapt = getAdapt(booon);

test("model", t => {
    t.plan(10);
    setTimeout(() => {
        const c1Node = booon("#main>.model>.c1")[0];
        t.equal(c1Node.checked, true);
        const c2Node = booon("#main>.model>.c2")[0];
        t.equal(c2Node.checked, false);
        const r1Node = booon("#main>.model>.r1")[0];
        t.equal(r1Node.checked, true);
        const r2Node = booon("#main>.model>.r2")[0];
        t.equal(r2Node.checked, false);
        const taNode = booon("#main>.model>.ta")[0];
        t.equal(taNode.value, "green");
        const tNode = booon("#main>.model>.t1")[0];
        t.equal(tNode.value, "pingu");

        c1Node.checked = false;
        submitEvent(c1Node, "input");
        adapt.rad = "r2";
        tNode.value = "sok";
        submitEvent(tNode, "input");
        setTimeout(() => {
            t.equal(c1Node.checked, false);
            t.equal(r1Node.checked, false);
            t.equal(r2Node.checked, true);
            t.equal(adapt.text, "sok");
        }, 300);
    }, 300);
});

function submitEvent(node, event) {
    const ev = dom.window.document.createEvent("HTMLEvents");
    ev.initEvent(event, false, true);
    node.dispatchEvent(ev);
}