/**
 * Created by nasa on 1/6/18.
 */

import React, { Component } from 'react';

import appForm from './appForm';

export default class Form1 extends appForm {
    static defaultProps= {
        ...appForm.defaultProps,
        ajaxSetting: {...appForm.defaultProps.ajaxSetting,retry:false},
        cols: 1,
        ajax: true,
        autoGenerator: true,
        //autoHandleError:false,
        autoFocus: true,
        validateAll: true,
        //handleSubmit:this.handleSubmit,
        action: '/users/login.json',
        fields: {
            //'username': {type:'mail',rules:{required:true,email:true},icon:'at',placeholder:i18n._('enter x',{x:i18n._('email')}),label:i18n._('email'),value:''},
            'username': {type:'login',label:'username',placeholder:'email or phone number',value:''},
            'password': {type:'password',mode:'password',rules:{required:true},icon:'key', placeholder:'password', label:'password',value:''}
        }
    };

}

