const tap = require("tap");
const test = tap.test;
const { getDom, getBooon } = require("./dom");

test("basic", t => {
    t.plan(5);
    const booon = getBooon();
    const dom = getDom();
    const div1 = dom.window.document.getElementById("what");
    const div2 = dom.window.document.getElementById("why");
    const divs = [div1, div2];
    t.deepEqual(booon(divs).all, divs);
    t.equal(booon(divs).length, 2);
    let count = 0;
    booon(divs).each(() => count++);
    t.equal(count, 2);
    t.equal(booon("#what>*").mapToArray(n => n.tagName.length).reduce((t, c) => t + c, 0), 8);

    t.equal(booon(".w").children().last.id, "when");
});
