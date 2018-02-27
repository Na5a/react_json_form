/**
 * Created by nasa on 3/1/16.
 */

import React, { Component } from 'react';
import classNames from 'classnames';

import BaseInput from './input';

export default class numerical extends BaseInput{
    static defaultProps= {
        ...BaseInput.defaultProps,
        min:undefined,
        max:undefined,
        separator:true,
        decimal:false,
        pattern:/\B(?=(\d{3})+(?!\d))/g,
        replace:',',
        onKeyDown:function (e){
            let keys =  [46, 8, 9, 27, 13, 110, 190];
            // Allow: backspace, delete, tab, escape, enter and .
            if (keys.indexOf(e.keyCode) !== -1 ||
                // Allow: Ctrl/cmd+A
                (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: Ctrl/cmd+C
                (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: Ctrl/cmd+X
                (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        }
    };

    constructor (props) {
        super(props);
    }

    componentDidUpdate(prevProps,prevState) {
        super.componentDidUpdate(prevProps,prevState);
    }

    componentDidMount() {
        if(super.componentDidMount) super.componentDidMount();

    }
    setValue(val){
        if(val==null) return;

        val= val && typeof val.toString =="function" ? val.toString().replace(/\,/g, '') : '';

        if(this.props.min && parseFloat(val) < this.props.min) val = this.props.min;
        else if(this.props.max && parseFloat(val) > this.props.max) val = this.props.max;

        let parts = val.toString().split(".");
        if(val && this.props.separator){
            parts[0] = parts[0].replace(this.props.pattern, this.props.replace);
        }
        val = (this.props.decimal) ? parts.join(".") : parts[0];

        super.setValue(val);
    }

    value(){
        let value = super.value();
        if(value && this.props.separator) {
            value=value.toString().replace(/\,/g, '');
        }
        //console.log(value);
        return value;
    }
};