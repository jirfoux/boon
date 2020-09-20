const tap = require("tap");
const test = tap.test;
const { getDom, getBooon } = require("./dom");

test("attr", t => {
    t.plan(3);
    const booon = getBooon();
    const builder = booon.nodeBuilder("pre")
        .attr("data-mol", "kid")
        .id("joke");
    t.equal(booon("p").html(builder.buildString()).find("pre#joke").data("mol"), "kid");
    booon("p").html("");
    t.equal(builder.buildNode("p").id, "joke");
    t.equal(booon("p").find("pre#joke").data("mol"), "kid");
});

test("class", t => {
    t.plan(10);
    const booon = getBooon();
    const builder = booon.nodeBuilder("pre")
        .clazz("one")
        .clazz(["two", "three"])
        .clazz("four five");
    booon("p").html(builder.buildString());
    ["one", "two", "three", "four", "five"].forEach(c => t.true(booon("p>pre").hasClass(c)));
    booon("p").html("");
    builder.buildNode("p");
    ["one", "two", "three", "four", "five"].forEach(c => t.true(booon("p>pre").hasClass(c)));
});

test("html", t => {
    t.plan(4);
    const booon = getBooon();
    let builder = booon.nodeBuilder("pre")
        .html("<h6 id=\"z\">king</h6>");
    booon("p").html(builder.buildString());
    t.equal(booon("p>pre>h6")[0].id, "z");
    booon("p").html("");
    builder.buildNode("p");
    t.equal(booon("p>pre>h6")[0].id, "z");
    booon("p").html("");
    builder = booon.nodeBuilder("pre")
        .html(booon.nodeBuilder("h6").id("z"));
    booon("p").html(builder.buildString());
    t.equal(booon("p>pre>h6")[0].id, "z");
    booon("p").html("");
    builder.buildNode("p");
    t.equal(booon("p>pre>h6")[0].id, "z");
});

test("node", t => {
    t.plan(6);
    const booon = getBooon();
    let builder = booon.nodeBuilder("pre")
        .node("<h6 id=\"z\">king</h6>");
    booon("p").html(builder.buildString());
    t.equal(booon("p>pre>h6")[0].id, "z");
    booon("p").html("");
    builder.buildNode("p");
    t.equal(booon("p>pre>h6")[0].id, "z");
    booon("p").html("");
    builder = booon.nodeBuilder("pre")
        .node(booon.nodeBuilder("h6").id("z"));
    booon("p").html(builder.buildString());
    t.equal(booon("p>pre>h6")[0].id, "z");
    booon("p").html("");
    builder.buildNode("p");
    t.equal(booon("p>pre>h6")[0].id, "z");
    booon("p").html("");
    let newNode = getDom().window.document.createElement("pre");
    newNode.innerHTML = "<h6 id=\"z\">king</h6>";
    builder = booon.nodeBuilder("pre")
        .node(newNode);
    console.log(builder.buildString());
    booon("p").html(builder.buildString());
    t.equal(booon("p>pre>pre>h6")[0].id, "z");
    booon("p").html("");
    const dom = getDom();
    const b = dom.window.booon;
    builder = b.nodeBuilder("pre")
        .node(newNode);
    newNode = dom.window.document.createElement("pre");
    newNode.innerHTML = "<h6 id=\"z\">king</h6>";
    builder = b.nodeBuilder("pre")
        .node(newNode);
    builder.buildNode("p");
    t.equal(b("p>pre>pre>h6")[0].id, "z");
});
