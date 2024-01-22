async function mod_spawn() {
    let tran_dict = [AddTran, DefaultTran, VanillaTran, PowTran]
    let p_dic = get_p(window.location.href);
    let item_id = p_dic['item'];
    let item_dict = window.AddData[item_id]
    let resp = await fetch('static/data/items/' + window.AddData[item_id]['file_path'])
    let item_beh = await resp.json()
    item_dict['beh'] = item_beh
    let lang = p_dic['lang']
    let components = item_dict['beh']['minecraft:item']['components']
    if (components.hasOwnProperty('minecraft:durability')) {
        document.getElementById('js_item_durability').innerHTML = translate(lang, tran_dict, 'text.dec:durability.name') + String(components['minecraft:durability']['max_durability'])
    }
    let custom_tag = []
    Object.keys(components).forEach((t) => {
        if (t.indexOf('tag:') != -1) {
            custom_tag.push(t)
        }
    })
    custom_tag.forEach(t => {
        let tag_data = []
        let cache_data = ''
        for (let l of t) {
            if (l == ':') {
                tag_data.push(cache_data)
                cache_data = ''
            } else {
                cache_data += l
            }
        }
        if (cache_data != '') {
            tag_data.push(cache_data)
        }
        let insert_pos = document.getElementById('js_item_food_time')
        console.log(tag_data)
        if (tag_data[1] == 'comp'){
            if(tag_data[2]=='armor_resilience'){
                insert_pos.insertAdjacentHTML('beforeend',translate(lang,tran_dict,'text.pow:armor_resilience.name') + String(tag_data[3]) + '<br>')
            }
            if(tag_data[2]=='armor_physical_protection'){
                insert_pos.insertAdjacentHTML('beforeend',translate(lang,tran_dict,'text.pow:armor_physical_protection.name') + String(tag_data[3]) + '<br>')
            }
            if(tag_data[2]=='armor_physical_reduction'){
                insert_pos.insertAdjacentHTML('beforeend',translate(lang,tran_dict,'text.pow:armor_physical_reduction.name') + String(tag_data[3]) + '<br>')
            }
            if(tag_data[2]=='armor_magic_protection'){
                insert_pos.insertAdjacentHTML('beforeend',translate(lang,tran_dict,'text.pow:armor_magic_protection.name') + String(tag_data[3]) + '<br>')
            }
            if(tag_data[2]=='armor_magic_reduction'){
                insert_pos.insertAdjacentHTML('beforeend',translate(lang,tran_dict,'text.pow:armor_magic_reduction.name') + String(tag_data[3]) + '<br>')
            }
            if(tag_data[2]=='movement_addition'){
                let d_str = String(tag_data[3])
                if (tag_data[3] > 0){
                    d_str = '+' + tag_data[3]
                }
                insert_pos.insertAdjacentHTML('beforeend',translate(lang,tran_dict,'text.pow:movement_addition.name') + d_str + '<br>')
            }
            if(tag_data[2]=='sneak_movement_addition'){
                let d_str = String(tag_data[3])
                if (tag_data[3] > 0){
                    d_str = '+' + tag_data[3]
                }
                insert_pos.insertAdjacentHTML('beforeend',translate(lang,tran_dict,'text.pow:sneak_movement_addition.name') + d_str + '<br>')
            }
            if(tag_data[2]=='equipment_type'){
                insert_pos.insertAdjacentHTML('beforeend',translate(lang,tran_dict,'text.pow:equipment_type.name') + String(tag_data[3]) + '<br>')
            }
            if(tag_data[2]=='actual_level'){
                insert_pos.insertAdjacentHTML('beforeend',translate(lang,tran_dict,'text.pow:actual_level.name') + String(tag_data[3]) + '<br>')
            }
        }
    })
}

window.onload = mod_spawn()