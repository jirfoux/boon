"use strict";
(function () {
    if (!window.booon) {
        window.booon = {};
    }

    booon.ajax = (settings, success, error) => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                let result;
                try {
                    result = settings.responseConverter
                        ? settings.responseConverter(this.response)
                        : this.response;
                } catch (e) {
                    return err(e);
                }
                if (this.status >= 200 && this.status < 300) {
                    if (success) {
                        success(result, xhr);
                    } else if (settings.success) {
                        settings.success(result, xhr);
                    }
                } else if (this.status >= 400) {
                    err(result);
                }
            }
        };
        const err = (obj) => {
            if (error) {
                error(obj, xhr);
            } else {
                const func = settings.error || settings.fail;
                if (func) {
                    func(obj, xhr);
                }
            }
        };
        xhr.ontimeout = (e) => err(e);
        if (settings.post) {
            xhr.onloadend = () => {
                try {
                    settings.post(xhr);
                } catch (e) {
                    err(e);
                }
            };
        }
        let url = settings.url || "";
        const u = document.createElement("a");
        u.href = url;
        if (typeof settings.params === "object") {
            url += (u.search ? "&" : "?") + serialize(settings.params);
        }
        xhr.open(settings.method || "get", url, true);
        xhr.timeout =
            typeof settings.timeout === "number" ? settings.timeout : 0;
        if (settings.pre) {
            try {
                settings.pre(xhr);
            } catch (e) {
                err(e);
            }
        }
        for (const [key, value] of Object.entries(settings.headers || {})) {
            xhr.setRequestHeader(key, value);
        }
        let toSend = null;
        if (typeof settings.data === "string") {
            xhr.setRequestHeader("Content-Type", "text/plain");
            toSend = settings.data;
        } else if (
            settings.data &&
            ["URLSearchParams", "FormData"].includes(
                settings.data.constructor.name
            )
        ) {
            xhr.setRequestHeader(
                "Content-Type",
                "application/x-www-form-urlencoded"
            );
            toSend = settings.data;
        } else if (typeof settings.data === "object") {
            xhr.setRequestHeader(
                "Content-Type",
                "application/x-www-form-urlencoded"
            );
            toSend = serialize(settings.data);
        }
        xhr.send(toSend);
        return xhr;
    };

    const serialize = (obj) => {
        const data = [];
        const enc = encodeURIComponent;

        Object.keys(obj).forEach((k) => {
            const element = obj[k];
            if (Array.isArray(element)) {
                element.forEach((e) => data.push(enc(k) + "=" + enc(e)));
            } else {
                data.push(enc(k) + "=" + enc(element));
            }
        });
        return data.join("&");
    };
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
            settings.responseConverter = (data) => old(JSON.parse(data));
        } else {
            settings.responseConverter = JSON.parse;
        }
        settings.dataType = "json";
        booon.get(settings, success, error);
    };
})();
