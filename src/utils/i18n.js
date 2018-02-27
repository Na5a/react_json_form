
import trnsltr from 'i18next';
/*const trnsltr =()=>{
    function t(tran,opt){return tran}
};*/

class i18n {
    _language = '';

    static _inst_=false;
    static instance(){
        if(i18n._inst_==false){
            i18n._inst_ = new i18n();
            i18n._inst_.init();
        }
        return i18n._inst_;
    }
    constructor() {
        //super();
    };
    language(){
        return this._language;
    }
    dir(){
        if(this._language=='fa' || this._language=='ar'){
            return 'rtl';
        }
        return 'rtl';
    }
    init(){
        /*let res_1 = require('json!./locales/'+this._language+'/translation.json');
        let res_2 = require('json!./locales/'+this._language+'/translation_hr.json');
        let resources = {...res_1,...res_2};*/
        let resources = {};
        trnsltr.init({
                lng: this._language,
                fallbackLng: this._language,
                debug:false,
                resources:{
                    [this._language]:{translation:resources}
                },
            },function(err, t) {

            });

    }
    translate(t,opt={}){
        if(typeof trnsltr=="undefined") return t;

        if(t == null || t == undefined) return t;
        if(typeof opt.defaultValue == 'undefined') opt.defaultValue = t.toString();
        arguments[0] = t.toString().toLowerCase();
        if(typeof opt._escape !='undefined' && opt._escape == false)  opt['interpolation']={escape: false};
        return trnsltr.t.apply(trnsltr,arguments);
    }
    _(t,opt={}){
        return this.translate.apply(this,arguments);
    }

}

export default i18n.instance();