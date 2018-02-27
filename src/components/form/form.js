/**
 * Created by nasa on 2/20/16.
 */

import React, { Component } from 'react';
import jQuery from 'jquery';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as types from './types/';
import ajaxComponent from './../../components/app/ajaxComponent';
import Alert from './../../components/Alert';
import Spinner from './../../components/Spinner';
import ajax from './../../utils/ajax';
import Translator from  './../../components/Translator';

export default class formComponent extends ajaxComponent {
    _form = false;
    _refs = {};
    _last_error_list = [];
    _debug = 0;
    static defaultProps={
        cache_form:true,
        result : {},
        fields : {},
        autoGenerator:true,
        autoFocus:true,
        autoScroll:false,
        validateAll:true,
        autoHandleError:true,
        handleSubmit:undefined, // submit function
        toggleFormOnValid:true, //toggle Form On Success
        cols: 2,
        step:1, // multi step support with fields array, [future support]
        ajax: true,
        method:'post', // form method
        ajaxSetting:{cache:false,contentType:false,processData:false},
        data:{},
        sendAs:'json', // ajax from send data type FormData or json
        submit:{
            label:'submit',
            className:'btn btn-success ml-10'
        },
        reset:false/*{
            className:'btn btn-default ml-10',
            label:'reset'
        }*/,
        init:{},
        then: function(data){},
        catch: function(err){}
    };

    /*static propTypes = {
        fields: PropTypes.object.isRequired,
        data: PropTypes.object,
        cols: PropTypes.number
    };*/
    //fields = {};
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            submitted:false,
            show:true,
            sData:props.data,
            result:props.result
        };
        if(typeof props.children=='function') this.children = props.children.bind(this);
        if(typeof props.handleSubmit=='function') this.handleSubmit = props.handleSubmit.bind(this);
        if(typeof props.handleSendRequest=='function') this.handleSendRequest = props.handleSendRequest.bind(this);
        if(typeof props.loading=='function') this.loading = props.loading.bind(this);
    };
    /*componentWillMount(){
        //console.log('componentWillMount',++this._debug);
    }
    componentWillUpdate(){
        //console.log('componentWillUpdate',++this._debug);
    }
    componentWillUnmount(){
        //console.log('componentWillUnmount',++this._debug);
    }*/
    componentDidUpdate(new_state,new_props) {
        if (super.componentDidUpdate) super.componentDidUpdate(new_state, new_props);
        //console.log(this.props.autoScroll , this.props.autoHandleError);
    }
    /*shouldComponentUpdate(nextProps, nextState) {
         if(super.shouldComponentUpdate) super.shouldComponentUpdate(nextProps, nextState) ;

        console.log(this.props.fields == nextProps.fields && this.props.data == nextProps.data);
         if(this.props.fields == nextProps.fields && this.props.data == nextProps.data){
            return false;
         }
         this.forceUpdate();

         return true;
    }*/


    componentDidMount() {
        super.componentDidMount();
        //console.log('componentDidMount',++this._debug);
        //console.log(this.values());
        if(typeof this.props.init == 'function') {
            this.props.init.call(this,this._refs);
        }else if(this.props.init.url){
            this.loading();
            //let ajOpt = {url:this.props.init.url,...this.props.init};
            ajax.add(this.props.init).then(data=>{
                if(data.result){
                    if(typeof this.props.init.transformResult == 'function'){
                        data.result = this.props.init.transformResult.call(this,data.result);
                    }
                    Object.keys(data.result).map((k)=>{
                        let o = data.result[k];
                        if(this._refs[k]){
                            this._refs[k].setValue(o);
                        }
                    });
                }
                this.loading(false);
            },(err)=>{
                //throw new Error('Could not find user: ' + username);\
                this.loading(false);
            });
        }else if(typeof this.props.init == 'object'){
            Object.keys(this.props.init).map((k)=>{
                let o = this.props.init[k];
                if(this._refs[k]){
                    this._refs[k].setValue(o);
                }
            });
        }
        if(this.props.autoFocus){
            this.focusFirstVisibleInput();
            setTimeout(()=>{this.focusFirstVisibleInput()},200);
        }
    }
    _get(element_name){
        return this._refs[element_name];
    }

    focusFirstVisibleInput(){
        if(this.refs._form) {
            jQuery(this.refs._form).find('input,textarea,select').filter(':visible:first').focus();
        }
    }
    scrollToFirstError(){
        if(this.refs._form && this.result().error==1) {
            let $el = jQuery(this.refs._form).find('.has-error:first');
            if (!$el || $el.length <= 0) $el = jQuery(this.refs._form);
            //console.log($el,$el.offset());
            if ($el) {
                let top = $el.offset().top;
                top = top - ($el.height() * 2);
                if (top < 0) top = 0;
                jQuery('html, body').animate({scrollTop: top});
            }
        }
    }

    loading(is=true){
        this.setState({
            loading:is
        });
    }
    submitted(is=true){
        this.setState({
            submitted:is
        });
    }
    setResult(res){
        this.setState({
            result:res
        });
    }
    result(){
        return this.state.result;
    }
    values(){
        /*let data = {};
        for(let field in this.props.fields){
            if(typeof this._refs[field] !== "undefined"){
                data[field]=this._refs[field].value();
            }
        }*/
        return this.getValuesInJsonObject();
    }
    last_error_list(){
        return this._last_error_list;
    }
    validate(){
        var validated = true;
        validated = this.before_validate(validated);
        //console.log(this.props.fields,this._refs);
        if(validated) {
            let errs = 0;
            this._last_error_list = [];
            for (let field in this.props.fields) {
                if (typeof this._refs[field] !== "undefined") {
                    //console.log('validate',field,this._refs[field].doValidate());
                    let v = this._refs[field].doValidate();
                    if (!v) {
                        this._last_error_list.push(field);
                        errs++;
                        //console.log(errs,field);
                        //if(this.props.autoFocus && errs == 1) ReactDOM.findDOMNode(this._refs[field]).focus();
                        if (this.props.autoFocus && errs == 1) this._refs[field].focus();
                        if (!this.props.validateAll) return false;
                    }
                    validated = v && validated;
                }
            }
            validated = this.after_validate(validated);
        }
        //console.log(this._last_error_list);
        return validated;
    }
    before_validate(validated){
        return validated;
    }
    after_validate(validated){
        return validated;
    }
    render_field(field,name=null,ref=undefined){
        if(name) field.name = name;
        if(!ref) ref = (c)=>this._refs[field.name]=c;
        //console.log('types,field.type',types,field.type);

        if(typeof types[field.type]== "undefined") field.type = 'input';

        let XEelement = types[field.type];
        let el = <XEelement {...field} ref={ref} form={this} />;
        //let el = React.createElement(XEelement,{...field,form:this});
        //let el = new XEelement({...field,form:this});
        //this._refs[field.name] = el;
        //console.log(el);
        //this.refs['test'] = el;
        return el;
    }
    getValuesInFormData(){
        let data = new FormData();
        let propsData = this.getData();
        if(propsData){
            for(let k in propsData){
                data.append(k,propsData[k]);
            }
        }
        for(let field in this.props.fields){
            if(typeof this._refs[field] !== "undefined"){
                data.append(field,this._refs[field].value());
            }
        }
        return data;
    }
    getValuesInJsonObject(){
        let data = this.getData();
        for(let field in this.props.fields){
            if(typeof this._refs[field] !== "undefined" && this._refs[field]){
                data[field]=this._refs[field].value();
            }
        }
        return data;
    }

    getData() {
        return {...this.state.sData};
    }
    setData(data) {
        this.state.sData=data;
    }

    handleSendRequest(e){
        this._handleSendRequest(e);
    }
    _handleSendRequest(e){
        if(this.props.ajax){
            if(e && e.preventDefault) e.preventDefault();
            //console.log(this.isMounted());
            let data = (!! window.FormData && this.props.sendAs!='json') ? this.getValuesInFormData() : this.getValuesInJsonObject();
            let ajaxSetting= this.props.ajaxSetting;
            if(this.props.sendAs == 'json'){
                ajaxSetting.contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
                ajaxSetting.dataType = this.props.sendAs;
                ajaxSetting.processData = true;
            }
            //console.log(data,this.props.action);
            //this.loading();
            let ajOpt = {url:this.props.action,data:data,...ajaxSetting};
            ajax.add(ajOpt).then(data=>{
                this.submitted();
                this.setResult(data.result);
                if(data.result && data.result.errors){
                    let errs = 0;
                    for(let f in data.result.errors){
                        let v = data.result.errors[f];
                        if(typeof this._refs[f]!=='undefined'){
                            errs++;
                            this._refs[f].setValidate(false);
                            this._refs[f].setValidateMsg(v);
                            if(this.props.autoFocus && errs == 1) this._refs[f].focus();
                        }
                    }
                    //console.log(this.props.autoScroll , this.props.autoHandleError)
                    if (this.props.autoScroll && this.props.autoHandleError) {
                        this.scrollToFirstError();
                    }

                }
                /*setTimeout(function() {
                 console.log('updating state twice...');
                 this.submitted();
                 this.setResult(data.json);
                 }.bind(this), 3000);*/
                if(data.result && !data.result.error && this.props.toggleFormOnValid) this.setState({show:false});
                this.loading(false);
                this.props.then.call(this,data);
            },err=>{
                //this.setResult(err);
                this.loading(false);
                this.props.catch.call(this,err);
            });
            return false;
        }
    }
    handleSubmit(e){
        this._handleSubmit(e);
    }
    _handleSubmit(e){
        //console.log(this.validate());
        if(!this.validate()){
            if(e && e.preventDefault) e.preventDefault();
            return false;
        }
        this.loading();
        this.handleSendRequest(e);
    }
    render_cols(fields,cols=null){
        if(cols){
            let col_classname = "col-md-"+cols;
            return (
                <div key={Math.random()}>
                    {fields.map((key)=>{
                        let field=this.props.fields[key];
                        //if(typeof field=='undefined') field = fields[key];
                        //console.log(key,field instanceof Array);
                        if (field instanceof Array) {
                            this.render_cols(field,field.length);
                        }else if(field instanceof Object){
                            return <div className={col_classname} key={key}>
                                {this.render_field(field, key)}
                            </div>;
                        }
                    })}
                    <div className="clear"></div>
                </div>
            );
        }else {
            return fields.map((key)=>
                this.render_field(this.props.fields[key],key)
            );
        }
    }
    render_step(step){
        let pfields = typeof this.props.fields == 'array' ? this.props.fields : [this.props.fields];
        if(typeof pfields[step] !== 'undefined'){
            let fields = pfields[step];
            let fields_keys = Object.keys(fields);
            let cols = this.props.cols ? 12 / this.props.cols : 0;
            let count = 0;
            let chunks = [];
            let chunk_size = this.props.cols;//Math.ceil(fields_keys.length / this.props.cols);
            //console.log('chunk_size',chunk_size);
            while (fields_keys.length > 0){
                chunks.push(fields_keys.splice(0, chunk_size));
            }
            let className = 'step_'+(step+1);
            return(
                <div className={className} ref="step[]" key={step} >
                    {chunks.map((keys)=>{
                        /*return (
                         <bs.Col md={cols}>
                         {this.render_cols(keys)}
                         </bs.Col>
                         )*/
                        return this.render_cols(keys,cols);
                    })}
                </div>
            );
        }
        return null;
    }
    submit(e){
        this.handleSubmit(e);
    }
    reset(){
        this._form = false;
    }
    children(){
        return false;
    }
    children_hide(){
        return null;
    }
    init(){
        /*let fields = typeof this.props.fields == 'array' ?
                typeof this.props.fields[this.props.page-1] == 'object'
                    ? {...this.props.fields[this.props.page-1]}
                    : {}
            : {...this.props.fields};*/
        let fields = typeof this.props.fields == 'array' ? this.props.fields : [this.props.fields];
        let props = {...this.props};
        props.cols = props.fields = undefined;
        //let handleSubmit = this.handleSubmit;//this.props.handleSubmit ? this.props.handleSubmit : this.handleSubmit;
        let children = this.children();
        let className = classNames(this.props.className,{
            ['this']: false
        });

        //console.log('chunks',fields_keys.length,cols,chunk_size,chunks);
        //let XEelement = eval('NavbarTopItemsList.DropdownTypeDumb.'+this.props.type);
        return(
            <Spinner loading={this.state.loading}>
                <form {...this.safeProps(props)} ref="_form" className={className} onSubmit={this.handleSubmit.bind(this)}>
                    {children || ''}
                    {this.props.children}
                    {this.props.autoGenerator && fields.map((val,key)=>{
                        /*return (
                         <bs.Col md={cols}>
                         {this.render_cols(keys)}
                         </bs.Col>
                         )*/
                        return this.render_step(key);
                    }) || ''}
                    {this.props.autoGenerator && <div><div className="clearfix"></div>
                        {this.props.submit && this.render_btn_submit() || null}
                        {this.props.reset && this.render_btn_reset() || null}
                    </div> || ''}
                </form>
            </Spinner>
        );
    }
    render_btn_submit(){
        return <button type="submit" {...this.props.submit}>
            <Translator>{this.props.submit.label}</Translator>
        </button>;
    }
    render_btn_reset(){
        return <button type="reset" {...this.props.reset}>{this.props.reset.label}</button>;
    }
    render_error(){
        //console.log(this.result());
        let res = this.result();
        if(res && res.msg){
            let alert;
            if(res.error){
                alert= <Alert type="danger" className="">{res.msg}</Alert>
            }else{
                alert= <Alert type="success" dismiss={false}>{res.msg}</Alert>;
                /*this.setState({
                    show:false
                });*/
            }
            return alert;
        }
        return null;
    }
    render(){
        if(!this._form || !this.props.cache_form){
            this._form = this.init();
        }

        return (
            <div ref='_container'><Spinner loading={this.state.loading}>
                {this.props.autoHandleError && this.render_error() || null}
                {this.state.show && this._form || this.children_hide()}
            </Spinner></div>
        );
    }
}
