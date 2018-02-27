/**
 * Created by nasa on 5/28/16.
 */


import React, { Component } from 'react';

import BaseInput from './input';
import MailInput from './mail';
import MaskInput from './mask';
import i18n from './../../../utils/i18n';

export default class logininput extends BaseInput{
    static defaultProps= {
        ...BaseInput.defaultProps,
        defaultInput:'mail',
    };
    constructor (props) {
        super(props);
        //console.log(props);
        this.state['_type'] = props.defaultInput;
    }
    onChange(old_value,new_value) {
        //console.log(old_value,new_value);
        let val = new_value;//this.refs._input.value();
        let newState = {};
        if (val && val.toString().indexOf('@') == -1 && (
                val.toString().charAt(0) == '0' || val.toString().charAt(0) == '9' ||
                val.toString().charAt(0) == '۰' || val.toString().charAt(0) == '۹'
        )) {
            newState = {'_type': 'mobile'};
        } else {
            newState = {'_type': 'mail'};
        }

        if (newState._type && newState._type != this.state._type) {
            newState.value = val;
            this.setState(newState);
            this.render_input_focus_fix();
        } else {
            this.state.value = val;
        }
    }
    value(){
        if(this.refs._input) {
            return this.refs._input.value();
        }
        return this.state.value;
    }
    setValue(val){
        /*this.setState({
            value: val
        });*/
        //console.log(val);
        this.state.value = val;
    }
    validate(){
        if(this.refs._input) {
            return this.refs._input.validate();
        }
        return false;
    }
    focus(){
        if(this.refs._input) this.refs._input.focus();
    }
    hasFocus(){
        if(this.refs._input) this.refs._input.hasFocus();
        //return this.state.hasFocus;
    }
    isActiveElement(){
        return this.hasFocus() && document.activeElement == this.refs._input.isActiveElement();
    }
    render_input_email(){
        let props = {
            placeholder:i18n._('enter email or mobile for login'),
            label:i18n._('email'),
            ...this.props,
            ref:'_input',
            rules:{required:true,email:true},
            icon:'at',
            value:this.state.value,
            className:'form-control ltr text-align',
            onChange:this.onChange.bind(this),
            //handleChange:this.handleChange.bind(this),
        };
        return <MailInput {...props} />;
    }
    render_input_mobile(){
        let props = {
            placeholder:i18n._('mobile phone number'),
            label:i18n._('mobile phone number'),
            ...this.props,
            ref:'_input',
            mask:'mobile',
            rules:{mobile:true,required:true},
            icon:'mobile',
            className:'form-control ltr text-align',
            //tip:i18n._('tip.enter mobile phone number'),
            value:this.state.value,
            onChange:this.onChange.bind(this),
            //handleChange:this.handleChange.bind(this),
        };
        return <MaskInput {...props} />;
    }
    render_input_focus_fix(i){
        if(!i) i=0;
        setTimeout(()=>{
            if(this.refs._input){
                return this.focus();
            }else if(i < 4){
                i++;
                this.render_input_focus_fix(i);
            }
        });
    }
    _render_input(){
        //let val = this.value();
        let input;
        //console.log(this.state._type);
        this.render_input_focus_fix();
        if(this.state._type == 'mobile'){
            return this.render_input_mobile();
        }else{
            return this.render_input_email();
        }
        return input;
    }
    render(){

        if(this.state._type == 'mobile'){
            return this.render_input_mobile();
        }else{
            return this.render_input_email();
        }

    }
};