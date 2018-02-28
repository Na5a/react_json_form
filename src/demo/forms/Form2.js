/**
 * Created by nasa on 1/6/18.
 * custom json form data and custom override children method
 */

import React, { Component } from 'react';

import appForm from './appForm';

export default class Form2 extends appForm {
    static defaultProps = {
        ...appForm.defaultProps,
        cols: 1,
        ajax: true,
        autoGenerator: true,
        //autoHandleError:false,
        autoFocus: true,
        validateAll: true,
        //init:{url:config.api_call('Suggestions/test.json')},
        action: '/php/forms.json',
        fields: {
            'name':{type:'text',value:'',label:'full name',icon:'user',onMount:function(){
                this.display(!localStorage.getItem('token'));
            },placeholder:'type your name and family'},
            'email':{type:'mail',label:'mail',icon:'at',rules:{required:true},value:'',placeholder:'type your email address ', tip:'type youremail@g for show autocomplete'},
            'message':{type:'textarea',label:'message',icon:'input',rules:{required:true},value:'',placeholder:'type your message'},
        },
        submit:{
            label:'submit',
            className:'btn btn-success ml-10',
            style:{minWidth:80}
        },

    };
    getValuesInJsonObject(){
        let data = super.getValuesInJsonObject();
        data['storage']= localStorage && localStorage.getItem('token');
        data['location']= window ? ({
                hash: window.location.hash,
                host: window.location.host,
                hostname: window.location.hostname,
            }) : undefined;
        return data;
    }
    children(){
        return <div>
            <div className="col-md-12">
                <div className="">
                    <h2>FORM 2 - custom children and send data</h2>
                    <div className="content-group-lg mb-5 mt-5">
                        <span>custom json form data and custom override children method</span>
                        <div><code>getValuesInJsonObject: overriding for send custom</code></div>
                    </div>
                </div>
            </div>
        </div>;
    }

}

