const tap = require("tap");
const test = tap.test;
const { getDom, getBooon, getAdapt } = require("./dom");

const dom = getDom();
const booon = getBooon(dom);
const adapt = getAdapt(booon);

test("error", t => {
    t.plan(4)
    setTimeout(() => {
        // empty object
        t.throws(() => {
            booon.adapt({})
        })
        // invalid element
        t.throws(() => {
            booon.adapt({ el: 4 })
        })
        // invalid element
        t.throws(() => {
            booon.adapt({ el: dom.window.document })
        })
        // invalid data property name
        t.throws(() => {
            booon.adapt({ el: dom.window.document.body.children[0], data: { "_lala": 3 } })
        })

    }, 300);
})

test("init", t => {
    t.plan(1)
    let count = 0;
    booon.adapt({ el: dom.window.document.body.children[0], init: () => count++ })
    setTimeout(() => {
        t.equal(count, 1)
    }, 300);
})

test("computed", t => {
    t.plan(3)
    t.equal(adapt.full, "green0")
    adapt.full = 4
    t.equal(adapt.full, "green0")
    adapt.c = 3;
    setTimeout(() => {
        t.equal(adapt.full, 3)
    }, 200);
})