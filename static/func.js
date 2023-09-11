function get_p(url) {
    let s_start = 0;
    let s_iskey = 1;
    let s_key = '';
    let s_value = '';
    let ret_dict = {}
    for (let n in url) {
        let l = url[n]
        if (s_start == 1 && l != '=' && s_iskey == 1) {
            s_key = s_key + String(l)
        };
        if (s_start == 1 && l == '=' && s_iskey == 1) {
            s_iskey = 0
        };
        if (s_start == 1 && l != '&' && s_iskey == 0 && l != '=') {
            s_value = s_value + String(l)
        };
        if (s_start == 1 && l == '&' && s_iskey == 0 && s_key != '') {
            ret_dict[s_key] = s_value
            s_value = ''
            s_key = ''
            s_iskey = 1
        };
        if (l == '?' && s_start == 0) {
            s_start = 1
        }
    };
    if (s_key != '' && s_value != '') {
        ret_dict[s_key] = s_value
    }
    return (ret_dict)
}

function set_p(or, k, v) {
    let p = get_p(window.location.href)
    p[k] = v
    let p_txt = ''
    Object.keys(p).forEach(ky => {
        p_txt += ky + '=' + p[ky] + '&'
    })
    p_txt = p_txt.slice(0,p_txt.length - 1)
    window.location.replace(or + "?" + p_txt)
}

function translate(lang,langdict,rawtext){
    if (Object.keys(langdict[lang]).indexOf(rawtext) != -1){
        return langdict[lang][rawtext]
    }
}