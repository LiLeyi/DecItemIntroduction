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
    p_txt = p_txt.slice(0, p_txt.length - 1)
    window.location.replace(or + "?" + p_txt)
}

function translate(lang, langdict, rawtext) {
    if (Object.keys(langdict[lang]).indexOf(rawtext) != -1) {
        return langdict[lang][rawtext]
    }
}

async function quote(lang, langdict, raw_sentence) {
    /*输入语言，语言文件，句子。将句子中\*xxx.xxx:xxx.name*\翻译成对应文本。将\*path*dict_path*\翻译成static/data对应文件中对应键的值*/
    let targets = raw_sentence.match(/\\\*(\S*?)\*\\/g)
    let cur_sentence = raw_sentence
    while (targets != null) {
        if (targets.length > 0) {
            target = targets[0].slice(2, -2)
            if (target.indexOf('*') != -1) {
                /*后者*/
                let file_path = target.match(/(\S*?)\*/g)[0].slice(0, -1)
                let dic_path = target.match(/\*(\S*)/g)[0].slice(1)
                file_path = 'static/data/' + file_path
                let resp = await fetch(file_path)
                let dic = await resp.json()
                let target_value = eval('dic' + dic_path)
                let target_after = target_value
                cur_sentence = cur_sentence.replace('\\*' + target + '*\\', target_after)
            } else {
                /*前者*/
                let target_after = target
                if (target in langdict[lang]) {
                    target_after = langdict[lang][target]
                }
                cur_sentence = cur_sentence.replace('\\*' + target + '*\\', target_after)
            }
            targets = cur_sentence.match(/\\\*(\S*?)\*\\/g)
        }
    }
    return cur_sentence
}