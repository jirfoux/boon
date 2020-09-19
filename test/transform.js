const tap = require("tap");
const test = tap.test;
const { getDom, getBooon } = require("./dom");

test("filter", t => {
    t.plan(4);
    const booon = getBooon();
    t.equal(booon("div").length, 4);
    t.equal(booon("div").filter(n => n.id === "why").length, 1);
    t.equal(booon("div").filter("div").length, 4);
    t.equal(booon("div").filter("span").length, 0);
});

test("parent", t => {
    t.plan(3);
    const booon = getBooon();
    t.equal(booon("div>div").parent().length, 1);
    t.equal(booon("h3,h2").parent().length, 1);
    t.equal(booon("#why,#what").parent().length, 2);
});

test("children", t => {
    t.plan(2);
    const booon = getBooon();
    t.equal(booon("#what").children().length, 2);
    t.equal(booon(".w").children().length, 2);
});

test("siblings", t => {
    t.plan(2);
    const booon = getBooon();
    t.equal(booon("#why").siblings().length, 1);
    t.equal(booon("#why").siblings(true).length, 2);
});

test("find", t => {
    t.plan(2);
    const booon = getBooon();
    t.equal(booon("h2").find("span").length, 1);
    t.equal(booon("h2").find("h2").length, 0);
});

test("limit", t => {
    t.plan(1);
    const booon = getBooon();
    t.equal(booon("div").limit(2).length, 2);
});

test("map", t => {
    t.plan(1);
    const booon = getBooon();
    t.equal(booon("h3,h2").map(n => n.parentNode).length, 1);
});

test("merge", t => {
    t.plan(2);
    const booon = getBooon();
    t.equal(booon("input").merge("a").length, 2);
    t.equal(booon("div").merge("#what").length, booon("div").length);
});
