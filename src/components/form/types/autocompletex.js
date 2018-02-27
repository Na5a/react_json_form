/**
 * Created by nasa on 3/1/16.
 *
 */

import React, { Component } from 'react';
import classNames from 'classnames';

import Icon from './../../../components/Icon';
import i18n from './../../../utils/i18n';

import autocomplete from './autocomplete';

export default class Autocompletex extends autocomplete{
    static defaultProps= {
        ...autocomplete.defaultProps,
        //data:['first','second','number','nha','wha','bvc','ccn','iop','poj','opl'],
        minChars:1,
        selected:{},
        selectMode: 'all', // [selectable, all]
        unSelectErrorMsg: i18n._('select x'),
    };
    constructor (props) {
        super(props);
        this.state = {...this.state,
            selected:this.props.selected,
            selected_old:{},
        };
    }
    componentWillUnmount() {
        if(super.componentWillUnmount) super.componentWillUnmount();
        this.dispose_autocomplete();
    }
    handleFocus(e){
        if(this.state.selected_old.label != this.state.value){
            super.handleFocus(e);
        }else{
            super.superHandleFocus(e);
        }
    }
    handleUnSelect(e){
        if(e && e.preventDefault) e.preventDefault();
        //this.setValue(this.state.selected.label);
        if(!this.state.value && this.state.selected){
            this.state.selected_old = this.state.selected;
            this.setValue(this.state.selected.label);
        }
        this.select({});
        if(this.props.ajax) this.setOptions({});
        setTimeout(()=>{
            if(this.refs._input) {
                this.focus();
                //this.refs._input.value = this.state.value;
            }
        },10);
    }
    handleBlur(e){
        //if(e && e.preventDefault) e.preventDefault();
        if(this.state.selected_old.label == this.state.value){
            this.select(this.state.selected_old);
        }
        super.handleBlur();
    }
    handlePreventBS(e){
        if (e.which === 8) {
            this.handleUnSelect();
            e.preventDefault();
        }
    }
    setValue(val){
        super.setValue(val);
        //this.handleUnSelect();
    }
    selected(){
        return this.state.selected;
    }
    value(){
        if(this.state.selected.value){
            return this.state.selected.value;
        }else if(this.props.selectMode == 'all'){
            return this.state.value;
        }
        return null;
    }
    select(sel){
        this.setState({selected:sel});
    }
    onSelect(sel) {
        if (!sel.label) sel.label = sel.value;
        this.select(sel);
        this.setValidate(true);
        this.fixTab();
        this.dispose_autocomplete();
    }
    fixTab(){
        //console.log(this);
        setTimeout(()=>{
            window.jQuery(this.refs._input).focus();
        },10);
    }
    render(){
        let {selected} = this.state;
        let el;
        if(typeof selected.value == 'undefined'){
            el= super.render();
        }else{
            this.dispose_autocomplete();
            el=this.renderElement(
                <div className="input-group" onClick={this.handleUnSelect.bind(this)}>
                    <span className="overflow-hidden form-control" >
                        {selected.label}
                    </span>
                    <span className="input-group-btn">
                        <button className="btn btn-default" onKeyDown={this.handlePreventBS.bind(this)} ref="_input" onClick={this.handleUnSelect.bind(this)}><Icon icon="times" /></button>
                    </span>
                </div>
            ,true,false,false);
        }
        return el;
    }
};