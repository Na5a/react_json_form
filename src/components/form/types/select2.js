/**
 * Created by nasa on 3/1/16.
 */
import React, { Component } from 'react';
import classNames from 'classnames';

import * as config from './../../../config';
//import sanitize from './../../../../utils/sanitize';
import BaseInput from './input';
import select from './select';

const $ = window.jQuery;
const jquery = window.jQuery;

function sanitize(val) {
    return val;
}

export default class select2 extends select{
    static defaultProps= {
        ...select.defaultProps,
        null_value: '000',
        className:'',
        style:{width:'100%'},

        picker:{ //move to componentDidUpdate
            //tags: "true",
        },
        floatingLabel:false
    };
    constructor(props) {
        super(props);
        this.state['value'] = this._normalize_value(props.value);
        //console.log('',this.state);
    }

    /*normalizeOption(itm){
        return {...itm, id: itm.id || itm.value, text: itm.label};
    }*/

    componentDidMount(){
        super.componentDidMount();
        var self = this;
        /*let props = {...this.props.picker};
        if(!props.placeholder) props.placeholder = this.props.placeholder;
        $(this.refs.select2).select2(props).off('change').on('change',function(e){
            self.handleChange.call(self,e);
        });*/
        this.init_lang();
        this.componentDidUpdate();
    }
    shouldComponentUpdate(nextProps, nextState){
        if(this.props.multiple == true) {
            //return this.state.value != nextState.value || this.state.options != nextState.options;
        }
        return true;
    }


    init_lang(){
        if(config.localize.name == 'fa'){
            (function(){if(jquery&&jquery.fn&&jquery.fn.select2&&jquery.fn.select2.amd)var e=jquery.fn.select2.amd;return e.define("select2/i18n/fa",[],function(){return{errorLoading:function(){return"امکان بارگذاری نتایج وجود ندارد."},inputTooLong:function(e){var t=e.input.length-e.maximum,n="لطفاً "+t+" کاراکتر را حذف نمایید";return n},inputTooShort:function(e){var t=e.minimum-e.input.length,n="لطفاً تعداد "+t+" کاراکتر یا بیشتر وارد نمایید";return n},loadingMore:function(){return"در حال بارگذاری نتایج بیشتر..."},maximumSelected:function(e){var t="شما تنها می‌توانید "+e.maximum+" آیتم را انتخاب نمایید";return t},noResults:function(){return"هیچ نتیجه‌ای یافت نشد"},searching:function(){return"در حال جستجو..."}}}),{define:e.define,require:e.require}})();
        }
    }
    componentDidUpdate(prevProps,prevState) {
        super.componentDidUpdate(prevProps,prevState);
        var self = this;
        let props = {
            placeholder: null,
            allowClear: false,
            minimumResultsForSearch: 10,
            selectOnClose: true,
            language: config && config.localize.name || 'en',
            dir: config && config.localize.dir || 'ltr',
            //data: this.state.options,
            ...this.props.picker
        };
        if(!props.placeholder) props.placeholder =this.props.placeholder;

        let $el = jquery(this.refs.select2);
        $el.select2(props).off('change').on('change',function(e){
            if(self.props.multiple == true) {
                self.handleChange.call(self, $el.val());
            }else {
                let val = sanitize($el.val());
                self.handleChange.call(self, val);
                //$el.focus();
                //$el.select2('focus');
                $el.select2('open');
                $el.select2('close');
            }

        }).on("select2:open", function(e) {
            if(self.props.multiple != true) {
                jquery('.select2-dropdown .select2-search__field:first').on('change keydown', function (e) {
                    let $this = jquery(this);
                    $this.val(sanitize($this.val()));
                });
            }
        });
    }
    setOptions(options){
        //console.log('bf',this.value(),this.option(options),this.value().length);
        if(options){
            if(this.placeholder_available(options)){
                options.unshift({value:this._nullValue(),label:this.props.placeholder || this.props.picker.placeholder});
            }
        }
        super.setOptions(options);
    }
    _normalize_value(value){
        if(!value && value!=='0' && value!==0){
            value = this._nullValue();
        }
        return value;
    }
    _nullValue(){
        return this.props.null_value;
    }
    setValue(value){
        super.setValue(this._normalize_value(value));
    }
    value(){
        if(this.state.value === this._nullValue()){
            return '';
        }
        return super.value();
    }

    placeholder_available(options){
        if(!options) options = this.options();
        let first_option = options[this.firstKey(options)];
        return this.props.multiple!=true && (this.props.placeholder || this.props.picker.placeholder) && (first_option && first_option.value && first_option.value != this._nullValue());
    }
    render_placeholder___(){
        let {options} = this.state;
        let first_option = options[this.firstKey(options)];

        if((this.props.placeholder || this.props.picker.placeholder) && (first_option && first_option.value)){
            return <option value={this._nullValue()} className="text-muted">{this.props.placeholder || this.props.picker.placeholder}</option>;
        }

        return null;
    }
    render_tip(){
        return null;
    }
    render_label(){
        let label = <span>{this.props.label}
            {this.props.tip && <span className="font-85p text-muted ml-5">{this.props.tip}</span>|| null}
        </span>;

        return super.render_label(label);
    }
    render_input(){
        let {options} = this.state;
        let props = {...this.props};
        props.options = undefined;
        //let first_option = options[Object.keys(options)[0]];
        let val = this._normalize_value(this.value());

        return <select {...this.safeProps(props)} ref="select2" onChange={this.handleChange.bind(this)} value={val}>
            {options && Object.keys(options).map((k)=>{
                let option = {...options[k]};
                if(!option.value) option.value = k;
                //option.selected = option.value == this.value();
                return (
                    <option key={k} {...this.safeProps(option)}>{option.label}</option>
                )
            })}
        </select>

    }
    render(){
        if(this.isCleanMode()){
            return this.render_input();
        }
        return this.renderElement(this.render_input(),true,false);
    }
    render_(){
        let {options} = this.state;
        let props = {...this.props};
        props.options = undefined;
        //let first_option = options[Object.keys(options)[0]];
        let val = this._normalize_value(this.value());
        //console.log(this.value());
        return this.renderElement(
          <select {...this.safeProps(props)} ref="select2" onChange={this.handleChange.bind(this)} value={val}>
              {/*this.render_placeholder()*/}
            {options && Object.keys(options).map((k)=>{
                let option = {...options[k]};
                if(!option.value) option.value = k;
                //option.selected = option.value == this.value();
                return (
                    <option key={k} {...this.safeProps(option)}>{option.label}</option>
                )
            })}
          </select>
        ,true,false);
    }
};