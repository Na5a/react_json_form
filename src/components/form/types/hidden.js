/**
 * Created by nasa on 5/28/16.
 */


import React, { Component } from 'react';
import classNames from 'classnames';

import BaseInput from './input';
import Icon from './../../../components/Icon';

export default class hiddeninput extends BaseInput{
    static defaultProps= {
        ...BaseInput.defaultProps,
        rules:{},
        mode: 'hidden',
        clear:true
    };
    constructor (props) {
        super(props);
    }

    render(){
        return <div style={{display:'none'}}>
            {this.render_input()}
        </div>;
    }
};