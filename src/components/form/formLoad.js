
/**
 * Created by nasa on 2/20/16.
 */

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import ajaxComponent from './../../Ajax';
import * as types from './types/';

export default class formLoadComponent extends ajaxComponent {
    static defaultProps={
        url: null,
        data: {}
    };

    componentDidMount() {
        super.componentDidMount();
    }

    componentDidUpdate(new_state,new_props) {
        //console.log('componentDidUpdate',new_state,new_props);
    }

    constructor(props) {
        super(props);
        this.state = {form:null};
    };

    loadform(){
        if(this.props.url){
            this.load(this.props.url,null,{data:this.props.data}).then(d=>{
                if(d.form){
                    this.setState({'form':d.form});
                }
            });
        }
    }


    render(){
        this.loadform();

        return this.state.form && <Form {...this.state.form} /> || null;
    }
}
