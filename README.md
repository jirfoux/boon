# booon

### github
![](https://badgen.net/github/watchers/Jelenkee/booon)
![](https://badgen.net/github/stars/Jelenkee/booon)
![](https://badgen.net/github/commits/Jelenkee/booon)
![](https://badgen.net/github/last-commit/Jelenkee/booon)
![](https://badgen.net/github/license/Jelenkee/booon)
### npm
![](https://badgen.net/npm/v/booon)
![](https://badgen.net/npm/dw/booon)

![](https://badgen.net/jsdelivr/hits/npm/booon)

<!--![](https://badgen.net/badge/IE8/compatible/)-->

![](https://badgen.net/badge/Happy/Scrum/pink)

![](https://badgen.net/badge/Use/as/008e9b?scale=0.9)
![](https://badgen.net/badge/many/badges/2da7d3?scale=0.9)
![](https://badgen.net/badge/as/possible/00daee?scale=0.9)

[![](https://badgen.net/badge/Thx/Badgen/b5652f)](https://badgen.net/)

It is similiar to JQuery, but worse.
I do not recommend using this library. If you are looking for an alternative to JQuery, click [here](https://www.educba.com/jquery-alternatives/).

| Library | Requires |
| --- | --- |
| booon | - |
|booon-ajax|booon
|booon-nodebuilder|booon

## booon ⛰️

TODO

## booon-ajax 📨

#### `booon.ajax(settings[,success[,error]]);`

#### settings:
* `url` :string - self-explaining
* `dataType` :string - type of data that you expect (currently: text, txt, json, xml, html)
* `success(response,xhr)` :function - function that is called after successful request and takes response as argument
* `error(response,xhr)` :function - function that is called after failed request
* `fail(response,xhr)` :function - alias for `error`
* `method` :string - http request method (get, post, ...)
* `pre(xhr)` :function - function that is called before sending
* `post(xhr)` :function - function that is called after request is finished
* `timeout` :number - number for timeout in milliseconds
* `mime` :string - MIME-type for request, overrides `dataType`
* `headers` :object - object with headers, overrides `dataType` and `mime`
* `data` :object - object with data to send
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

#### `booon.newNodeBuilder(tag)`
* creates a new NodeBuilder
    * `attr(key, value)`
    * `clazz(value)`
    * `id(value)`
    * `node(value)`
    * `html(value)`