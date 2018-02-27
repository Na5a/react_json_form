/**
 * Created by nasa on 3/1/16.
 */
import i18n from './../../utils/i18n';

var rules = {
    /*validate(type,value,params){
        let v = this[type];
                console.log('validate.validate',v);
        if(v){
            if(v.validate instanceof RegExp){
                return v.validate.test(value);
            }else if(typeof v.validate == "function") {
                return v.validate.call(this,value,{...params});
            }
        }
        return false;
    },*/
    'matchTo':{
        validate:function(value,to){
            //console.log('matchTo',this,value,to);
            let mt = this.props.form._get(to);
            if(mt){
                return mt.value() == value;
            }
            return true;
        },
        error:i18n._("invalid x",{x:i18n._('value')})
    },
    'between':{
        validate:function(value,to){
            //console.log('matchTo',this,value,to);
            return value >= to[0] && value <= to[1];
        },
        error:i18n._("invalid x",{x:i18n._('value')})
    },
    'max':{
        validate:function(value,to){
            //console.log('matchTo',this,value,to);
            return value <= to;
        },
        error:(ret,value,to)=>(i18n._("x must smaller than y",{x:value,y:to}))
    },
    'min':{
        validate:function(value,to){
            //console.log('matchTo',this,value,to);
            return value >= to;
        },
        error:(ret,value,to)=>(i18n._("x must bigger than y",{x:value,y:to}))
    },
    'maxLen':{
        validate:function(value,to){
            value = value + '';
            return value.length <= to;
        },
        error:(ret,value,to)=>(i18n._("length of x must smaller than y",{x:value,y:to,len:value.length}))
    },
    'minLen':{
        validate:function(value,to){
            value = value + '';
            return value.length >= to;
        },
        error:(ret,value,to)=>{
            return i18n._("length of x must bigger than y",{x:value,y:to,len:value.length})
        }
    },
    'numeric':{
        validate:/[0-9]*/i,
        error:i18n._("invalid x",{x:i18n._('number')})
    },
    'required':{
        validate:function(value){
            let v = value + '';
            //console.log('required',value,this.props.name);
            return value && v.length >= 1;
        },
        error:i18n._('required')
    },
    "phone": {
        validate: /^([\+][0-9]{1,3}([ \.\-])?)?([\(][0-9]{1,6}[\)])?([0-9 \.\-]{1,32})(([A-Za-z \:]{1,11})?[0-9]{1,4}?)$/,
        error: i18n._("invalid x",{x:i18n._('phone number')})
    },
    "mobile": {
        validate: /^0{1}((910)|(911)|(912)|(913)|(914)|(915)|(916)|(917)|(918)|(919)|(990)|(901)|(902)|(903)|(930)|(933)|(934)|(935)|(936)|(937)|(938)|(939)|(932)|(920)|(921)|(922)){1}[0-9]{7}$/,
        error: i18n._("invalid x",{x:i18n._('mobile number')})
    },
    "email": {
        validate: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        error: i18n._("invalid x",{x:i18n._('email')})
    },
    "date": {
        //	Check if date is valid by leap year
        validate: function (field) {
            var pattern = new RegExp(/^(\d{4})[\/\-\.](0?[1-9]|1[012])[\/\-\.](0?[1-9]|[12][0-9]|3[01])$/);
            var match = pattern.exec(field.val());
            if (match == null) return false;

            var year = match[1];
            var month = match[2]*1;
            var day = match[3]*1;
            var date = new Date(year, month - 1, day); // because months starts from 0.

            return (date.getFullYear() == year && date.getMonth() == (month - 1) && date.getDate() == day);
        },
        "error": "* Invalid date, must be in YYYY-MM-DD format"
    }
};
function validate(type,value,params){
    let v = rules[type];
    let ret = false;
    //console.log('validate.validate',this,type,value,params);
    if(v){
        if(typeof params == "object") {
            v = {...v, ...params};
        }else{
            v = {...v};
        }
        if(v.validate instanceof RegExp){
            ret=v.validate.test(value);

        }else if(typeof v.validate == "function") {
            //if(typeof params !== 'object') params={params};
            ret=v.validate.call(this,value,params);
        }

        if(!ret) this.setValidateMsg(typeof v.error == "function" ? v.error.call(this,ret,value,params,v,type,rules) : v.error);
    }
    return ret;
}


export default {validate:validate,rules:rules};