/**
 * Created by nasa on 3/1/16.
 */
import $  from 'jquery';

import React, { Component } from 'react';
import classNames from 'classnames';

import BaseInput from './input';
import select from './select';

export default class select2 extends select{
    static defaultProps= {
        ...select.defaultProps,
        className:'selectpicker',
        picker:{
            style:'btn-default',
            size: 4,
            liveSearch:true,
            noneSelectedText: 'Nothing selected',
            selectOnTab: true,
            title: null
        }
    };
    componentDidUpdate(prevProps,prevState) {
        var self = this;
        super.componentDidUpdate(prevProps,prevState);

        $(this.refs.select2).selectpicker({...this.props.picker}).selectpicker('refresh').off('change').on('change',function(e){
            self.handleChange.call(self,e);
        });

    }

    render(){
        let {options} = this.state;
        let props = {...this.props};
        props.options = undefined;

        return this.renderElement(
          <select {...this.safeProps(props)} ref="select2" onChange={this.handleChange.bind(this)} value={this.value()}>
            {Object.keys(options).map((k)=>{
                let option = options[k];
                if(!option.value) option.value = k;
                //option.selected = option.value == this.value();
                return (
                    <option key={k} {...this.safeProps(option)}>{option.label}</option>
                )
            })}
          </select>
        );
    }
};