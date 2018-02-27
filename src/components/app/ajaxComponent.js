/**
 * Created by nasa on 2/20/16.
 */

import React, { Component, PropTypes,cloneElement } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import appComponent from './appComponent';
import ajax from '../../utils/ajax';


export default class ajaxComponent extends appComponent {
    //static _tkn = '';

    ajaxhandler = null;

    constructor(props) {
        super(props);
        //ajaxComponent._tkn = localStorage.getItem('_tkn');
        //console.log(localStorage);
        this.state = {
            loading: false
        }
    };

    loading(loading=true){
        this.setState({loading});
    }
    isLoading(){
        return this.state.loading;
    }

    load(url,callback,options={}){
        if(typeof options.dataType == 'undefined') options.dataType = 'json';
        if(typeof options.method == 'undefined') options.method = 'post';
        if(typeof options.data == 'undefined') options.data = {};
        if(url) options.url = url;
        if(callback) options.callback = callback;



        return this.ajaxhandler;
    };
    abort(){
        if(this.ajaxhandler) {
            try {
                this.ajax().abort();
            } catch (e) {

            }
            delete this.ajaxhandler;
        }
    }
    ajax(){
        return this.ajaxhandler;
    }
}