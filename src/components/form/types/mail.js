/* eslint-disable import/first */
/**
 * Created by nasa on 3/1/16.
 */

//import jquery  from 'jquery';
import React, { Component } from 'react';
import BaseInput from './input';
//var $ = window.$;

export default class mailinput extends BaseInput{
    static defaultProps= {
        ...BaseInput.defaultProps,
        className:'ltr form-control text-align',
        domains:['gmail.com','yahoo.com','ymail.com','mail.com','googlemail.com','hotmail.com','outlook.com','live.com'],
        autoSelect: true,
        at:/@/,
        rules:{email:true}
    };
    componentDidMount() {
        super.componentDidMount();
        let opts = {
            delimiter: this.props.at,
            minChars: 1,
            autoSelectFirst:this.props.autoSelect,
            tabDisabled:true,
            /*source: function (request, response) {
                // delegate back to autocomplete, but extract the last term
                response($.ui.autocomplete.filter(
                    this.props.source, extractLast(request.term)));
            },*/
            lookup: this.props.domains,
            onSelect: (sel)=>{
                this.setValue(this.refs._input.value);
                this.doValidate();
                this.focus();
            },
            onSearchStart:(query)=>{
                let i=this.refs._input.value.indexOf('@');
                //console.log(this.refs._input.value,i);
                if(i < 1 || i === false){
                    return false;
                }else if(i > 1){
                    if(this.refs._input.value.indexOf('@',i+1) > i) return false;
                }
                return true;
            }
            /*onSearchStart:function (query) {
                console.log(query);
            },
            onSearchComplete: function (query, suggestions) {
                console.log(query, suggestions);
            }*/
            /*focus: function () {
                // prevent value inserted on focus
                return false;
            },*/
            /*select: function (event, ui) {
                var terms = split(this.value);

                // remove the current input
                terms.pop();
                // add the selected item
                terms.push(ui.item.label);
                // add placeholder to get the comma-and-space at the end
                terms.push("");
                this.value = terms.join("");
                return false;
            }*/
        };
        window.jQuery(this.refs._input).autocomplete(opts).keydown((e)=>{
            //console.log(e);
            if(e.keyCode==32) {
                e.preventDefault();
            }else if(e.keyCode==64){
                let i=this.refs._input.value.indexOf('@');
                if(i > 1 && this.refs._input.value.indexOf('@', i+1) > i){
                    e.preventDefault();
                }
            }
        });
        //this.refs._input.onKeyDown = this.handleKeyDown.bind(this);
    }

    render(){
        let el= super.render();
        return el;
    }
};