export function Ajax(method, url, data = null) {
    return new Promise((res, rej) => {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
                if (xmlhttp.status == 200) {
                    let results = xmlhttp.responseText;
                    res(results);        
                }
                else {
                    rej(new Error("Network error"));
                }
            }
        }

        xmlhttp.open(method, url);
        xmlhttp.setRequestHeader("Content-Type", "text/json");
        xmlhttp.setRequestHeader("Accept", "text/json");
        xmlhttp.send(data)
    });
}

export let Get = (url) => Ajax("GET", url);
export let Post = (url, data) => Ajax("POST", url, data);