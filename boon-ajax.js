
boon.ajax = function (settings, success, error) {
    if (typeof settings != "object") { throw new Error("wrong settings"); }
    let contentType;
    let accept;
    let dataType = (settings.dataType || "").toLowerCase();
    if (!dataType || dataType == "text" || dataType == "txt") {
    } else if (dataType == "json") {
        accept = contentType = "application/json";
    } else if (dataType == "xml") {
        accept = contentType = "application/xml";
    } else if (dataType == "css") {
        accept = contentType = "text/css";
    } else if (dataType == "html") {
        accept = contentType = "application/xhtml+xml";
    }
    if (accept) {
        accept += ",*/*;q=0.1"
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            let result = settings.responseConverter ? settings.responseConverter(this.response) : this.response;
            if (this.status >= 200 && this.status < 300) {
                if (success) {
                    success(result);
                } else if (settings.success) {
                    settings.success(result);
                }
            } else {
                if (error) {
                    error(result);
                } else {
                    const func = settings.error || settings.fail;
                    if (func) {
                        func();
                    }
                }
            }

        }
    };
    xhttp.onloadend = settings.post;
    xhttp.timeout = typeof settings.timeout == "number" ? settings.timeout : 0;
    let url = settings.url || "";
    if (typeof settings.params == "object") {
        url += (window.location.search ? "&" : "?")
            + Object.entries(settings.params || {}).map(e => {
                let val = e[1];
                if (val == undefined || val == null) {
                    return;
                }
                if (typeof val == "object") {
                    val = JSON.stringify(val);
                }
                return e[0] + "=" + encodeURIComponent(val);
            }).join("&");
    }
    xhttp.open(settings.method || "get", url, true);
    if (settings.pre) { settings.pre(); }
    if (accept) {
        xhttp.setRequestHeader("Accept", accept);
    }
    if (contentType) {
        xhttp.setRequestHeader("Content-Type", contentType);
    }
    if (settings.mime) {
        xhttp.setRequestHeader("Accept", mime);
        xhttp.setRequestHeader("Content-Type", mime);
    }
    for (let [key, value] of Object.entries(settings.headers || {})) {
        xhttp.setRequestHeader(key, value);
    }
    return xhttp.send(typeof settings.data == "object" ? JSON.stringify(settings.data) : (settings.data || "").toString());
}
boon.get = (settings, success, error) => {
    settings.method = "get";
    boon.ajax(settings, success, error);
};
boon.post = (settings, success, error) => {
    settings.method = "post";
    boon.ajax(settings, success, error);
};
boon.json = (settings, success, error) => {
    settings.responseConverter = JSON.parse;
    settings.dataType = "json";
    boon.get(settings, success, error);
};