/**
 * Created by nasa on 3/1/16.
 */
import React, { Component } from 'react';
import classNames from 'classnames';

import BaseInput from './input';
//import Uniform from './uniform-radio';

export default class radio extends BaseInput{
    static defaultProps= {
        ...BaseInput.defaultProps,
        className: 'radio-primary',
        validateOnChange: true,
    };
    handleOnClick(v,e){
        //console.log(v,e);
        //this.setValue(v);
        this.handleChange(v);
    }
    handleOnKeyUp(v,e){
        if(e.preventDefault) e.preventDefault();
        if(e && (e.keyCode == 13 || e.keyCode == 32)){
            this.handleOnClick(v);
        }
    }
    render_(){
        //return <Uniform {...this.props}/>;
    }
    render_tip(){
        return null;
    }
    render_label(){
        let label = <span>{this.props.label}
            {this.props.tip && <span className="font-85p text-muted ml-5">{this.props.tip}</span>|| null}
        </span>;

        return super.render_label(label);
    }
    render(){
        //console.log(this.state);
        let {options} = this.props;
        let name = this.props.name;

        return this.renderElement(
            <div>
            {Object.keys(options).map((k)=>{
                let option = options[k];
                let checked = option.value == this.value();
                let id = option.id ? option.id : name+'_'+option.value;
                if(!option.className) option.className = this.props.className;
                let className = classNames(option.className,{
                    ['radio']: true
                });
                //console.log(id,checked);
                let input=<input type="radio" {...this.safeProps(option)} name={name} checked={checked} onChange={this.handleChange.bind(this)} />;
                if(this.isCleanMode()){
                    return input
                }
                return (
                    <div className={className} key={name+option.value} tabIndex={this.props.tabIndex}>
                        {input}
                        <label htmlFor={id} onClick={this.handleOnClick.bind(this,option.value)}>{option.label}</label>
                    </div>
                );
                /*return (
                  <div className="radio">
                    <label key={name+option.value} >
                        <input type="radio"{...option} name={name} selected={selected} onChange={this.handleChange.bind(this)} />
                        {option.label}
                    </label>
                  </div>
                );*/
            })}
            </div>
        );
    }
};