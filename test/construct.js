const tap = require("tap");
const test = tap.test;
const { getDom, getBooon } = require("./dom");

test("string", t => {
    t.plan(5);
    const booon = getBooon();
    t.equal(booon("p").length, 1);
    t.equal(booon("#what").length, 1);
    t.equal(booon("span").length, 3);
    t.equal(booon("span", booon("#what")[0]).length, 2);
    t.equal(booon("span", "#what").length, 2);
});

test("booon", t => {
    t.plan(2);
    const booon = getBooon();
    const b = booon("p");
    t.equal(booon(b), b);
    t.equal(booon().length, 0);
});

test("nodes", t => {
    t.plan(4);
    const booon = getBooon();
    const dom = getDom();
    const nodelist = dom.window.document.querySelectorAll("span");
    const array = Array.from(nodelist);
    t.deepEqual(booon(array).all, array);
    t.equal(booon(["test", nodelist[0]])[0], nodelist[0]);
    t.equal(booon(array[0])[0], array[0]);
    t.deepEqual(booon(4).all, []);
    // NodeList cannot be tested with node
});

test("function", t => {
    t.plan(3);
    const booon = getBooon();
    let count = 0;
    booon(inc => count += inc, 5);
    t.equal(count, 0);
    setTimeout(() => {
        t.equal(count, 5);
        booon((a, b) => count += a + b, 1, 2);
        t.equal(count, 8);
    }, 1000);
});