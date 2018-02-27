/**
 * Created by nasa on 3/1/16.
 */

import React, { Component } from 'react';
import classNames from 'classnames';

import BaseInput from './input';

export default class readonlyinput extends BaseInput{
    static defaultProps= {
        ...BaseInput.defaultProps,
        readOnly:true
    };

    handleChange(e){

    }

};