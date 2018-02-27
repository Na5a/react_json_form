/**
 * Created by nasa on 3/8/16.
 */
import * as reducer from '../reducers/ajax';
import jquery from 'jquery';


class ajax {
    static _cache = {};
    static _tkn = '';
    static _inst_ = false;
    _dispatch = undefined;
    _watches = {};
    _result = {};
    _requests = 0;
    _retry = true;
    _max_retry_per_request = 5;
    _fails = {total:0, continuous:0};
    _q = [];

    static instance() {
        if (ajax._inst_ == false) {
            ajax._inst_ = new ajax();
        }
        return ajax._inst_;
    }
    constructor() {
        this.init();
    };
    init(){

    }

    connect(dispatch){
        this._dispatch = dispatch;
        return this;
    }
    /*
    * set and get cache request
    */
    _cache(name,value=undefined){
        if(typeof value == 'undefined') {
            if (typeof ajax._cache[name] != 'undefined') {
                return ajax._cache[name];
            }
            return false;
        }
        if(name){
            ajax._cache[name] = value;
        }

        return false;
    }
    clear_cache(){
        ajax._cache = {};
    }

    dispatch(action){
        if(this._dispatch) this._dispatch(action);
        return this;
    }
    dispatch_loading(){
        this.dispatch(reducer.loading());
    }
    dispatch_load(){
        //if(!data) data = this.result();
        let data = {
            status:{
                fails: this._fails,
                requests: this._requests
            }
        };
        this.dispatch(reducer.load(data));
    }

    setResult(res){
        this._result = res;
        this.dispatch_load();
        return this;
    }

    result(){
        return this._result;
    }

    add(options){
        options = {
            _cache:false,           // set false for no cache otherwise set a string for cache key
            track:true,             // set false to force disable ajax request tracking
            tryCount:1,             // request number of try
            retryLimit:99999,       // max number of try
            retryDelay:30*1000,     // wait for resend request
            retry:true,             // enable retry system
            timeout: 60000,         // request timeout
            ...options
        };
        if(typeof options.data == 'undefined') options.data = {};
        if(options.data instanceof FormData) options.data.append('_tkn_',ajax._tkn);
        else options.data['_tkn_'] = ajax._tkn;

        let  opt = {
            ...options,

            beforeSend:(xhr)=>{
               // xhr.setRequestHeader('x-browser-mode','1');
                this._requests++;
                this.dispatch_loading();
                if(typeof options.beforeSend == 'function') options.beforeSend.call(this,xhr,opt);
            },complete:(xhr,status)=>{
                if(typeof options.complete == 'function') options.complete.call(this,xhr,status);

                //start tracking
                if(options.track) {
                    this.track_request(options, status, xhr);
                }
            },success:(data,status,xhr)=>{
                //console.log(data);
                if(typeof data._tkn_ != 'undefined'){
                    ajax._tkn = data._tkn_;
                    localStorage.setItem('_tkn',ajax._tkn);
                    //console.log(localStorage);
                }
                this.onEver(data);
                this._watch_run();

                if(options._cache) this._cache(options._cache, data);
                if(typeof options.complete == 'function') options.success.call(this,data,status,xhr);
                if(typeof options.callback == 'function') options.callback.call(this,data,status,xhr);

                this._fails.continuous = 0;
                //this.onComplate(data);

            },error:(jqXHR, textStatus, errorThrown)=>{
                if(textStatus == 'abort'){
                    if(typeof options.abort == 'function') options.abort.call(this,jqXHR);
                    if(typeof options.callback == 'function') options.callback.call(this,{},textStatus, errorThrown);
                    this._watch_run();
                    return;
                }

                this._fails.total++;
                this._fails.continuous++;
                this.onEver({_error:'connection error'});
                this._watch_run();

                if(typeof options.error == 'function') options.error.call(this,textStatus, errorThrown,jqXHR);
                if(typeof options.callback == 'function') options.callback.call(this,{},textStatus, errorThrown);

                //console.log(errorThrown , textStatus, jqXHR);
                if (options.retry && (textStatus == 'timeout' || jqXHR.status == 0)) {
                    options.tryCount++;
                    if (options.tryCount <= options.retryLimit) {
                        //console.log(this,options.tryCount , options.retryLimit);
                        //$.ajaxQ(opt.url,opt);
                        setTimeout(()=>{
                            this.add(options);
                        },options.retryDelay);
                    }
                }
            }
        };
        //console.log({...opt});
        if(opt._cache && this._cache(opt._cache)){
            return new Promise((resolve,reject)=>{
                let data = this._cache(opt._cache);
                opt.success.call(this, data,304,undefined);
                resolve(data);
            });
        }else{
            let xhr = jquery.ajaxQ(opt.url, opt);
            //console.log( xhr);
            return xhr;
        }
    }
    onComplate(data) {

    }
    onEver(data) {
        this.setResult(data);
    }
}

export default ajax.instance();