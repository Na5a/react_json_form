/**
 * Created by nasa on 3/1/16.
 */

import React, { Component } from 'react';
import classNames from 'classnames';

import BaseInput from './input';
import Icon from './../../../components/Icon';
import i18n from './../../../utils/i18n';

export default class pincode extends BaseInput{
    static defaultProps= {
        ...BaseInput.defaultProps,
        length:4,
        numerical:true,
        validatePins:true,
        validatePinsMsg:"invalid x",
    };
    constructor (props) {
        super(props);
        this.state['numerical'] = props.numerical;
        this.state['values'] = (props.value) ? props.value.toString().split("") : [];
    }
    setValue(val){
        super.setValue(val);
        val = (val) ? val.toString().split("") : [];
        this.state.values = val;
    }
    value(){
        if(this.isCleanMode()){
            return super.value();
        }
        /*let val = '';
        for(let i=0;i<this.length();i++){
            //val +=this.refs['input_'+i].value;
            val +=this.state.values[i];
        }*/
        let val = this.state.values.join('');
        return val;
    }
    join(){
        return this.state.values.join('');
    }
    getValueOf(i){
        //console.log(this.refs['input_'+i],this.props.value,this.props.value.substr(i,1));
        /*if(this.refs['input_'+i] && this.refs['input_'+i].value.length){
            this.refs['input_'+i].value;
        }else if(this.props.value){
            return this.props.value.substr(i,1);
        }*/
        if(this.state.values[i]){
            return this.state.values[i];
        }
        return '';
    }
    focus(){
        if(this.isCleanMode()){
            return super.focus();
        }
        if(this.refs.input_0){
            this.refs.input_0.focus();
        }
    }
    _input_type(){
        return this.state['numerical'] ? 'number' : 'text';
    }
    length(){
        return this.props.length;
    }
    handleChange(i,e){
        if(this.isCleanMode()){
            return super.handleChange(e);
        }
        //console.log(e,e.target.value,e.target.value.length);
        if(!e.target.value){
            e.target.value = '';
        }else if(e.target.value.length > 1){
            e.target.value = e.target.value.substr(1,1);
        }
        this.state.values[i] = e.target.value;
        super.handleChange(this.join());
    }
    handleKeyUp(i,e){
        super.handleSubmitByEnter(e);
        //console.log(i < this.length());
        let crnt = 'input_'+i;
        if(i > 0 && e.keyCode == 8 && !this.refs[crnt].value.length) {
            let nxt = 'input_'+(i-1);
            this.refs[nxt].focus();
        }else if(i+1 < this.length()){
            let nxt = 'input_'+(i+1);
            if(this.refs[nxt] && this.refs[crnt].value.length) this.refs[nxt].focus();
        }else if(i+1 == this.length()){
            this.doValidate();
        }
    }
    validate(){
        let validate = super.validate();
        if(validate && this.props.validatePins){
            if(this.length() != this.value().toString().length){
                validate = false;
                this.setValidateMsg(i18n._(this.props.validatePinsMsg,{x:this.props.placeholder}));
            }
        }
        return validate;
    }
    render_inputs(){
        let els = [];
        for(let i=0;i<this.length();i++){
            els.push(<input key={i} maxLength='1' ref={'input_'+i} type={this._input_type()} onChange={this.handleChange.bind(this,i)} min="0" max="9" onKeyUp={this.handleKeyUp.bind(this,i)} onClick={this.handleClick.bind(this)} onBlur={this.handleBlur.bind(this)} onFocus={this.handleFocus.bind(this)} value={this.getValueOf(i)} pattern="[0-9]*" />);
        }
        return els;
    }
    render(){
        let props = {...this.props};
        let inputGroupClassName = classNames(this.props.className,{
            ['sp-input-pins']: true,
        });
        if(this.isCleanMode()){
            return this.render_input();
        }
        return this.renderElement(
            <div className={inputGroupClassName} style={this.props.style}><div>
                {this.render_inputs()}
            </div></div>
        ,true,true);
    }
};