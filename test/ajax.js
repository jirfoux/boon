const tap = require("tap");
const test = tap.test;
const { getDom, getBooon } = require("./dom");

test("handler", t => {
    t.plan(5);
    const booon = getBooon();
    booon.get({
        url: "http://httpbin.org/status/200",
        success: () => t.true(true),
        error: () => t.true(false)
    });
    booon.get({
        url: "http://httpbin.org/status/200",
        success: () => t.true(true),
        error: () => t.true(false)
    }, () => t.true(true), () => t.true(false));
    booon.get({
        url: "http://httpbin.org/status/400",
        success: () => t.true(false),
        error: () => t.true(true)
    });
    booon.get({
        url: "http://httpbin.org/status/400",
        success: () => t.true(false),
        error: () => t.true(true)
    }, () => t.true(false), () => t.true(true));
    booon.get({
        url: "http://httpbin.org/status/500",
        success: () => t.true(false),
        fail: () => t.true(true)
    });
});

test("methods", t => {
    t.plan(3);
    const booon = getBooon();
    booon.post({
        url: "http://httpbin.org/post",
        success: () => t.true(true),
        error: () => t.true(false)
    });
    booon.post({
        url: "http://httpbin.org/get",
        success: () => t.true(false),
        error: () => t.true(true)
    });
    booon.ajax({
        url: "http://httpbin.org/patch",
        method: "patch",
        success: () => t.true(true),
        error: () => t.true(false)
    });
});

test("headers", t => {
    t.plan(2);
    const booon = getBooon();
    booon.json({
        url: "http://httpbin.org/get",
        accept: "coward",
        success: data => {
            t.equal(data.headers["Accept"], "coward");
        }
    });
    booon.json({
        url: "http://httpbin.org/get",
        accept: "coward",
        headers: { "Accept": "code" },
        success: data => {
            t.equal(data.headers["Accept"], "coward, code");
        }
    });
});

test("timeout", t => {
    t.plan(2);
    const booon = getBooon();
    booon.json({
        url: "http://httpbin.org/get",
        timeout: 10000,
        success: () => t.true(true),
        error: () => t.true(false)
    });
    booon.get({
        url: "http://httpbin.org/get",
        timeout: 4,
        success: () => t.true(false),
        error: () => t.true(true)
    });
});

test("functions", t => {
    t.plan(2);
    const booon = getBooon();
    booon.json({
        url: "http://httpbin.org/get",
        pre: t.true,
        post: t.true
    });
});

test("data", t => {
    t.plan(13);
    const booon = getBooon();
    const obj = { "bob": "andrews= .&", "per": 9, "zack": ["buster", "cloud", "fair", [6, 66]] };
    booon.json({
        url: "http://httpbin.org/get",
        params: obj,
        success: d => {
            t.equal(d.args.bob, "andrews= .&");
            t.equal(d.args.per, "9");
            t.equal(d.args.zack.length, 4);
            t.equal(Object.keys(d.args).length, 3);
        }
    });
    booon.json({
        url: "http://httpbin.org/get?perl=hammer",
        params: obj,
        success: d => {
            t.equal(Object.keys(d.args).length, 4);
        }
    });
    booon.post({
        url: "http://httpbin.org/post",
        params: obj,
        success: d => {
            d = JSON.parse(d);
            t.equal(d.args.bob, "andrews= .&");
            t.equal(d.args.per, "9");
            t.equal(d.args.zack.length, 4);
        }
    });
    booon.post({
        url: "http://httpbin.org/post",
        data: obj,
        success: d => {
            d = JSON.parse(d);
            t.equal(d.form.bob, "andrews= .&");
            t.equal(d.form.per, "9");
            t.equal(d.form.zack.length, 4);
        }
    });
    booon.post({
        url: "http://httpbin.org/post",
        data: new URLSearchParams("boy=oy"),
        success: d => {
            d = JSON.parse(d);
            t.equal(d.form.boy, "oy");
        }
    });
    const str = new Date().toUTCString() + "= .&";
    booon.post({
        url: "http://httpbin.org/post",
        data: str,
        success: d => {
            d = JSON.parse(d);
            t.equal(d.data, str);
        }
    });
});

test("converter", t => {
    t.plan(2);
    const booon = getBooon();
    booon.get({
        url: "http://httpbin.org/get",
        responseConverter: d => d.trim()[0],
        success: d => t.equal(d, "{")
    });
    booon.json({
        url: "http://httpbin.org/get",
        responseConverter: d => d.args,
        success: d => t.deepEqual(d, {})
    });
});

