/**
 * Created by nasa on 3/1/16.
 */

import React, { Component } from 'react';
import classNames from 'classnames';

import BaseInput from './input';

export default class select extends BaseInput{
    static defaultProps= {
        ...BaseInput.defaultProps,
        options: {},
        //source:null,
        loading:{label:'loading',value:null}
    };
    constructor(props) {
        super(props);

        if(typeof props.normalize =='function') this.normalize = props.normalize.bind(this);
        if(typeof props.normalizeOption =='function') this.normalizeOption = props.normalizeOption.bind(this);


        this.state['options'] = this.normalize(props.options);
    }
    componentDidMount() {
        super.componentDidMount();
        if(this.props.ajax){
            this.load();
        }
    }

    load(){
        let self = this;
        let {ajax} = this.props;
        if(ajax){
            this.loading();
            let {form} = this.props;
            let data = ajax.data ? ajax.data : {};
            if(ajax.fields){
                //let sel = undefined;
                ajax.fields.map((k)=>{
                   if(form._refs[k]){
                       data[k]=form._refs[k].value();
                       //console.log(k,{...form._refs[k].state});
                   }
                });
                ajax.data = data;
                //this.setValue(sel);
            }
            /*ajax.beforeSend = (xhr,opt)=>{
                if(ajax.fields){
                    //let sel = undefined;
                    ajax.fields.map((k)=>{
                        if(form._refs[k]){
                            data[k]=form._refs[k].value();
                            //console.log(k,{...form._refs[k].state});
                        }
                    });
                    ajax.data = data;
                    //this.setValue(sel);
                }
            };*/
            //console.log(ajax,data);
            //this.setOptions({'':this.props.loading});
            this.ajaxCall(ajax.url,ajax).then(json=>{
                //console.log('ajaxCall');
                if(typeof json === 'object' && json.result) {
                    this.setOptions(json.result);
                    //if(data.value) this.setValue(data);
                    if (json.result[0] && json.result[0].value){
                        //this.setValue(json.json[0].value);
                    }
                }else {
                    this.setOptions({});
                }
                this.loading(false);
            },err=>{
                //console.log('ajaxCall',err);
                this.loading(false);
                this.setOptions({' ':{label:'connection error'}});
            });
            /*setTimeout(()=>
                this.setOptions(options)
            ,2000)*/
        }
    }

    normalizeOption(itm){
        return itm;
    }
    normalize(options){
        if(options) {
            let result = options instanceof Array ? [] : {};
            Object.keys(options).map((ky)=>{
                let itm = options[ky];
                result[ky] = this.normalizeOption(itm);
            });
            /*result = $.map(options, (itm) => {
                return this.normalizeOption(itm);
            });*/
            return result;
        }
        return options;
    }


    options(){
        return this.state.options;
    }
    option(options,val){
        if(typeof options == 'undefined') options = this.state.options;
        if(typeof val == 'undefined') val = this.value();
        if(options){
            //console.log('this.state.options',this.state.options);
            //return this.state.options[this.value()];
            for(let k in options){
                let v = options[k];
                if(v.value == val) return v;
            }
        }
        return undefined;
    }
    firstKey(options){
        if(!options) options = this.options();
        return Object.keys(options)[0];
    }
    setOptions(options){
        if(options){
            options = this.normalize(options);

            if(this.value() /*&& this.value().length > 0*/ && this.option(options)){
                this.props.onChange.call(this,null,this.value());
            }else {
                if(this.props.multiple!==true) {
                    let firstkey = this.firstKey(options);
                    this.setValue(options[firstkey] && options[firstkey].value !== undefined ? options[firstkey].value : firstkey);
                    this.props.onChange.call(this, false, this.value());
                    //console.log('setOptions',this.value());
                }
            }
        }
        //console.log('af',this.value());
        this.setState({'options':options});
        this.state.options=options;
    }
    render_input(){
        let {options} = this.state;
        let props = {...this.props};
        props.options = undefined;
        return <select {...this.safeProps(props)} onChange={this.handleChange.bind(this)} value={this.value()}>
            {options && Object.keys(options).map((k)=>{
                let option = {...options[k]};
                if(typeof option.value === 'undefined') option.value = k;
                //option.selected = option.value == this.value();

                return (
                    <option key={k} {...this.safeProps(option)}>{option.label}</option>
                )
            })}
        </select>
    }
    render_(){
        let {options} = this.state;
        let props = {...this.props};
        props.options = undefined;

        return this.renderElement(
          <select {...this.safeProps(props)} onChange={this.handleChange.bind(this)} value={this.value()}>
            {options && Object.keys(options).map((k)=>{
                let option = {...options[k]};
                if(typeof option.value === 'undefined') option.value = k;
                //option.selected = option.value == this.value();

                return (
                    <option key={k} {...this.safeProps(option)}>{option.label}</option>
                )
            })}
          </select>
        );
    }
};