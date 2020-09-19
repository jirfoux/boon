
const tap = require("tap");
const test = tap.test;
const { getDom, getBooon } = require("./dom");

test("has class", t => {
    t.plan(6);
    const booon = getBooon();
    t.true(booon("h2").hasClass("karl") && booon("h2").hasClass("peter"));
    t.false(booon("h2").hasClass("mike"));
    t.true(booon("h3").hasClass("mike"));
    t.false(booon("h3").hasClass("peter"));

    t.false(booon("h2").hasClass(null));
    t.false(booon("h2").hasClass());
});

const testClasses = ["tony", "stark", "pepper"];

test("add class", t => {
    t.plan(3);
    const booon = getBooon();
    t.false(booon("p").hasClass(testClasses[0]));
    booon("p").addClass(testClasses[0]);
    t.true(booon("p").hasClass(testClasses[0]));
    booon("p").addClass(testClasses);
    t.true(testClasses.every(c => booon("p").hasClass(c)));
});

test("remove class", t => {
    t.plan(4);
    const booon = getBooon();
    booon("p").addClass(testClasses);
    t.true(testClasses.every(c => booon("p").hasClass(c)));
    booon("p").removeClass(testClasses[0]);
    t.false(booon("p").hasClass(testClasses[0]));
    t.true(booon("p").hasClass(testClasses[1]));
    booon("p").removeClass(testClasses);
    t.false(testClasses.some(c => booon("p").hasClass(c)));
});

test("toggle class", t => {
    t.plan(5);
    const booon = getBooon();
    booon("p").removeClass(testClasses);
    t.false(testClasses.some(c => booon("p").hasClass(c)));
    booon("p").toggleClass(testClasses[0]);
    t.true(booon("p").hasClass(testClasses[0]));
    booon("p").toggleClass(testClasses[0]);
    t.false(booon("p").hasClass(testClasses[0]));
    booon("p").toggleClass(testClasses);
    booon("p").toggleClass(testClasses[0]);
    t.false(booon("p").hasClass(testClasses[0]));
    t.true(booon("p").hasClass(testClasses[1]));
});