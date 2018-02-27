/**
 * Created by nasa on 2/21/16.
 */
export const isBrowser = typeof window !== 'undefined';
export const isProduction = process.env.NODE_ENV=='production';

export const api_url = '//'+ window.location.hostname +'/';

export function api_call(url){
    if(url.charAt(0)=='/') url=url.substr(1);
    return (isBrowser ? window.location.protocol : 'http') + api_url + url;
}

export function isSSL(){
    return isBrowser && window.location.protocol == "https:";
}
export function isSmallScreen(sz=768){
    return isBrowser && window.innerWidth < sz;
}

export const localize ={
    name:'fa',
    dir: 'rtl'
};

