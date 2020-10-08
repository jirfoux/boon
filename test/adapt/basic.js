const tap = require("tap");
const test = tap.test;
const { getDom, getBooon, getAdapt } = require("./dom");

const dom = getDom();
const booon = getBooon(dom);
const adapt = getAdapt(booon);

test("error", t => {
    t.plan(9);
    setTimeout(() => {
        // empty object
        t.throws(() => {
            booon.adapt({});
        });
        // invalid element
        t.throws(() => {
            booon.adapt({ el: 4 });
        });
        // invalid element
        t.throws(() => {
            booon.adapt({ el: dom.window.document });
        });
        // invalid data property name
        t.throws(() => {
            booon.adapt({ el: dom.window.document.body.children[0], data: { "_lala": 3 } });
        });
        const data = () => ({
            "t": "T",
            "html": function () { return this.t; }
        });
        const a1 = booon.adapt({ el: "#main3, #main2", data: data() });
        setTimeout(() => {
            t.equal(a1._el.length, 2);
        }, 300);

        const a2 = booon.adapt({ el: dom.window.document.querySelectorAll("#main3, #main2"), data: data() });
        setTimeout(() => {
            t.equal(a2._el.length, 2);
        }, 300);

        const a3 = booon.adapt({
            el: Array.from(dom.window.document.querySelectorAll("#main3, #main2")),
            data: data()
        });
        setTimeout(() => {
            t.equal(a3._el.length, 2);
            t.equal(booon("#main2>.t").html(), "T");
            t.equal(booon("#main3>.t").html(), "T");
        }, 300);

    }, 300);
});

test("init", t => {
    t.plan(1);
    let count = 0;
    booon.adapt({ el: dom.window.document.body.children[0], init: () => count++ });
    setTimeout(() => {
        t.equal(count, 1);
    }, 300);
});

test("computed", t => {
    t.plan(3);
    t.equal(adapt.full, "green0");
    adapt.full = 4;
    t.equal(adapt.full, "green0");
    adapt.c = 3;
    setTimeout(() => {
        t.equal(adapt.full, 3);
    }, 200);
});