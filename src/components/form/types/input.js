/**
 * Created by nasa on 3/1/16.
 */
import React, { Component } from 'react';
import classNames from 'classnames';

//import * as bs from './../../bootsrap';
import Icon from './../../../components/Icon';
import validator from './../validator';
import Ajax from './../../../components/app/ajaxComponent';


//import form from './../formComponent';
//console.log(form);
export default class BaseInput extends Ajax{
    static defaultProps={
        value : '',
        //dir:'auto',
        iconText:null,
        icon:null,
        tabIndex:"0",
        autoComplete:"off",
        cleanMode:false,
        mode:'text',
        validate:true,
        rules: {},
        tip: '\u00a0',
        required: false,
        className: 'form-control',
        formgroup: null,
        validateOnChange: true,
        validateOnBlur: true,
        validateOnHide: false,
        floatingLabel: false,
        showLabel: true,
        show: true,
        submitByEnter: true,
        readonly: false,
        /*lifecycle methods override to use */
        onUpdate:function(prevProps,prevState){},
        onUpdating:function(prevProps,prevState){},
        onChange:function(old_value,new_value){},
        onValidating:function(){},
        onValidated:function(v){},
        onUnmount:function(){},
        onReceiveProps:function(nextProps){},
        onMount:function(){}
    };
    rules = {};
    constructor (props) {
        super(props);
        this.state = {
            value: props.value,
            validate:props.validate,
            readonly:(props.readOnly || props.readonly) ? true : false,
            //readonly:props.readonly ? true : false,
            validate_msg: '',
            show: props.show,
            cleanMode: props.cleanMode,
            tip: props.tip,
            loading:false,
            hasFocus:false
        };
        this.rules = props.rules;
        //this.props.onChange.bind(this);

        if(typeof props.handleFocus=='function') this.handleFocus=this.props.handleFocus.bind(this);
        if(typeof props.handleBlur=='function') this.handleBlur=this.props.handleBlur.bind(this);
        if(typeof props.handleChange=='function') this.handleChange=this.props.handleChange.bind(this);
        if(typeof props.handleClick=='function') this.handleClick=this.props.handleClick.bind(this);


        // render methods
        if(typeof props.render_invisible=='function') this.render_invisible=this.props.render_invisible.bind(this);
        if(typeof props.renderElement=='function') this.renderElement=this.props.renderElement.bind(this);
        if(typeof props.render_label=='function') this.render_label=this.props.render_label.bind(this);
        if(typeof props.render_tip=='function') this.render_tip=this.props.render_tip.bind(this);
        if(typeof props.render_tip_error=='function') this.render_tip_error=this.props.render_tip_error.bind(this);
        if(typeof props.render_input=='function') this.render_input=this.props.render_input.bind(this);
        if(typeof props.feedback_icon=='function') this.feedback_icon=this.props.feedback_icon.bind(this);
    }

    componentDidUpdate(prevProps,prevState) {
        //console.log(this);
        this.props.onUpdate.call(this,prevProps,prevState);
    }
    componentDidMount() {
        super.componentDidMount();
        //this.props.onUpdate.call(this,undefined,undefined);
        if(this.props.floatingLabel) this.floating_label();
        this.props.onMount.call(this);
    }
    componentWillMount(){
        this.props.onUpdating.call(this);
    }
    componentWillUpdate(nextProps,nextState){
        this.props.onUpdating.call(this,nextProps,nextState);
    }
    componentWillUnmount(){
        super.componentWillUnmount();
        this.props.onUnmount.call(this);
    }
    componentWillReceiveProps(nextProps) {
        this.props.onReceiveProps.call(this,nextProps);
    }

    safeProps(props){
        props = super.safeProps(props);
        if(typeof props.onKeyDown == 'function') props.onKeyDown = props.onKeyDown.bind(this);
        if(typeof props.onKeyUp == 'function') props.onKeyUp = props.onKeyUp.bind(this);

        return props;
    }

    form(){
        return this.props.form;
    }
    floating_label(){
        if(this.refs._group && this.refs._label){
            /*let _label = this.refs._label;
            let onClass = "on";
            let showClass = "is-visible";
            let $inp = jquery(this.refs._group).find('input:not(.token-input):not(.bootstrap-tagsinput > input), textarea, select').on("checkval change", function () {
                // Define label
                var label = $(_label);
                if (this.value !== "") {
                    label.addClass(showClass);
                }else{
                    label.removeClass(showClass).addClass('animate');
                }
            }).on("keyup", function () {
                $(this).trigger("checkval");
            }).trigger("checkval").trigger('change');*/
        }
    }

    ajaxCall(url,opts){
        return super.load(url,undefined,opts);
        //return $.ajaxQ(url,opts);
    }
    loading(is=true){
        this.setState({loading:is});
    }
    isLoading(){
        return this.state.loading;
    }
    isVisible(){
        return this.state.show == true;
    }
    isValidate(){
        return this.state.validate;
    }
    isCleanMode(){
        return this.state.cleanMode;
    }
    display(is=true){
        this.setState({show:is});
    }
    cleanMode(is=true){
        this.setState({cleanMode:is});
    }

    handleSubmitByEnter(e){
        if(this.props.submitByEnter){
            //console.log(e);
            if(e.keyCode == 13){
                e.preventDefault();
                if(this.form()) this.form().handleSubmit(e);
            }
        }
    }
    handleClick(e){

    }
    handleChange(e){
        const old = this.value();
        const target_value = (e && e.target ? e.target.value : e);
        this.setValue(target_value);
        /*this.setState({
            value: e.target.value
        });*/
        /*let v = this.validate();
        this.handleValidateChange(v);
        console.log(v);*/
        if(this.props.validateOnChange) setTimeout(()=>{this.doValidate()});
        //console.log(old,this.value(),e.target.value);
        this.props.onChange.call(this,old,target_value);
    }
    handleBlur(e){console.log('handleBlur');
        if(this.props.validateOnBlur) this.doValidate();
        this.setState({hasFocus:false});
    }
    handleFocus(e){console.log('handleFocus');
        this.setState({hasFocus:true});
    }
    handleValidateChange(v){
        /*this.setState({
            validate: e
        });*/
        this.setValidate(v);
        if(v) this.props.onValidated.call(this,v);
    }
    doValidate(){
        this.props.onValidating.call(this);
        let v = this.validate();
        this.setState({
            validate: v
        });
        this.handleValidateChange(v);
        //console.log(v);
        return v;
    }
    _validate(value){
        if(this.props.required && value) {
            return false;
        }else if(!this.isVisible() && !this.props.validateOnHide){
            return true;
        }else{
            for(let rule in this.rules){
                let p = this.rules[rule];
                if(typeof p === "boolean" && !p) continue;
                //console.log(validator.validate);
                if(!validator.validate.call(this,rule,value,p)){
                    return false;
                }
            }
        }
        return true;
    }
    validate(){
        return this._validate(this.value());
    }
    _value(){
        return this.state.value;
    }
    value(){
        let val = this.state.value;
        //if(val === null) val = undefined; // null is not valid value in react 15
        return val;
    }
    setValue(val){
        this.setState({
            value: val
        });
        this.state.value = val;
    }
    setTip(val){
        this.setTip({
            tip: val
        });
        this.state.tip = val;
    }
    setValidate(e){
        this.setState({
            validate: e
        });
    }
    setValidateMsg(msg){
        this.setState({
            validate_msg: msg
        });
    }
    setReadonly(is){
        this.setState({
            readonly: is
        });
    }
    isReadonly(){
        return this.state.readonly == true;
    }

    focus(){
        if(this.refs._input) this.refs._input.focus();
    }
    hasFocus(){
        return this.state.hasFocus;
    }
    isActiveElement(){
        return this.hasFocus() && document.activeElement == this.refs._input;
    }

    render_input(){
        let value = this.state.value;
        let extra = {};
        let props = {...this.props};
        /*if(typeof props['readonly'] != 'undefined')*/
        delete props['readonly'];
        delete props['readOnly'];
        //console.log(props['readonly']);
        if(this.isReadonly()){
            extra['readOnly'] = 'readOnly';
        }
        if(value===null) value = '';
        return <input onKeyUp={this.handleSubmitByEnter.bind(this)} {...this.safeProps(props)} type={this.props.mode} value={value} ref="_input" onChange={this.handleChange.bind(this)} onClick={this.handleClick.bind(this)} onBlur={this.handleBlur.bind(this)} onFocus={this.handleFocus.bind(this)} {...extra} />;
    }
    render(){
        /*let classname = classNames({
            ['form-group']: true,
            ['has-feedback']:true,
            ['has-error']: !this.state.validate
        });

        let cols = this.props.label ? {c1:4,c2:8} : {c1:0,c2:12};

        return(
            <div className={classname}>
                {this.props.label &&
                    <bs.Col md={cols.c1}><label className="control-label">{this.props.label}</label></bs.Col>
                || null}
                <bs.Col md={cols.c2}>
                    <input {...this.props} type={this.props.mode} value={this.state.value}
                        onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)} />
                    {!this.state.validate &&
                        <Icon icon='times' className="form-control-feedback" aria-hidden="true"></Icon>
                    || true}
                </bs.Col>
            </div>
        );*/
        if(this.isCleanMode()){
            return this.render_input();
        }
        return this.renderElement(this.render_input());
    }
    feedback_icon(){
        if(this.state.loading){
            //console.log('this.state.loading',this.state.loading);
            return (<div className="form-control-feedback"><Icon icon='circle-o-notch' className="spinner text-muted"/></div>);
        }
        if(this.props.icon){
            return (<div className="form-control-feedback"><Icon icon={this.props.icon} className="text-muted"/></div>);
        }else if(this.props.iconText){
            return (<div className="form-control-feedback"><span className="text-muted">{this.props.iconText}</span></div>);
        }
        if(!this.props.icon && !this.state.validate){
            return (<div className="form-control-feedback"><Icon icon='times'/></div>);
        }
        return (<i />);
    }
    render_tip(){
        let className = classNames({
            ['sp-input-tip']:true,
            ['hidden']: !this.hasFocus(),
        });
        return <div className={className}>
            <div className="sp-input-tip-text">
                {/*<Icon icon="exclamation-circle" />*/} {this.state.tip}
            </div>
        </div>
    }
    render_tip_error(){
        let className = classNames({
            ['sp-input-tip']:true,
            ['sp-input-tip-top-caret']:true,
        });
        return <div className={className}>
            <div className="sp-input-tip-text sp-input-tip-danger">
                {/*<Icon icon="exclamation-triangle" />*/} {this.state.validate_msg}
            </div>
        </div>
    }
    render_label(label){
        //let show_tip = this.state.tip && this.state.tip != '\u00a0';// && this.state.validate;
        if(typeof label == 'undefined') label = this.props.label;
        let labelClassName = classNames({
            ['is-visible']:!!this.state.value,
            ['animate']:true,
            ['control-label']:true,
            //['full-width']:show_tip
        });
        return <label ref="_label" className={labelClassName}>
            {label}
            {/*show_tip && this.render_tip() || null*/}
        </label>
    }
    render_invisible(el,label=true,icon=true,tip=true){
        return false;
    }
    renderElement(el,label=true,icon=true,tip=true){
        let classname = classNames({
            //['form-group']: true,
            //['has-feedback']:true,
            ['has-error']: !this.state.validate,
            ['has-success']: this.state.validate===true && this.state.value !='',
            ['is-loading']: this.state.loading,
            ['form-group-material']: this.props.floatingLabel
        });

        //console.log('show_tip',tip);
        let show_label = this.props.label && this.props.showLabel && label;
        let show_tip = tip && this.state.tip && this.state.tip != '\u00a0';
        let cols = show_label ? {c1:4,c2:8} : {c1:0,c2:12};
        let style = {};
        if(!this.isVisible()) style['display']='none';

        return(
            !this.isVisible() && this.render_invisible() || <div className={classname} ref="_group" style={style}>
                {show_label && this.render_label() || null}
                {show_tip && this.render_tip() || null}
                <div className='col-md-12 no-padding has-feedback form-group'>
                    {el}
                    {icon && this.feedback_icon() || ''}
                    {!this.state.validate && this.render_tip_error() || null}

                    {/*!this.state.validate
                    && <label className="control-label valdation-error-label" htmlfor={this.props.id}>{this.state.validate_msg}</label>
                    || <label className="control-label" htmlfor={this.props.id}>&nbsp;</label>*/}

                    {/*<label className="control-label" htmlfor={this.props.id}>{this.state.tip}</label>*/}
                    <div className="clearfix" ></div>
                </div>
            </div>
        );
    }
};
