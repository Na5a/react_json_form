/**
 * Created by nasa on 3/1/16.
 */

import React, { Component } from 'react';
import classNames from 'classnames';

import BaseInput from './input';

export default class maskinput extends BaseInput{
    static defaultProps= {
        ...BaseInput.defaultProps,
        mask:'',
        persistent:''
    };
    patterns = {
        'date':'{{99}}/{{99}}/{{9999}}',
        'credit-card':'{{9999}} - {{9999}} - {{9999}} - {{9999}}',
        'phone':'({{999}}) {{999}} {{9999}}',
        'mobile':'{{9999}} {{999}} {{9999}}',
        'phone-ext':'({{999}}) {{999}} - {{9999}} / {{a999}}',
        'currency':'${{999}}.{{99}}',
        'international-phone':'+3{{9}} {{999}} {{999}} {{999}}',
        'ssn':'{{999}} - {{99}} - {{9999}}',
        'isbn':'{{999}} - {{99}} - {{999}} - {{9999}} - {{9}}',
        'persistent':'+3 ({{999}}) {{999}} - {{99}} - {{99}}',
        'national-code':'{{999}} - {{999999}} - {{9}}',
        'number5':'{{99999}}',
        'number4':'{{9999}}',
        'number3':'{{999}}',
        'zip-code':'{{99999}} - {{99999}}',
    };

    constructor (props) {
        super(props);
        this.state['mask'] = props.mask;
        this.state['persistent'] = props.persistent;
    }

    componentDidUpdate(prevProps,prevState) {
        super.componentDidUpdate(prevProps,prevState);
    }

    componentDidMount() {
        super.componentDidMount();
        var self = this;
        let pattern = this.state.mask;
        if(typeof this.patterns[pattern] != 'undefined'){
            pattern = this.patterns[pattern];
        }

        if(window.jQuery.fn.formatter){
            window.jQuery.fn.formatter.addInptType('9', /[0-9۰-۹]/);
            window.jQuery.fn.formatter.addInptType('h', /[A-Fa-f0-9]/);
        }

        window.jQuery(this.refs._input).formatter({
            pattern: pattern,
            persistent: this.state.persistent
        }).on('keyup change',function(e){
            let val = this.value.toString();
            val = (val);
            if(self.props.mask == 'mobile'){
                if(val && val.charAt(0)!='0'){
                    val = '0'+val;
                }
            }
            self.handleChange(val);
            //self.props.onChange.call(self,self.value(),this.value);
            //self.setValue(this.value);
        });
        /*if(this.state.mask!='date') setTimeout(()=>{
            self.handleChange($(this.refs._input).formatter().resetPattern().val());
        },1);*/
    }
    setValue(val){
        super.setValue(val);
    }

    value(){
        let value = super.value();
        if(value) {
            switch (this.props.mask) {
                case 'mobile':
                    value=value.toString().replace(/\ |\-/g, '');
                    if(value.charAt(0)!='0'){
                        value = '0'+value;
                    }
                    return value;
                case 'phone':
                    return value.toString().replace(/\ |\-/g, '');
                case 'national-code':
                    return value.toString().replace(/\ |\-/g, '');
                case 'zip-code':
                    return value.toString().replace(/\ |\-/g, '');
            }
        }
        //console.log(value);
        return value;
    }

    render(){
        let el= super.render();
        return el;
    }
};