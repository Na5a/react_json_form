/**
 * Created by nasa on 3/1/16.
 */

import React, { Component } from 'react';
import classNames from 'classnames';

import BaseInput from './input';

export default class textarea extends BaseInput{
    static defaultProps= {
        ...BaseInput.defaultProps,
        submitByEnter:false,
        autoHeight:false,   //auto content height
    };
    _handleChange(e){
        if(this.props.autoHeight){
            this.refs._input.style.resize  = "none";
            this.refs._input.style.height = "1px";
            this.refs._input.style.height = 15+ this.refs._input.scrollHeight + "px";
        }

        this.handleChange(e);
    }
    render_input(){
        let props = this.safeProps();
        if(this.props.autoHeight) {
            if(!props.style) props.style = {};
            props.style.resize = "none";
        }
        return <textarea {...props} ref="_input" value={this.state.value} onChange={this._handleChange.bind(this)}  onClick={this.handleClick.bind(this)} onBlur={this.handleBlur.bind(this)} onFocus={this.handleFocus.bind(this)} ></textarea>
    }

};