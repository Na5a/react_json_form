/**
 * Created by nasa on 3/1/16.
 */

import React, { Component } from 'react';
import classNames from 'classnames';

import BaseInput from './input';
import Icon from './../../../components/Icon';

export default class passwordinput extends BaseInput{
    static defaultProps= {
        ...BaseInput.defaultProps,
        rules:{required:true},
        eye: true
    };
    constructor (props) {
        super(props);
        this.state = {...this.state,
            eye:props.eye,
            eye_icon:'eye'
        };
    }

    handleEyeClick(e){
        if(this.refs._input.type == 'password'){
            this.refs._input.type = 'text';
            this.setState({eye_icon:'eye-slash'})
        }else{
            this.refs._input.type = 'password';
            this.setState({eye_icon:'eye'})
        }
    }
    render(){
        let props = {...this.props};
        //props.icon = '';
        if(!props.mode) props.mode = 'password';
        let inputGroupClassName = this.state.eye ? 'input-group' : '';
        return this.renderElement(
            <div className={inputGroupClassName}>
                {this.state.eye && <span className="input-group-addon " onClick={this.handleEyeClick.bind(this)}>
                    <Icon icon={this.state.eye_icon} /></span>
                || ''}
                {/*<input {...props} type={props.mode} value={this.state.value} ref="_input"
                   onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)} />*/}
                {this.render_input()}
            </div>
        ,true,true);
    }
};