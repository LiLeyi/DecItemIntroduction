function fill_blank(blank_div, content, judge = "") {
    if (judge.length != 0) {
        blank_div.innerHTML = content;
    } else {
        blank_div.innerHTML = null;
    }
}

async function items_li_spawn() {
    let p_dic = get_p(window.location.href);
    let item_id = p_dic['item'];
    let item_dict = window.AddData[item_id]
    let resp = await fetch('static/data/items/'+window.AddData[item_id]['file_name'])
    let item_beh = await resp.json()
    item_dict['beh'] = item_beh
    let lang = p_dic['lang']

    let name_lang_obj = document.getElementById('js_item_name_lang');
    let name = undefined
    if (item_dict['lang'][lang] == undefined) {
        name = item_dict['beh']['components']['minecraft:display_name']['value']
    } else {
        name = item_dict['lang'][lang]
    }
    name_lang_obj.innerHTML = name;

    let item_id_obj = document.getElementById('js_item_id');
    item_id_obj.innerHTML = item_id;

    if (item_dict['loot'].length != 0) {
        fill_blank(document.getElementById('js_item_loot_by_entity'), translate(lang, DefaultTran, 'text.dec:loot_by_entity.name') + String(item_dict['loot_by_entity_lang'][lang]), item_dict['loot_by_entity_lang'][lang])
        fill_blank(document.getElementById('js_item_loot_by_block'), translate(lang, DefaultTran, 'text.dec:loot_by_block.name') + String(item_dict['loot_by_block_lang'][lang]), item_dict['loot_by_block_lang'][lang])
        for (let l of item_dict['loot']) {
            if (l.indexOf('loot_tables/gameplay/fishing/') != -1) {
                let loot_special = translate(lang, DefaultTran, 'text.dec:loot_by_fishing.name')
                fill_blank(document.getElementById('js_item_loot_by_fishing'), loot_special, loot_special)
                break
            }
        }
        if (JSON.stringify(item_dict['loot_by_structure']) != '{}') {
            let loot_structure = translate(lang, DefaultTran, 'text.dec:loot_by_structure.name')
            for (let k in item_dict['loot_by_structure']) {
                let add_l = k + translate(lang, DefaultTran, 'text.dec:loot_by_structure_dot1.name')
                for (let v of item_dict['loot_by_structure'][k]) {
                    add_l += translate(lang, DefaultTran, v) + translate(lang, DefaultTran, 'text.dec:loot_by_structure_dot2.name')
                }
                add_l = add_l.slice(0, add_l.length - 1)
                add_l = add_l + translate(lang, DefaultTran, 'text.dec:loot_by_structure_dot3.name')
                loot_structure += add_l
            }
            loot_structure = loot_structure.slice(0, loot_structure.length - 1)
            fill_blank(document.getElementById('js_item_loot_by_structure'), loot_structure, loot_structure)
        }
    }
    console.log(item_dict)
    let components = item_dict['beh']['minecraft:item']['components']
    if (components.hasOwnProperty('minecraft:durability')) {
        document.getElementById('js_item_durability').innerHTML = translate(lang, DefaultTran, 'text.dec:durability.name') + String(components['minecraft:durability']['max_durability'])
    }
    if (components.hasOwnProperty('minecraft:damage')) {
        document.getElementById('js_item_attack_damage').innerHTML = translate(lang, DefaultTran, 'text.dec:normal_attack.name') + String(components['minecraft:damage'])
    }
    if (item_dict['rec'].length != 0) {
        let from_crafttable = false
        let from_furnace = false
        let from_brew = false
        let stonecutter = false
        for (let r of item_dict['rec']) {
            if (r.indexOf('recipes/furnace_') != -1) {
                from_furnace = true
            } else if (r.indexOf('recipes/brew_') != -1) {
                from_brew = true
            } else if (r.indexOf('recipes/stonecutter_') != -1) {
                stonecutter = true
            } else {
                from_crafttable = true
            }
        }
        let craft_from = ''
        if (from_crafttable) {
            craft_from += translate(lang, DefaultTran, 'text.dec:recipe_crafttable.name')
        };
        if (from_furnace) {
            craft_from += translate(lang, DefaultTran, 'text.dec:recipe_furnace.name')
        };
        if (from_brew) {
            craft_from += translate(lang, DefaultTran, 'text.dec:recipe_brew.name')
        };
        if (stonecutter) {
            craft_from += translate(lang, DefaultTran, 'text.dec:recipe_stonecutter.name')
        };
        craft_from = craft_from.slice(0, craft_from.length - 1)
        fill_blank(document.getElementById('js_item_if_rec'), translate(lang, DefaultTran, 'text.dec:recipe.name') + craft_from, '1')
    } else {
        fill_blank(document.getElementById('js_item_if_rec'), translate(lang, DefaultTran, 'text.dec:recipe_no.name'), '1')
    }
    if (components.hasOwnProperty('minecraft:max_stack_size')) {
        document.getElementById('js_item_stack_max').innerHTML = translate(lang, DefaultTran, 'text.dec:stack_max.name') + String(components['minecraft:max_stack_size'])
    } else {
        document.getElementById('js_item_stack_max').innerHTML = translate(lang, DefaultTran, 'text.dec:stack_max.name') + '64'
    }
    if (components.hasOwnProperty('minecraft:cooldown')) {
        document.getElementById('js_item_cooldown').innerHTML = translate(lang, DefaultTran, 'text.dec:cooldown.name') + String(components['minecraft:cooldown']['category']) + ',' + String(components['minecraft:cooldown']['duration']) + 's'
    }
    if (components.hasOwnProperty('minecraft:enchantable')) {
        document.getElementById('js_item_enchant').innerHTML = translate(lang, DefaultTran, 'text.dec:enchant_type.name') + String(components['minecraft:enchantable']['slot']) + '<br>' + translate(lang, DefaultTran, 'text.dec:enchant_level.name') + String(components['minecraft:enchantable']['value'])
    }
    if (components.hasOwnProperty('minecraft:allow_off_hand')) {
        if (components['minecraft:allow_off_hand']) {
            document.getElementById('js_item_allow_offhand').innerHTML = translate(lang, DefaultTran, 'text.dec:allow_off_hand.name')
        }
    }
    if (components.hasOwnProperty('minecraft:foil')) {
        if (components['minecraft:foil']) {
            document.getElementById('js_item_foil').innerHTML = translate(lang, DefaultTran, 'text.dec:foil.name')
        }
    }
    if (components.hasOwnProperty('minecraft:food')) {
        document.getElementById('js_item_food_nutrition').innerHTML = translate(lang, DefaultTran, 'text.dec:nutrition.name') + String(components['minecraft:food']['nutrition'])
        document.getElementById('js_item_food_saturation_modifier').innerHTML = translate(lang, DefaultTran, 'text.dec:saturation_modifier.name') + String(components['minecraft:food']['saturation_modifier'])
        if (components.hasOwnProperty('minecraft:use_duration')) {
            document.getElementById('js_item_food_time').innerHTML = translate(lang, DefaultTran, 'text.dec:food_time.name') + String(components['minecraft:use_duration'])
        }
    }
    if (item_dict['texture'] != '') {
        document.getElementById('js_item_textures').innerHTML = '<img class="item_icon" src="static/data/' + item_dict['texture'] + '.png">'
    }
    if (item_dict['annotation'].length != 0) {
        let ann = translate(lang, DefaultTran, 'text.dec:annotation_title.name')
        for (let a of item_dict['annotation']) {
            ann = ann + a + '<br>'
        }
        quote(lang, AddTran, ann).then(outp => { document.getElementById('js_item_annotation').innerHTML = outp})
    }
}
window.onload = items_li_spawn()
//标题
page_title = window.AddName + translate(lang, DefaultTran, 'text.dec:title.name')
document.title = page_title

window.onkeydown = function () {
    if (event.keyCode == 27) {
        history.back()
    }
}
