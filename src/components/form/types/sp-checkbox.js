/**
 * Created by nasa on 3/1/16.
 */
import React, { Component } from 'react';
import classNames from 'classnames';

import BaseInput from './checkbox';
//import Uniform from './uniform-checkbox';

export default class spCheckbox extends BaseInput{
    static defaultProps= {
        ...BaseInput.defaultProps,
        bootstrap_checkbox:false,
        handleCheckbox: null
    };

    render_input(){
        let name = this.props.name;
        //let id = this.props.id ? this.props.id : name+'_'+this.props.value;
        let checked = this.state.checked;
        let cprops = {};
        if(this.isCleanMode()){
            cprops = {
                onClick:this.handleOnClick.bind(this),
                onKeyUp:this.handleOnKeyUp.bind(this)
            };
        }

        return <span className={"sp-checkbox pull-left" + (checked?' checked':'')} {...cprops} ref="_target">
            <input type="checkbox" {...this.safeProps()} ref="checkbox" name={name} checked={checked} onChange={this.handleChange.bind(this)} />
        </span>;
    }

    toggleCheck(val) {
        this.state.checked = !val;
        this.refs.checkbox.checked = !val;
        this.handleChange(this.refs.checkbox);
    }

    handleChange(e) {
        super.handleChange(e);
        if( this.props.handleCheckbox ) {
            this.props.handleCheckbox(e);
        }
    }

    render(){
        let name = this.props.name;
        let id = this.props.id ? this.props.id : name+'_'+this.props.value;
        let className = classNames(this.props.className,{
            ['checkbox']: false,
            ['cursor-pointer']: true,
            ['control-label']: true,
            ['sp-checkbox-container']: true
        });
        if(this.isCleanMode()){
            return this.render_input();
        }
        return this.renderElement(
            <div className={className} key={id} tabIndex={this.props.tabIndex} onClick={this.handleOnClick.bind(this)} onKeyUp={this.handleOnKeyUp.bind(this)}>
                {this.render_input()}
                <span >{this.props.label}</span>
            </div>
            ,false);
    }
};