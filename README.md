# booon
###### build on our own network

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

![](https://badgen.net/badge/Use/as/008e9b?scale=0.9)
![](https://badgen.net/badge/many/badges/2da7d3?scale=0.9)
![](https://badgen.net/badge/as/possible/00daee?scale=0.9)

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
<script src="https://cdn.jsdelivr.net/npm/booon@x.x.x/booon.js"></script>
<script src="https://cdn.jsdelivr.net/npm/booon@x.x.x/booon-ajax.js"></script>
<script src="https://cdn.jsdelivr.net/npm/booon@x.x.x/booon-nodebuilder.js"></script>
<script src="https://cdn.jsdelivr.net/npm/booon@x.x.x/booon-adapt.js"></script>
```

Or download from [Github](https://github.com/Jelenkee/booon/tree/master/dist).

## booon ⛰️

It is similiar to JQuery, but worse. If you are looking for an alternative to JQuery, click [here](https://www.educba.com/jquery-alternatives/).

### Wrapper

You can create a booon wrapper with the global function `booon`.
The function accept a selector string, a node, an array of nodes, a NodeList or another booon wrapper.

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
Returns a wrapper with the sibling nodes. If `inclusive` is truthy, the wrapper will contain the current nodes themself.
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
Changes or returns a attribute for current nodes.
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

#### settings:
* `url` :string - self-explaining
* `success(response,xhr)` :function - function that is called after successful request and takes response as argument
* `error(response|error,xhr)` :function - function that is called after failed request
* `fail(response|error,xhr)` :function - alias for `error`
* `method` :string - http request method (get, post, ...)
* `pre(xhr)` :function - function that is called before sending
* `post(xhr)` :function - function that is called after request is finished
* `timeout` :number - number for timeout in milliseconds
* `accept` :string - Accept-type for request
* `headers` :object - object with headers
* `data` :object|string - object with data to send
* `params` :object - object with params that will be added to the url, objects will be stringified
* `responseConverter(rawResponse)` :function - function that will convert the response

#### success:
* function that is called after successful request and takes response as argument, has priority over `settings.success`

#### error:
* function that is called after failed request, has priority over `settings.error`

These methods are just semantic sugar:

#### `booon.get(settings[,success[,error]]);`
#### `booon.post(settings[,success[,error]]);`
#### `booon.json(settings[,success[,error]]);`

## booon-nodebuilder 🛠️

#### `booon.nodeBuilder(tag)`
* creates a new NodeBuilder
    * `attr(key, value)`
    * `clazz(value)`
    * `id(value)`
    * `node(value)`
    * `html(value)`

## booon-adapt ⛓️
