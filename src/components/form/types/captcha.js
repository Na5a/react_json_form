/**
 * Created by nasa on 3/1/16.
 */

import React, { Component } from 'react';
import classNames from 'classnames';

import BaseInput from './input';
import Icon from './../../../components/Icon';
import * as config from './../../../../config';

export default class captchainput extends BaseInput{
    static defaultProps= {
        ...BaseInput.defaultProps,
        rules:{required:true},
        img_props:{
            style:{minWidth:70,maxHeight:30}
        },
        url: config.api_call('captcha.jpg'),
        reloadable: true
    };
    constructor (props) {
        super(props);

        this.state['url'] = props.url;
    }

    reloadCaptcha(e){
        if(!this.props.reloadable) return;
        this.setState({url: this.props.url+'?'+(new Date()).getTime()});
    }
    handleReloadClick(e){
        if(e && e.preventDefault) e.preventDefault();

        this.reloadCaptcha();
        this.focus();
    }
    render(){
        let props = {...this.props};
        //props.icon = '';
        if(!props.mode) props.mode = 'password';
        let inputGroupClassName = 'input-group';
        return this.renderElement(
            <div className={inputGroupClassName}>
                {this.props.reloadable && <span className="input-group-addon" onClick={this.handleReloadClick.bind(this)}>
                    <Icon icon="refresh"/>
                </span>|| ''}
                {this.state.url && <span className="input-group-addon no-padding text-center" onClick={this.handleReloadClick.bind(this)}>
                    <img src={this.state.url} alt="loading" {...this.props.img_props} />
                </span>|| ''}
                {this.render_input()}
            </div>
        ,true,true);
    }
};