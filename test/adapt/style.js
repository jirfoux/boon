const tap = require("tap");
const test = tap.test;
const { getDom, getBooon,getAdapt } = require("./dom");

const booon = getBooon(getDom());
getAdapt(booon);
test("style", t => {
    t.plan(6);
    setTimeout(() => {
        const refNode = booon("#main>.style>.ref")[0];
        t.equal(refNode.style["font-size"], "8em");
        t.equal(refNode.style["top"], "3px");
        const inlineNode = booon("#main>.style>.inline")[0];
        t.equal(inlineNode.style["color"], "green");
        t.equal(inlineNode.style["display"], "flex");
        const inlineStaticNode = booon("#main>.style>.inline-static")[0];
        t.equal(inlineStaticNode.style["backgroundColor"], "aqua");
        t.equal(inlineStaticNode.style["display"], "grid");
    }, 300);

});

test("visible", t => {
    t.plan(3);
    setTimeout(() => {
        const vNode1 = booon("#main>.style>.visible1")[0];
        t.equal(vNode1.style["display"], "");
        const vNode2 = booon("#main>.style>.visible2")[0];
        t.equal(vNode2.style["display"], "none");
        const vNode3 = booon("#main>.style>.visible3")[0];
        t.equal(vNode3.style["display"], "");
    }, 300);

});