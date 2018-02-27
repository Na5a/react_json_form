/**
 * Created by nasa on 3/1/16.
 */

import React, { Component } from 'react';
import classNames from 'classnames';

import BaseInput from './mask';

export default class rangeinput extends BaseInput{
    static defaultProps= {
        ...BaseInput.defaultProps,
        //type:'number',
        mask:'{{9999}}',
        range:[[0,100]]
    };
    componentDidMount(prevProps,prevState) {
        super.componentDidMount();
    }
    validate(){
        if(super.validate()) {
            let val = this.value();
            //console.log(this.props.name, val);
            if(val === '' || val === null || val === undefined) return true;
            for (let i in this.props.range) {
                let ys = this.props.range[i];
                if (ys[0] <= val && ys[1] >= val) {
                    return true;
                }
            }
        }
        return false;
    }
    render(){
        let el= super.render();
        return el;
    }
};