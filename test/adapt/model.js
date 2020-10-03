const tap = require("tap");
const test = tap.test;
const { getDom, getBooon, getAdapt } = require("./dom");

const dom = getDom();
const booon = getBooon(dom);
const adapt = getAdapt(booon);

test("model", t => {
    t.plan(13);
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
        const t1Node = booon("#main>.model>.t1")[0];
        t.equal(t1Node.value, "pingu");
        const t2Node = booon("#main>.model>.t2")[0];

        c1Node.checked = false;
        submitEvent(c1Node, "input");
        adapt.rad = "r2";
        t1Node.value = "sok";
        submitEvent(t1Node, "input");
        setTimeout(() => {
            t.equal(c1Node.checked, false);
            t.equal(r1Node.checked, false);
            t.equal(r2Node.checked, true);
            t.equal(adapt.text, "sok");
            t.equal(t2Node.value, "sok");
            t2Node.value = "sok2";
            submitEvent(t2Node, "input");
            setTimeout(() => {
                t.equal(adapt.text, "sok");
                submitEvent(t2Node, "change");
                setTimeout(() => {
                    t.equal(adapt.text, "sok2");
                }, 300);
            }, 300);
        }, 300);
    }, 300);
});

function submitEvent(node, event) {
    const ev = dom.window.document.createEvent("HTMLEvents");
    ev.initEvent(event, false, true);
    node.dispatchEvent(ev);
}