"use strict";
(function() {
    booon.ajax = function (settings, success, error) {
        if (typeof settings != "object") { throw new Error("wrong settings"); }
        let accept;
        let dataType = (settings.dataType || "").toLowerCase();
        if (!dataType || dataType == "text" || dataType == "txt") {
        } else if (dataType == "json") {
            accept = "application/json";
        } else if (dataType == "xml") {
            accept = "application/xml";
        } else if (dataType == "css") {
            accept = "text/css";
        } else if (dataType == "html") {
            accept = "application/xhtml+xml";
        }
        if (accept) {
            accept += ",*/*;q=0.1";
        }
    
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                let result;
                try {
                    result = settings.responseConverter ? settings.responseConverter(this.response) : this.response;
                } catch (e) {
                    err(e);
                }
                if (this.status >= 200 && this.status < 300) {
                    if (success) {
                        success(result, xhr);
                    } else if (settings.success) {
                        settings.success(result, xhr);
                    }
                } else {
                    err(result);
                }
            }
        };
        function err(obj) {
            if (error) {
                error(obj, xhr);
            } else {
                const func = settings.error || settings.fail;
                if (func) {
                    func(obj, xhr);
                }
            }
        }
        xhr.ontimeout = (e) => err(e);
        if (settings.post) {
            xhr.onloadend = () => settings.post(xhr);
        }
        let url = settings.url || "";
        let u = document.createElement("a");
        u.href = url;
        if (typeof settings.params == "object") {
            url += (u.search ? "&" : "?") + serialize(settings.params);
        }
        xhr.open(settings.method || "get", url, true);
        xhr.timeout = typeof settings.timeout == "number" ? settings.timeout : 0;
        if (settings.pre) { settings.pre(xhr); }
        if (accept) {
            xhr.setRequestHeader("Accept", accept);
        }
        if (settings.mime) {
            xhr.setRequestHeader("Accept", mime);
            xhr.setRequestHeader("Content-Type", mime);
        }
        for (let [key, value] of Object.entries(settings.headers || {})) {
            xhr.setRequestHeader(key, value);
        }
        xhr.send(new URLSearchParams(serialize(settings.data || {})));
        return xhr;
    };
    
    function serialize (obj) {
        const data = [];
        function iter(o, path) {
            if (o == null) {
                return;
            }
            if (Array.isArray(o)) {
                o.forEach(function (a) {
                    iter(a, path + "[]");
                });
            } else if (typeof o == "object") {
                Object.keys(o).forEach(function (k) {
                    iter(o[k], path + "[" + k + "]");
                });
            } else {
                data.push(path + "=" + o);
            }
        }
        Object.keys(obj).forEach(function (k) {
            iter(obj[k], k);
        });
        return data.join("&");
    }
    booon.get = (settings, success, error) => {
        settings.method = "get";
        booon.ajax(settings, success, error);
    };
    booon.post = (settings, success, error) => {
        settings.method = "post";
        booon.ajax(settings, success, error);
    };
    booon.json = (settings, success, error) => {
        if (settings.responseConverter) {
            const old = settings.responseConverter;
            settings.responseConverter = data => old(JSON.parse(data));
        } else {
            settings.responseConverter = JSON.parse;
        }
        settings.dataType = "json";
        booon.get(settings, success, error);
    };
})();