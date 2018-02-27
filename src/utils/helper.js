/**
 * Created by nasa on 2/28/16.
 */

import cloner from "cloner";

/**
 * Deep merge two objects.
 * @param target
 * @param source
 */
export function mergeDeep(target, source) {
    return cloner.deep.merge(target, source);
}

export function assign(source) {
    return cloner.deep.copy(source);
}

export function map(objs,cb){
    for(let k in objs){
        let obj = objs[k];
        cb.call(this,obj,k);
    }
}

export function getQueryVariable() {
    let query = window.location.search.substring(1);
    let vars = query.split('&');
    let output = {};
    for (var i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        output[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return output;
}

Object.size = function(obj) {
    if( typeof obj !== 'object' ) {
        return null;
    }
    let size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

export function getInObject(key,object) {
    if(!key) return null;
    let _data = object;

    return key.split('.').reduce((o,i)=>o ? o[i] : null, _data);
}

