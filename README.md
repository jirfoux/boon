# boon
Modular JS library. JQuery replacement

## ajax

#### `$.ajax(settings[,success[,error]]);`

#### settings:
* `url` :string - self-explaining
* `dataType` :string - type of data that you expect (currently: text, txt, json, xml, html)
* `success` :function - function that is called after successful request and takes response as argument
* `error` :function - function that is called after failed request
* `fail` :function - alias for `error`
* `method` :string - http request method (get, post, ...)
* `pre` :function - function that is called before sending
* `post` :function - function that is called after request is finished
* `timeout` :number - number for timeout in milliseconds
* `mime` :string - MIME-type for request, overrides `dataType`
* `headers` :object - object with headers, overrides `dataType` and `mime`
* `data` :object - object with data to send
* `params` :object - object with params that will be added to the url, objects will be stringified
* `responseConverter` :function - function that will convert the response

#### success:
* function that is called after successful request and takes response as argument, has priority over `settings.success`

#### error:
* function that is called after failed request `settings.error`

#### `$.get(settings[,success[,error]]);`
#### `$.post(settings[,success[,error]]);`
#### `$.json(settings[,success[,error]]);`