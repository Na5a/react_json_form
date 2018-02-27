/**
 * Created by nasa on 6/12/16.
 * show multi-form step by step
 */

import React, { Component } from 'react';
import classNames from 'classnames';

import appComponent from './../app/appComponent';
import Form from './';

export default class formsStepComponent extends appComponent {

    static defaultProps = {
        forms: [],
        step: 0,
        submitByStep: true,
        data: {},
    };

    constructor(props) {
        super(props);
        this.state.step = props.step;
        this.state.data = props.data;
    };
    mergeData(data){
        data = {...this.getData(),...data};
        this.setData(data);
    }
    setData(data){
        this.setState({data:data});
    }
    getData(data){
        return this.state.data;
    }
    setStep(stp){
        this.setState({step:stp});
    }
    getStep(){
        return this.state.step;
    }
    isEndStep(){
        return typeof this.props.forms[this.getStep()+1] == 'undefined';
    }
    gotoStep(indx){
        if(this.props.forms[indx]){
            this.setStep(indx);
            return true;
        }
    }
    gotoNextStep(){
        let stp = this.getStep();
        return this.gotoStep(stp+1);
    }
    gotoPrevStep(){
        let stp = this.getStep();
        return this.gotoStep(stp-1);
    }

    getForm(){
        let stp = this.getStep();
        if(this.props.forms[stp]){
            return this.props.forms[stp];
        }
        return false;
    }
    form_handleSendRequest(e){
        let form_step = this.props._p;

        if(form_step.props.submitByStep || this.isEndStep()){
            super.handleSendRequest(e);
        }else{
            form_step.form_then.call(this,this.values());
        }
    }
    form_handleSubmit(e){
        return super.handleSubmit(e);
    }
    form_then(data){
        let form_step = this.props._p;
        form_step.mergeData(data);
        this.gotoNextStep();
    }
    render_step(){
        let form = {...this.getForm()};
        form.handleSubmit = this.form_handleSubmit;
        form.handleSendRequest = this.form_handleSendRequest;
        form.then = this.form_then;
        form.data = {...form.data,...this.getData()};

        return <Form {...form} ref="_form" _p={this} />
    }
    render(){

    }
}
