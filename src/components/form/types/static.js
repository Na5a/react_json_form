/**
 * Created by nasa on 3/1/16.
 */

import React, { Component } from 'react';
import classNames from 'classnames';

import BaseInput from './input';

export default class staticinput extends BaseInput{
    static defaultProps= {
        ...BaseInput.defaultProps
    };
    constructor (props) {
        super(props);
    }
    setValue(val){
        super.setValue('');
    }
    value(){
        return '';
    }
    render_input(){
        return <span {...this.safeProps(this.props)}>{this.props.label}</span>;
    }
};