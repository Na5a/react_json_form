/**
 * Created by nasa on 3/1/16.
 */
import React, { Component } from 'react';
import classNames from 'classnames';

import BaseInput from './input';
//import Uniform from './uniform-checkbox';

export default class checkbox extends BaseInput{
    static defaultProps= {
        ...BaseInput.defaultProps,
        className: 'checkbox-primary',
        checked: false,
        unchecked_value: '',
        bootstrap_checkbox:true,
        validateOnChange: true,
    };
    constructor (props) {
        super(props);
        this.state = {
            ...this.state,
            checked:props.checked
        }
    }
    isChecked(){
        return this.state.checked;
    }
    setValue(v){
        let val = (v && v!=this.props.unchecked_value ? true : false);
        this.setState({
            checked: val
        });
        //this.state.checked = val;
    }
    value(){
        //console.log('this.isChecked() ? super.value() : null;',this.isChecked() ? super.value() : null);
        return this.isChecked() ? super.value() : this.props.unchecked_value;
    }
    handleChange(e){
        super.handleChange(!e.checked);
        //this.setValue(this.refs.checkbox.checked);
    }
    handleOnClick(e){
        //this.setValue(!this.refs.checkbox.checked);
        //console.log(e,this.refs.checkbox.checked);
        this.handleChange(this.refs.checkbox);
    }
    handleOnKeyUp(e){
        if(e.preventDefault) e.preventDefault();
        if(e && (e.keyCode == 13 || e.keyCode == 32)){
            this.handleOnClick(e);
        }
    }
    render_input(){
        let name = this.props.name;
        //let id = this.props.id ? this.props.id : name+'_'+this.props.value;
        let checked = this.state.checked;
        return <input type="checkbox" {...this.safeProps()} ref="checkbox" name={name} checked={checked} onChange={this.handleChange.bind(this)} />;
    }
    render(){
        //console.log(this.state);
        //let {options} = this.props;
        let name = this.props.name;
        let id = this.props.id ? this.props.id : name+'_'+this.props.value;
        let className = classNames(this.props.className,{
            ['checkbox']: this.props.bootstrap_checkbox
        });
        if(this.isCleanMode()){
            return this.render_input();
        }
        return this.renderElement(
            <div className={className} key={id} onClick={this.handleOnClick.bind(this)}>
                {this.render_input()}
                <label htmlFor={id} >{this.props.label}</label>
            </div>
        ,false);
    }
};