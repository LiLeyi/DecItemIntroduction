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

function translate(lang, langlist, rawtext) {
    for (let langdict of langlist) {
        if (Object.keys(langdict[lang]).indexOf(rawtext) != -1) {
            return langdict[lang][rawtext]
        }
    }
    return null
}

function checkImgExist(imgurl){
    let Imgobj = new Image()
    Imgobj.src = imgurl
    if(Imgobj.fileSize > 0 || (Imgobj.width > 0 && Imgobj.height > 0)) {
        return true
    } 
    return false
    
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

function rec_spawn(rec_id, lang_list, lang, has_div = false) {
    if (rec_id in window.RecData) {
        let str = ''
        if (window.RecData[rec_id]['type'] == 'shaped' || window.RecData[rec_id]['type'] == 'shapeless') {
            str = rec_shaped_and_less(rec_id, lang_list, lang)
        } else if (window.RecData[rec_id]['type'] == 'furnace') {
            str = rec_furnace(rec_id, lang_list, lang)
        } else if (window.RecData[rec_id]['type'] == 'brewing') {
            str = rec_brewing(rec_id, lang_list, lang)
        }
        if (has_div) {
            console.log(has_div)
            return '<div class="recipe_li">' + str + '</div>'
        } else {
            return str
        }
    } else {
        return null
    }
}

function rec_get_id_data_name(i, lang_list, lang) {
    let i_data = -1
    let i_id = i
    let a_able = true
    let id_without_np = ''
    if (i.match(/:/g).length == 2) {
        let c = 0
        i_id = ''
        let i_data_str = ''
        for (let l of i) {
            if (l == ':') {
                c += 1
                if (c <= 1) {
                    i_id += l
                }
            } else if (c <= 1) {
                i_id += l
            } else {
                i_data_str += l
            }
        }
        i_data = Number(i_data_str)
    } else {
        let c = 0
        for (let l of i){
            if (l == ':') {
                c = 1
            } else if (c == 1 ) {
                id_without_np += l
            }
        }
    }
    let i_name = i_id
    if (i_id.match(/minecraft:/) != null && i_id.match(/minecraft:/).length > 0) {
        a_able = false
        i_name = i_id.replace(/minecraft:/, '')
    }
    let i_tr = translate(lang, lang_list, 'item.' + i_name + '.name')
    if (i_tr == null) {
        i_tr = translate(lang, lang_list, 'tile.' + i_name + '.name')
    }
    if (i_tr == null) {
        i_tr = translate(lang, lang_list, 'item.spawn_egg.entity.' + i_name + '.name')
    }
    if (i_data != null && i_data > 0) {
        i_tr += translate(lang, lang_list, 'text.dec:recipe_data.name') + Number(i_data)
    }
    if (a_able) {
        if(i_id in window.AddData){
            if (checkImgExist('static/data/' + window.AddData[i_id]['texture'] + '.png')){
                i_tr = '<img class="rec_icon" src="static/data/' + window.AddData[i_id]['texture'] + '.png">' + i_tr
            } else {
                console.log('static/data/' + id_without_np + '.png:Do not exist!')
            }
        }
        i_tr = '<a class="rec_a" href="introduction.html?item=' + String(i_id) + '&lang=' + lang + '">' + i_tr + '</a>'
    } else if (checkImgExist('static/data/textures/items/' + i_id.slice(10) + '.png')){
        i_tr = '<img class="rec_icon" src="static/data/textures/items/' + i_id.slice(10) + '.png">' + i_tr
    } else {
        console.log('static/data/textures/items/' + i_id.slice(10) + '.png:Do not exist!')
    }
    return [i_id, i_name, i_data, i_tr]
}

function rec_shaped_and_less(rec_id, lang_list, lang) {
    let str = ''
    str += translate(lang, lang_list, 'text.dec:recipe_craft_1.name')
    for (let t of window.RecData[rec_id]['tags']) {
        str += translate(lang, lang_list, 'tile.' + t + '.name') + ','
    }
    str = str.slice(0, -1)
    str += translate(lang, lang_list, 'text.dec:recipe_craft_2.name')
    for (let i of Object.keys(window.RecData[rec_id]['count'])) {
        let [i_id, i_name, i_data, i_tr] = rec_get_id_data_name(i, lang_list, lang)
        str += i_tr + '*' + String(window.RecData[rec_id]['count'][i]) + ','
    }
    str = str.slice(0, -1)
    let result_str = ''
    for (let result_dic of window.RecData[rec_id]['result']) {
        result_str += rec_get_id_data_name(result_dic['item'], lang_list, lang)[3]
        if (result_dic['data'] > 0) {
            result_str += translate(lang, lang_list, 'text.dec:recipe_data.name') + String(result_dic['data'])
        }
        if (result_dic['count'] > 1) {
            result_str += '*' + String(result_dic['count'])
        }
        result_str += ','
    }
    result_str = result_str.slice(0, -1)
    str += '   -->   ' + result_str
    return str
}

function rec_furnace(rec_id, lang_list, lang) {
    let str = translate(lang, lang_list, 'text.dec:recipe_furnace_1.name')
    for (let t of window.RecData[rec_id]['tags']) {
        str += translate(lang, lang_list, 'tile.' + t + '.name') + ','
    }
    str = str.slice(0, -1)
    str += translate(lang, lang_list, 'text.dec:recipe_furnace_2.name')
    let [inp_id, inp_name, inp_data, inp_tr] = rec_get_id_data_name(window.RecData[rec_id]['pattern'], lang_list, lang)
    let [out_id, out_name, out_data, out_tr] = rec_get_id_data_name(window.RecData[rec_id]['result'], lang_list, lang)
    str += inp_tr + '   -->   ' + out_tr
    return str
}

function rec_brewing(rec_id, lang_list, lang) {
    let str = translate(lang, lang_list, 'text.dec:recipe_brewing.name')
    let [inp_id, inp_name, inp_data, inp_tr] = rec_get_id_data_name(window.RecData[rec_id]['pattern']['input'], lang_list, lang)
    let [rea_id, rea_name, rea_data, rea_tr] = rec_get_id_data_name(window.RecData[rec_id]['pattern']['reagent'], lang_list, lang)
    let [out_id, out_name, out_data, out_tr] = rec_get_id_data_name(window.RecData[rec_id]['result'], lang_list, lang)
    str += inp_tr + '+' + rea_tr + '   -->   ' + out_tr
    return str
}

function rec_smithing(rec_id, lang_list, lang) {
    let str = translate(lang, lang_list, 'text.dec:recipe_brewing.name')
    let [temple_id, temple_name, temple_data, temple_tr] = rec_get_id_data_name(window.RecData[rec_id]['pattern']['temple'], lang_list, lang)
    let [base_id, base_name, base_data, base_tr] = rec_get_id_data_name(window.RecData[rec_id]['pattern']['base'], lang_list, lang)
    let [addition_id, addition_name, addition_data, addition_tr] = rec_get_id_data_name(window.RecData[rec_id]['pattern']['addition'], lang_list, lang)
    let [out_id, out_name, out_data, out_tr] = rec_get_id_data_name(window.RecData[rec_id]['result'], lang_list, lang)
    str += temple_tr + '+' + base_tr + '+' + addition_tr + '   -->   ' + out_tr
    return str
}