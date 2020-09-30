# booon

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

It is similiar to JQuery, but worse.
I do not recommend using this library. If you are looking for an alternative to JQuery, click [here](https://www.educba.com/jquery-alternatives/).

Probably _not_ compatible with ![](https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Internet_Explorer_10%2B11_logo.svg/20px-Internet_Explorer_10%2B11_logo.svg.png).

| Library | Requires |
| --- | --- |
| booon | - |
|booon-ajax|-|
|booon-nodebuilder|booon|
|booon-adapt|-|

## booon ⛰️

TODO

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