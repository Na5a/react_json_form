/**
 * Created by nasa on 3/1/16.
 *
 */

import React, { Component } from 'react';
import classNames from 'classnames';

import Icon from './../../Icon';
import Translator from './../../Translator';

import autocomplete from './autocompletex';

export default class Autocompletex2 extends autocomplete{
    static defaultProps= {
        ...autocomplete.defaultProps,
        addText: "autocomplete add a new x",
        noResultText: false,
        noValueText: false,
    };
    constructor (props) {
        super(props);
        this.state = {
            ...this.state,
            _value: ''
        };
        if(typeof props.handleAddFloat=="function") this.handleAddFloat = props.handleAddFloat.bind(this);
        if(typeof props.handleFloatBoxClick=="function") this.handleFloatBoxClick = props.handleFloatBoxClick.bind(this);
        if(typeof props.handleKeepFocus=="function") this.handleKeepFocus = props.handleKeepFocus.bind(this);
    }

    isAddMode(){
        return this.props.selectMode == 'all' && !this.isLoading() && (!this.state.options || this.state.options.length==0) && this.state.value && this.state.value != this.state._value;
    }
    handleAddFloat(e){
        if(e) e.preventDefault();
        this._setValue(this.state.value);
        setTimeout(()=>{this.doValidate();},1);
    }
    _setValue(val){
        this.setState({_value:val});
    }
    setValue(val){
        super.setValue(val);
        if(this.state._value) this._setValue('');
    }
    value(){
        if(this.state.selected.value){
            return this.state.selected.value;
        }else if(this.props.selectMode == 'all'){
            return this.state._value;
        }
        return null;
    }
    handleBlur(e){
        //super.handleBlur(e);
        setTimeout(()=>{
            if(!this.isActiveElement()) super.handleBlur(e);
        },150);
    }
    handleKeepFocus(e){
        if(e && e.preventDefault) e.preventDefault();
        this.focus();
    }

    handleFloatBoxClick(onClick,e){
        if(e && e.preventDefault) e.preventDefault;
        this.handleKeepFocus(e);

        if(typeof onClick == 'function') onClick(e);
    }
    render_floatBox(el,onClick,className){
        if(!className) className = '';
        className = classNames(className,{
            ['autocomplete-suggestion']:true,
            ['autocomplete-suggestion-floatbox']:true,
        });

        return <div className="position-relative" onClick={this.handleKeepFocus.bind(this)}>
            <div className="position-absolute autocomplete-suggestions full-width" style={{top:-21,zIndex:100,overflow:'hidden'}}>
                <div className={className} onClick={this.handleFloatBoxClick.bind(this,onClick)}>
                    {el}
                </div>
            </div>
        </div>;
    }
    _addTextObj(){
        let obj = this.props.addText;
        if(typeof obj == 'string')
            obj = <span><b><Icon icon="plus" /></b> <Translator x={this.state.value}>{this.props.addText}</Translator></span>;
        return obj;
    }
    _noResultTextObj(){
        let obj = this.props.addText;
        if(typeof obj == 'string')
            obj = <Translator x={this.state.value}>{this.props.noResultText}</Translator>;
        return obj;
    }
    render(){
        let {selected} = this.state;
        let el = null;


        if(typeof selected.value == 'undefined'){
            el= <div>
                {super.render()}
                <div className="clear"></div>
                {this.isVisible() && this.hasFocus() && (!this.isLoading() && this.isAddMode()
                && this.render_floatBox(this._addTextObj(),this.handleAddFloat.bind(this))
                || (this.props.noResultText && !this.isLoading() && this.state.value && !this.state._value && (!this.state.options || this.state.options.length==0)
                    && this.render_floatBox(this._noResultTextObj())
                || (this.props.noValueText && !this.state.value
                        && this.render_floatBox(this._noResultTextObj())
                || null))) || null}
            </div>;
        }else{
            this.dispose_autocomplete();
            el=this.renderElement(
                <div className="input-group" onClick={this.handleUnSelect.bind(this)}>
                    <span className="overflow-hidden form-control" >
                        {selected.label}
                    </span>
                    <span className="input-group-btn">
                        <button className="btn btn-default" ref="_input" onKeyDown={this.handlePreventBS.bind(this)} onClick={this.handleUnSelect.bind(this)}><Icon icon="times" /></button>
                    </span>
                </div>
            ,true,false,false);
        }
        //console.log(el,selected,typeof selected.value == 'undefined');
        return el;
    }
};