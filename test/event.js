const tap = require("tap");
const test = tap.test;
const { getDom, getBooon } = require("./dom");

test("event", t => {
    t.plan(3);
    const booon = getBooon();
    const dom = getDom();
    count = 0;
    booon("#what").on("click", () => count++);
    dispatchEvent(dom, booon("#what")[0], "click");
    t.equal(count, 1);
    booon("#why").once("click", () => count++);
    dispatchEvent(dom, booon("#why")[0], "click");
    t.equal(count, 2);
    dispatchEvent(dom, booon("#why")[0], "click");
    t.equal(count, 2);

});

function dispatchEvent(dom, element, eventType) {
    const evt = dom.window.document.createEvent("HTMLEvents");
    evt.initEvent(eventType, false, true);
    element.dispatchEvent(evt);
}
