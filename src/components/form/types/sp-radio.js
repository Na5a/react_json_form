/**
 * Created by nasa on 3/1/16.
 */
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import BaseInput from './radio';

export default class radio extends BaseInput{
    static defaultProps= {
        ...BaseInput.defaultProps,
    };

    render_input(){
        let {options} = this.props;
        let name = this.props.name;
        let value = this.value();
        if(!options || typeof options=='undefined'){
            options = [{label:this.props.label, value:this.props.value}];
            value = '';
        }
        return (
            <div ref='group'>
                {Object.keys(options).map((k)=>{
                    let option = options[k];
                    let checked = option.value == value;
                    let id = option.id ? option.id : name+'_'+option.value;
                    if(!option.className) option.className = this.props.className;
                    let className = classNames(this.props.className,{
                        ['radio']: false,
                        ['sp-radio-container']: true,
                        ['isChecked']: checked
                    });
                    //console.log(id,checked);htmlFor_={id}
                    return (
                        <div className={className} key={name+option.value} onClick={this.handleOnClick.bind(this,option.value)} tabIndex={this.props.tabIndex} onKeyUp={this.handleOnKeyUp.bind(this,option.value)}>
                            <span className={"sp-radio pull-left"+(checked?' checked':'')}>
                                <input type="radio" {...this.safeProps(option)} name={name} checked={checked} ref='input' onChange={this.handleChange.bind(this)} />
                            </span>
                            <span>{option.label}</span>
                        </div>
                    );
                })}
            </div>
        );
    }
    render(){
        if(this.isCleanMode()){
            return this.render_input();
        }

        return this.renderElement(this.render_input());
    }};