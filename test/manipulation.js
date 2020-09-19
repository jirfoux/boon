const tap = require("tap");
const test = tap.test;
const { getDom, getBooon } = require("./dom");

test("css", t => {
    t.plan(6);
    const booon = getBooon();
    t.equal(booon("p").hide().css("display"), "none");
    t.equal(booon("p").show().css("display"), "");
    t.equal(booon("p").css("foo", "bar").css("foo"), "bar");
    t.equal(booon("p").toggle().css("display"), "none");
    t.equal(booon("p").toggle().css("display"), "");
    t.equal(booon("p").toggle(true).css("display"), "");
});

test("html", t => {
    t.plan(2);
    const booon = getBooon();
    t.equal(booon(".single").html().trim(), "<code>kino</code>");
    t.equal(booon("p").html("<div>mars</div>").html().trim(), "<div>mars</div>");
});

test("text", t => {
    t.plan(1);
    const booon = getBooon();
    //t.equal(booon(".single").text().trim(), "kino"); TODO
    t.equal(booon("p").text("<div>mars</div>").text().trim(), "<div>mars</div>");
});

test("attributes", t => {
    t.plan(3);
    const booon = getBooon();
    t.equal(booon("body>a").attr("href"), "wanda");
    t.equal(booon("body>a").attr("href", "peter").attr("href"), "peter");
    t.equal(booon("body>a").attr("href", null).attr("href"), null);
});

test("properties", t => {
    t.plan(4);
    const booon = getBooon();
    t.equal(booon("#cb").prop("checked"), true);
    t.equal(booon("#cb").prop("checked", false).prop("checked"), false);
    t.equal(booon("#cb").prop("checked", true).prop("checked"), true);
    t.equal(booon("#cb").prop("value", "T").prop("value"), "T");
});

test("remove", t => {
    t.plan(2);
    const booon = getBooon();
    t.true(booon("div").length);
    booon("div").remove();
    t.equal(booon("div").length, 0);
});

test("data", t => {
    t.plan(3);
    const booon = getBooon();
    t.equal(booon(".single").data("cat"), "dog");
    t.equal(booon(".single").data("cat", "mouse").data("cat"), "mouse");
    t.equal(booon(".single").data("data", { past: 9, future: "pizza" }).data("data"), "{\"past\":9,\"future\":\"pizza\"}");
});