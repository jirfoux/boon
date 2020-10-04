const tap = require("tap");
const test = tap.test;
const { getDom, getBooon, getAdapt } = require("./dom");

const booon = getBooon(getDom());
getAdapt(booon);
test("bind", t => {
    t.plan(5);
    setTimeout(() => {
        const sNode = booon("#main>.bind>.string")[0];
        t.equal(sNode.getAttribute("tank"), "green");
        const ssNode = booon("#main>.bind>.string-static")[0];
        t.equal(ssNode.getAttribute("tank"), "z");
        const wrongNode = booon("#main>.bind>.wrong")[0];
        t.equal(wrongNode.getAttribute("tank"), null);
        const isoRegex = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
        const m1Node = booon("#main>.bind>.m1")[0];
        t.ok(isoRegex.test(m1Node.getAttribute("date")));
        const m2Node = booon("#main>.bind>.m2")[0];
        t.ok(isoRegex.test(m2Node.getAttribute("date")));
    }, 300);
});

test("class", t => {
    t.plan(8);
    setTimeout(() => {
        const coNode = booon("#main>.bind>.c-object")[0];
        t.ok(coNode.classList.contains("foo"));
        t.notOk(coNode.classList.contains("bar"));
        const csNode = booon("#main>.bind>.c-string")[0];
        t.ok(csNode.classList.contains("brad"));
        t.ok(csNode.classList.contains("pitt"));
        t.ok(csNode.classList.contains("c-string"));
        const caNode = booon("#main>.bind>.c-array")[0];
        t.ok(caNode.classList.contains("c-array"));
        t.ok(caNode.classList.contains("blue"));
        t.ok(caNode.classList.contains("green"));
    }, 300);
});