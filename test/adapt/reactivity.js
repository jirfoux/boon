const tap = require("tap");
const test = tap.test;
const { getDom, getBooon, getAdapt } = require("./dom");

const dom = getDom();
const booon = getBooon(dom);
const adapt = getAdapt(booon);

test("watcher", t => {
    t.plan(2)
    adapt.w1 = 4;
    t.equal(adapt.w2, 8)
    t.equal(adapt.num, 9)
})

test("react", t => {
    t.plan(10)
    adapt.texts.unshift(1)
    t.equal(adapt.count, 1)
    adapt.texts.shift()
    t.equal(adapt.count, 2)
    adapt.texts = []
    t.equal(adapt.count, 3)
    adapt.texts.unshift("_1")
    t.equal(adapt.count, 4)
    adapt.oo.arr.push("d")
    t.equal(adapt.count, 5)
    adapt.oo.arr = []
    t.equal(adapt.count, 6)
    adapt.oo.rd = []
    t.equal(adapt.count, 6)
    adapt.oo.k.dir = ""
    t.equal(adapt.count, 7)
    adapt.oo.k = { dir: "ent" }
    t.equal(adapt.count, 8)
    adapt.oo.k.dir = "_"
    t.equal(adapt.count, 9)
})