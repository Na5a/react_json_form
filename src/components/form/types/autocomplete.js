/**
 * Created by nasa on 3/1/16.
 *
 */

import React, { Component } from 'react';
import classNames from 'classnames';

import ajax from './../../../utils/ajax';
import BaseInput from './input';

/**
 * react autocomplete
 * base on https://github.com/devbridge/jQuery-Autocomplete
**/
const $ = window.jQuery;

export default class Autocomplete extends BaseInput{
    //_cache = {};
    static defaultProps= {
        ...BaseInput.defaultProps,
        limit:5,
        minChars:2,
        autoSelectFirst:true,
        floatingLabel:false,
        options:undefined,
        ajax:undefined,
        cache:false,
        spaceLookup:true,
        noSuggestionNotice:false, // set Text or htmlString or Element or false for disable
        renderItem:undefined,
        renderLogo:false,   // show item logo or image in list
    };
    constructor (props) {
        super(props);
        this.state = {...this.state,
            options:props.options
        };

        if(typeof props.onSelect =='function') this.onSelect = props.onSelect.bind(this); //conflict with JS onSelect event
        if(typeof props.onSelected =='function') this.onSelected = props.onSelected.bind(this);
        if(typeof props.onSearchStart =='function') this.onSearchStart = props.onSearchStart.bind(this);
        if(typeof props.onSearchComplete =='function') this.onSearchComplete = props.onSearchComplete.bind(this);
        if(typeof props.renderItem =='function') this.renderItem = props.renderItem.bind(this);
        if(typeof props.normalize =='function') this.normalize = props.normalize.bind(this);
        if(typeof props.normalizeOption =='function') this.normalizeOption = props.normalizeOption.bind(this);
        if(typeof props.transformResult =='function') this.transformResult = props.transformResult.bind(this);
    }
    normalizeOption(itm){
        return {...itm, data: itm.data || itm.value, value: itm.label};
    }
    normalize(options){
        var result;
        if(options instanceof Array) {
            result = $.map(options, (itm) => {
                return this.normalizeOption(itm);
            });
        }
        return result;
    }
    transformResult(response) {
        return {
            suggestions: $.map(response.result, (itm)=> {
                return this.normalizeOption(itm);
            })
        };
    }

    onSelect(suggest){
        this.onSelected(suggest);
    }
    onSelected(suggest){

    }
    onSearchStart(query){

    }
    onSearchComplete(query, suggestions){

    }

    renderItem(value, item) {
        if(this.props.renderLogo){
            let src;// = item.logo || item.image ;
            if(typeof this.props.renderLogo=="string"){
                src=item[this.props.renderLogo];
            }else{
                src= item.logo || item.image;
            }
            //if(!src && typeof this.props.renderLogo=="string") src=item[this.props.renderLogo];

            if(src) {
                return '<div class="">'
                    + (src ? '<img src="' + src + '" width="25" />' : '')
                    + '<span>' + value + '</span>'
                    + '</div>';
            }
        }
        return value;
    };

    superHandleFocus(e){
        super.handleFocus(e);
    }
    handleFocus(e){
        super.handleFocus(e);
        if(this._value() && this.refs._input && $(this.refs._input).data('isautocomplete')){
            //$(this.refs._input).trigger('change keyup');
            //$(this.refs._input).autocomplete('setOptions', {minChars:0});
            //setTimeout(()=>{
                $(this.refs._input).autocomplete('onValueChange');
            //},50);
        }
    }

    setOptions(options){
        this.setState({
            options:options
        });
        if(this.refs._input && $(this.refs._input).data('isautocomplete')){
            $(this.refs._input).autocomplete('setOptions', {lookup:this.normalize(options)});
        }
    }
    init_autocomplete(){
        let autocomplete = {
            //delimiter: this.props.at,
            noCache: !this.props.cache,
            minChars: this.props.minChars,
            autoSelectFirst:this.props.autoSelectFirst,
            tabDisabled:true,
            maxHeight: 300,
            lookup: (this.state.options ? this.normalize(this.state.options) : this.state.options),
            lookupLimit: this.props.limit,
            showNoSuggestionNotice:(this.props.noSuggestionNotice ? true : false),
            noSuggestionNotice:(this.props.noSuggestionNotice ? this.props.noSuggestionNotice : false),
            /*lookupFilter: function (suggestion, query, queryLowerCase) {
                console.log(suggestion.value,suggestion.value.toLowerCase().indexOf(queryLowerCase) === 0);
                return suggestion.value.toLowerCase().indexOf(queryLowerCase) === 0;
            },*/
            lookupFilter:(suggestion, originalQuery, queryLowerCase)=>{
                let suggestion_value = suggestion.value.toLowerCase();
                if(this.props.spaceLookup) {
                    let values = queryLowerCase.split(' ');
                    let found = true;
                    for(let i in values){
                        let val = values[i].trim();
                        if(val) {
                            found = found && suggestion_value.indexOf(val) >= 0;
                            if (!found) {
                                break;
                            }
                        }
                    }
                    return found;
                }else{
                    return suggestion_value.indexOf(queryLowerCase) !== -1;
                }
            },
            onSelect: (sel)=>{
                //let e = {target:{value:this.refs._input.value}};
                //this.handleChange(e);
                let _sel = {...sel,value: sel.data,label:sel.value};
                this.onSelect(_sel);
            },
            onSearchStart:(query)=>{
                query.query = (query.query);
                //console.log(query);
                this.setValue(query.query);
                this.loading();
                this.onSearchStart(query);
            },
            onSearchComplete:(query, suggestions)=>{
                //this.setValue(this.refs._input.value);
                //this.setOptions(suggestions);
                this.setState({value:this.refs._input.value,options:suggestions});
                this.loading(false);
                this.onSearchComplete(query, suggestions);
            },
            onSearchError:(query, jqXHR, textStatus, errorThrown)=>{
                this.setValue(this.refs._input.value);
                this.loading(false);
            },
            transformResult:(response)=>{
                return this.transformResult(response);
            },
            formatResult:(suggestion, currentValue)=>{
                if (!currentValue) {
                    return suggestion.value;
                }
                let values = [currentValue];
                let suggestion_value = suggestion.value;

                if(this.props.spaceLookup) {
                    values = currentValue.split(' ');
                }
                if(suggestion_value) {
                    for (let i = 0; i < values.length; i++) {
                        currentValue = values[i];
                        if (!currentValue) continue;

                        var pattern = '(' + $.Autocomplete.utils.escapeRegExChars(currentValue) + ')';
                        suggestion_value = suggestion_value
                            .replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>')
                            .replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/"/g, '&quot;')
                            .replace(/&lt;(\/?strong)&gt;/g, '<$1>');
                    }
                }
                return this.renderItem(suggestion_value,suggestion);
            }
        };
        //console.log(this.props.ajax);
        if(this.props.ajax){
            let _ajax = this.props.ajax;
            autocomplete.serviceUrl = _ajax.url;
            autocomplete.type = 'post';
            autocomplete.dataType = 'json';
            autocomplete.paramName = 'query';
            if(!_ajax.data) _ajax.data = {};
            autocomplete.params = {limit:this.props.limit,..._ajax.data,_tkn_:ajax.getToken()};
        }else{
            autocomplete.serviceUrl = undefined;
        }
        //console.log('autocomplete',{...autocomplete});

        if(!$(this.refs._input).data('isautocomplete')) {
            let auto = $(this.refs._input).autocomplete(autocomplete).data('isautocomplete', true).on('keydown', ((e)=> {
                /*if(e.keyCode==32) {
                 e.preventDefault();
                 }*/
            }));
            /*if(this.props.renderItem && typeof this.props.renderItem == 'function'){
                auto.data("ui-autocomplete")._renderItem = this.props.renderItem.bind(this);
            }*/
        }
    }
    dispose_autocomplete(){
        if($(this.refs._input).data('isautocomplete')) $(this.refs._input).data('isautocomplete',false).autocomplete('dispose');
    }
    componentDidMount() {
        super.componentDidMount();
        this.init_autocomplete();
    }
    componentWillUnmount() {
        super.componentWillUnmount();
        //console.log('componentWillUnmount',$(this.refs._input),$(this.refs._input).data('isautocomplete'));
        this.dispose_autocomplete();
    }
    componentDidUpdate(prevProps,prevState) {
        super.componentDidUpdate(prevProps,prevState);
        this.init_autocomplete();
    }

    render(){
        let el= super.render();
        return el;
    }
};