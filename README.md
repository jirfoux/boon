# booon
###### **b**uilt **o**n **o**ur **o**wn **n**etwork

### [github](https://github.com/Jelenkee/booon)
![](https://badgen.net/github/watchers/Jelenkee/booon)
![](https://badgen.net/github/stars/Jelenkee/booon)
![](https://badgen.net/github/commits/Jelenkee/booon)
![](https://badgen.net/github/last-commit/Jelenkee/booon)
![](https://badgen.net/github/license/Jelenkee/booon)
### [npm](https://www.npmjs.com/package/booon)
![](https://badgen.net/npm/v/booon)
![](https://badgen.net/npm/dw/booon)
![](https://badgen.net/npm/license/booon)

![](https://badgen.net/jsdelivr/hits/npm/booon)

---

A collection of JavaScript libraries.
I do not recommend using one of them (especially not in production).

Probably _not_ compatible with ![](https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Internet_Explorer_10%2B11_logo.svg/20px-Internet_Explorer_10%2B11_logo.svg.png).


| Library  | Better alternatives|
| ---  | --- |
| booon  | [jQuery](https://jquery.com/)|
|booon-ajax|[jQuery](https://jquery.com/), [Axios](https://github.com/axios/axios)|
|booon-nodebuilder|-|
|booon-adapt|[Vue](https://vuejs.org/)|

### Install

Embed the library you need. There are no dependencies. Even not on one another.

```html
<script src="https://cdn.jsdelivr.net/npm/booon@1.0.0/dist/booon.js"></script>
<script src="https://cdn.jsdelivr.net/npm/booon@1.0.0/dist/booon-ajax.js"></script>
<script src="https://cdn.jsdelivr.net/npm/booon@1.0.0/dist/booon-nodebuilder.js"></script>
<script src="https://cdn.jsdelivr.net/npm/booon@1.0.0/dist/booon-adapt.js"></script>
```

Or download from [Github](https://github.com/Jelenkee/booon/tree/master/dist).

## booon ⛰️

It is similar to JQuery, but worse. If you are looking for an alternative to JQuery, click [here](https://www.educba.com/jquery-alternatives/).

### Wrapper

You can create a booon wrapper with the global function `booon`.
The function accepts a selector string, a node, an array of nodes, a NodeList or another booon wrapper.

The wrapper contains an array of nodes. You can access the nodes with square brackets.

You can provide a second argument which is used instead of `document` if the first argument is a selector.
```js
// selector
booon("div.main")
// node
booon(document.getElementById("form1"))
// NodeList
booon(document.querySelectorAll("div>p"))
// selector with additional argument
booon("p>span", "#contact") // equal to booon("#contact p>span")
booon("p>span", document.getElementById("contact"))

booon("p")[1] // returns second node in the wrapper
```

If you the first argument is a function, it will be executed after `DOMContentLoaded` event or immediately if DOM is loaded already. You can provide additional arguments as well, that will be used as arguments for given function.
> No wrapper will be created.

```js
booon(() => alert("hello world"))
booon(alert, "hello world")
// both functions will alert 'hello world'
```

### Functions

> Most functions return the wrapper itself, so you can chain the functions.
> ```js
> booon("p").addClass("foo").show().text("bar")
> ```

#### `length`
Returns number of current nodes.
```js
booon("p").length // 7
```
#### `all`
Returns an array of current nodes.
```js
booon("p").all // [...]
```
#### `last`
Returns the last node in the wrapper.
```js
booon("p").last // <p>-node
```
#### `each(function)`
Executes the given function for each node in the wrapper.
```js
booon("p").each(node => console.log(node.innerText))
```
#### `mapToArray(function)`
Returns an array created with the given mapping function.
```js
booon("p").mapToArray(node => node.tagName) // ["p", "p", ...]
```
#### `addClass(class)`
Adds given class to current nodes. `class` can be a string or an array of strings.
```js
booon("p").addClass("foo")
booon("p").addClass(["foo", "bar"])
```
#### `removeClass(class)`
Removes given class to current nodes. `class` can be a string or an array of strings.
```js
booon("p").removeClass("foo")
booon("p").removeClass(["foo", "bar"])
```
#### `toggleClass(class)`
Toggles given class to current nodes. `class` can be a string or an array of strings.
```js
booon("p").toggleClass("foo")
booon("p").toggleClass(["foo", "bar"])
```
#### `hasClass(class)`
Returns true if any of the current nodes contain given class. `class` can be a string.
```js
booon("p").addClass("foo")
booon("p").hasClass("foo") // true
booon("p").removeClass("foo")
booon("p").hasClass("foo") // false
```
#### `parent()`
Returns a wrapper with the parent nodes.
```js
// <div class="foo"><p>BAR</p></div>
booon("p").parent().hasClass("foo") // true
```
#### `children()`
Returns a wrapper with the child nodes.
```js
// <div class="foo"><p>BAR</p><p>BAZ</p></div>
booon("div.foo").children().length // 2
```
#### `siblings([inclusive])`
Returns a wrapper with the sibling nodes. If `inclusive` is truthy, the wrapper will contain the current nodes themselves.
```js
// <div><p class="foo">BAR</p><p>BAZ</p></div>
booon("p.foo").siblings().length // 1
booon("p.foo").siblings(true).length // 2
```
#### `find(selector)`
Returns a wrapper with the nodes beneath the current nodes that match the given selector.
```js
// <div><p>BAR</p><p>BAZ</p></div>
booon("div").find("p").length // 2
```
#### `filter(predicate)`
Returns a wrapper with the nodes that match the given predicate. `predicate` can be a string or a function.
```js
// <div><p class="foo">BAR</p><p>BAZ</p></div>
booon("p").filter(".foo").length // 1
booon("p").filter(node => node.innerText === "BAZ").length // 1
```
#### `limit(number)`
Returns a wrapper that contains at most `number` nodes.
```js
// <div><p>BAR</p><p>BAZ</p></div>
booon("p").limit(33).length // 2
booon("p").limit(1).length // 1
```
#### `map(mapper)`
Returns a wrapper created with the given mapping function. `mapper` must return a node.
```js
booon("p").map(node => node.parentElement) // equal to parent()
```
#### `merge(value)`
Returns a wrapper that contains current nodes and nodes from value. Type of `value` can be any that `booon()` accepts.
```js
// <div><p class="foo">BAR</p><p id="para">BAZ</p></div>
booon("p.foo").merge("p#para").length // 2
booon("p.foo").merge(document.getElementById("para")).length // 2
```
#### `on(eventType, listener[, options])`
Adds an event listener to current nodes. For Parameters click [here](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters).
```js
booon("input").on("input", console.log)
```
#### `once(eventType, listener[, options])`
Like `on()` but the listener is only called once.
```js
booon("input").once("input", console.log)
```
#### `click(listener[, options])`
Short for `on("click", listener, options)`.
```js
booon("p").click(console.log)
```
#### `hover(enterListener[, leaveListener[, options]])`
Short for `on("mouseenter", enterListener, options);on("mouseleave", leaveListener, options)`.
```js
booon("p").hover(() => console.log("enter"), () => console.log("leave"))
```
#### `show()`
Shows the current nodes.
```js
booon("p").show()
```
#### `hide()`
Hides the current nodes.
```js
booon("p").hide()
```
#### `toggle([visible])`
Toggles the visibility of current nodes.
```js
// assume p is visible
booon("p").toggle() // invisible
booon("p").toggle() // visible
booon("p").toggle(true) // visible
```
#### `css(property[, value])`
Changes or returns a css property for current nodes.
```js
booon("p").css("display", "flex") // set display to 'flex'
booon("p").css("display") // flex
```
#### `html([value])`
Changes or returns innerHTML for current nodes.
```js
booon("p").html("<b>foo</b>")
booon("p").html() // <b>foo</b>
```
#### `text([value])`
Changes or returns innerText for current nodes.
```js
booon("p").text("bar")
booon("p").text() // bar
```
#### `attr(attribute[, value])`
Changes or returns an attribute for current nodes.
```js
booon("a").attr("href", "https://yesno.wtf/")
booon("a").attr("href") // https://yesno.wtf/
```
#### `prop(property[, value])`
Changes or returns a property for current nodes.
```js
booon("input[type=checkbox]").prop("checked", true)
booon("input[type=checkbox]").prop("checked") // true
```
#### `val([value])`
Short for `prop("value", value)`.
```js
booon("input[type=text]").val("baz")
booon("input[type=text]").val() // baz
```
#### `data(key[, value])`
Changes or returns data for current nodes. Objects will be stringified.
```js
booon("p").data("foo","bar")
booon("p").data("foo") // bar
booon("p").data("foo", { baz: 100 })
booon("p").data("foo") // {"baz":100}
```
#### `remove()`
Removes all current nodes from DOM.
```js
booon("p").remove()
booon("p").length // 0
```

## booon-ajax 📨

#### `booon.ajax(settings[,success[,error]]);`
Performs an AJAX request.

**`settings`**:

* `url` - URL
  * can be relative (/form/update) or absolute (https://httpbin.org/get)
* `success(response, xhr)` - function that is called after successful request
* `error(response|error, xhr)` - function that is called after unsuccessful request
* `fail(response|error, xhr)` - alias for `error`
* `method` - http request method (GET, POST, ...). Default is GET
* `pre(xhr)` - function that is called before sending
* `post(xhr)` - function that is called after request is finished
* `timeout` - number for timeout in milliseconds
* `headers` - object with headers
* `data` - data to send
  * can be object or string
* `params` - object with params that will be added to the url, objects will be stringified
* `responseConverter(rawResponse)` - function that will convert the response

**`success`**:
* function that is called after successful request, has priority over `settings.success`

**`error`**:
* function that is called after unsuccessful request, has priority over `settings.error`

```js
booon.ajax({
    url: "https://httpbin.org/get",
    method: "GET",
    pre: (xhr) => console.log("before sending..."),
    post: (xhr) => console.log("after sending..."),
    headers: { foo: "bar" },
    params: { para: "meter" },
    responseConverter: JSON.parse,
    success: (res) => console.log(res.args),
    fail: (res) => console.log("something went wrong", res)
})
```

#### `booon.get(settings[,success[,error]]);`
Performs an AJAX GET request.
#### `booon.post(settings[,success[,error]]);`
Performs an AJAX POST request.
#### `booon.json(settings[,success[,error]]);`
Performs an AJAX GET request and the answer will be parsed with `JSON.parse`.

## booon-nodebuilder 🛠️

#### `booon.nodeBuilder(tag)`
Creates a new NodeBuilder. `tag` is the tag name.
```js
booon.nodeBuilder("div")
```
#### `attr(key, value)`
Adds an attribute to the nodebuilder.
```js
booon.nodeBuilder("div").attr("foo","bar")
```
#### `id(id)`
Adds the id to the nodebuilder.
```js
booon.nodeBuilder("div").id("unique")
```
#### `clazz(class)`
Adds classes to the nodebuilder. `class` can be a string or an array of strings.
```js
booon.nodeBuilder("div").class("foo")
booon.nodeBuilder("div").class(["foo", "baz"])
```
#### `html(html)`
Sets html text for the node. `html` can be a string or another nodebuilder.
```js
booon.nodeBuilder("div").html("<b>foo</b>")
booon.nodeBuilder("div").html(booon.nodeBuilder("b").html("foo"))
```
#### `node(node)`
Adds a node to the nodebuilder which will be added as a child node to the building node. `node` can be a string, another nodebuilder or an actual node.
```js
booon.nodeBuilder("div").node("<b>foo</b>")
booon.nodeBuilder("div").node(booon.nodeBuilder("b").html("foo"))
```
#### `buildString()`
Builds the node as an HTML string.
```js
booon.nodeBuilder("div")
    .id("one")
    .clazz(["full", "green"])
    .attr("foo", "bar")
    .node("<span>Alf</span>")
    .buildString() // <div class="full green" id="one" foo="bar"><span>Alf</span></div>
```

#### `buildNode([parent])`
Builds and returns the node. If a `parent` is provided (node or selector string), the built node will be appended to the parent node.
```js
// <main></main>
booon.nodeBuilder("div")
    .id("one")
    .attr("foo", "bar")
    .node("<span>Alf</span>")
    .buildNode("main")
// <main><div id="one" foo="bar"><span>Alf</span></div></main>
```

## booon-adapt ⛓️

This is a Vue-like framework.

### Instance

#### `booon.adapt(options)`
Creates a new Adapt object.

**`options`**
##### `el`
The element on which the adapt object is mounted. Even multiple elements are allowed.
> One element must not be child of another one.

```js
booon.adapt({ el: "#main" })
booon.adapt({ el: "#foo, #bar" })
booon.adapt({ el: document.querySelectorAll("div") })
```
##### `data`
An object that contains the attributes you need. The attributes are accessible on the instance.
> Attribute names must not start with `_`. The same applies to method names.

```js
const instance = booon.adapt({
    el: "#foo",
    data: {
        color: "green",
        number: 10,
        array: [1, 2, 3],
        joinArray: function () {
            return this.array.join("_")
        }
    }
})
instance.color // green
instance.color = "red"
instance.joinArray // 1_2_3
```
##### `methods`
An object that contains the methods you need. The methods are accessible on the instance.
```js
const instance = booon.adapt({
    el: "#foo",
    data: {
        array: [1, 2, 3]
    },
    methods: {
        arrayLength: function () {
            return this.array.length;
        }
    }
})
instance.arrayLength() // 3
```
##### `watch`
An object that contains watchers. These watchers are called when a data attribute has changed. New value and old value will be provided as arguments.
```js
const instance = booon.adapt({
    el: "#foo",
    data: {
        color: "green",
        number: 10,
    },
    watch: {
        color: function (newValue, oldValue) {
            this.number += 10;
        }
    }
})
instance.number // 10
instance.color = "red"
instance.number // 20
```
##### `validate`
An object that contains validators. These validators are called when a data attribute is about to change. The new value can be modified. If `undefined` is returned, the value will not be changed. Validators are called before watchers.
```js
const instance = booon.adapt({
    el: "#foo",
    data: {
        number: 10,
    },
    validate: {
        number: function (value) {
            // increase until the value is divisible by 10
            while (value % 10 !== 0) value++;
            return value
        }
    }
})
instance.number // 10
instance.number = 13
instance.number // 20
```
##### `options`
An object with additional options.
* startTag (default: `{{`)
* endTag (default: `}}`)
```js
const instance = booon.adapt({
    el: "#foo",
    data: {
        number: 10,
    },
    options: {
        startTag: "[[",
        endTag: "]]",
    }
})
```
##### `init`
A function that is called after the adapt object was initialized.
```js
const instance = booon.adapt({
    el: "#foo",
    data: {
        number: 10,
    },
    init: function() { console.log(this.number) } // prints 10
})
```

### Template
Templates can be used within text nodes. Starttag and endtag can be changed in the options object.

```html
<main>
    <p id="one">{{text}}</p>
    <p id="two">Length: {{text.length}}</p>
</main>
```
```js
const instance = booon.adapt({
    el: "main",
    data: {
        text: "lorem ipsum",
    }
})
booon("#one").text() // lorem ipsum
booon("#two").text() // Length: 11
```

### Directives

#### `b-attr` (alias `:`)
Binds an attribute from the instance to an attribute of the node. For the `class` attribute there is some special handling.
```html
<main>
    <img b-attr:src="url">
    <p class="foo" :class="class"></p>
    <p id="one" :class="classes"></p>
    <p id="alpha" :class="classObject"></p>
</main>
```
```js
const instance = booon.adapt({
    el: "main",
    data: {
        url: "https://image.com",
        class: "bar baz",
        classes: ["two", "three"],
        classObject: { beta: true, gamma: false }
    },
})
booon("main>img").attr("src") // https://image.com
booon("main>.foo")[0].className // foo bar baz
booon("main>#one")[0].className // one two three
booon("main>#alpha")[0].className // beta
```
#### `b-prop`
Binds an attribute from the instance to a property of the node.
> Attribute names are case-insensitive. `b-prop:innerHTML` is equal to `b-prop:innerhtml`.

```html
<main>
    <p class="foo" b-prop:innertext="text"></p>
    <p class="bar" b-prop:innerHTML="'<b>ipsum</b>'"></p>
    <input class="baz" b-prop:value="text+text">
</main>
```
```js
const instance = booon.adapt({
    el: "main",
    data: {
        text: "lorem",
    },
})

booon("main>.foo").text() // lorem
booon("main>.bar").text() // ipsum
booon("main>.baz").val() // loremlorem
```
#### `b-style`
Binds an attribute from the instance to the style of a node.
```html
<main>
    <p class="foo" b-style="{color:'red', 'font-size':pixel+'px'}"></p>
    <p class="bar" style="display: inline" b-style="{'background-color': bgColor}"></p>
</main>
```
```js
const instance = booon.adapt({
    el: "main",
    data: {
        pixel: 13,
        bgColor: "aqua"
    },
})
booon("main>.foo").css("color") // red
booon("main>.foo").css("font-size") // 13px
booon("main>.bar").css("display") // inline
booon("main>.bar").css("background-color") // aqua
```
#### `b-model`
Binds an attribute from the instance to a property of the node and vice-versa. Use this on inputs to keep the attributes in sync. The `input` event is used to detect changes.
##### Modifiers
* `lazy`
   * `change` event is used insted of `input` event

```html
<main>
    <input class="text" type="text" b-model="text">
    <input class="check" type="checkbox" b-model="check">
    <input class="radio1" type="radio" value="r1" b-model="radio">
    <input class="radio2" type="radio" value="r2" b-model="radio">
    <textarea b-model.lazy="longtext"></textarea>
</main>
```
```js
const instance = booon.adapt({
    el: "main",
    data: {
        text: "lorem",
        check: true,
        radio: "r1",
        longtext: "very long text"
    },
})

booon("main>.text").val() // lorem
// do type 'ipsum' into input
instance.text // ipsum
instance.text = "dolor"
booon("main>.text").val() // dolor

booon("main>.check").prop("checked") // true
// do uncheck checkbox
instance.check // false

booon("main>.radio1").prop("checked") // true
booon("main>.radio2").prop("checked") // false
instance.radio = "r2"
booon("main>.radio1").prop("checked") // false
booon("main>.radio2").prop("checked") // true

booon("main>textarea").val() // very long text
```

#### `b-visible`
Binds an attribute from the instance to visibility of the node.
```html
<main>
    <p class="foo" b-visible="true"></p>
    <p class="bar" b-visible="1===2"></p>
</main>
```
```js
const instance = booon.adapt({
    el: "main",
    data: {
    },
})

booon("main>.foo").css("display") // ""
booon("main>.bar").css("display") // none
```
#### `b-on` (alias `@`)
Adds an event listener to the node. The current event is stored in `$event`.
##### Modifiers
* `once`
   * event listener is called at most once
* `capture`
   * [`useCapture`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters) is true
```html
<main>
    <p class="foo" b-on.click="num++"></p>
    <p class="bar" @keyup="keyup" @keydown="keydown('morph', $event)"></p>
</main>
```
```js
const instance = booon.adapt({
    el: "main",
    data: {
        num: 0,
        down: false
    },
    methods: {
        keyup: function(event) {
            this.down = false
        },
        keydown: function(text, event) {
            this.down = true
            console.log(text) // prints 'morph'
        }
    }
})
```
