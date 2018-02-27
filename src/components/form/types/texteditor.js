/**
 * Created by nasa on 3/1/16.
 */

import React, { Component } from 'react';
import classNames from 'classnames';
import {Editor, EditorState, RichUtils, convertFromHTML,ContentState,convertToRaw, convertFromRaw} from 'draft-js';
import {stateFromMarkdown} from 'draft-js-import-markdown';
import {stateToMarkdown} from 'draft-js-export-markdown';

import BaseInput from './input';
const $ = window.jQuery;

export default class textarea extends BaseInput{
    _focus_timeout = null;

    static defaultProps= {
        ...BaseInput.defaultProps,
        //className: 'form-control sp-rich-editor',
        floatingLabel: false,
        submitByEnter:false,
        format:'markdown',  // markdown | raw | html
        textAlignment:'right',
        button_group:{className:'btn-group btn-xs'},
        buttons:[
            [
                {label:'bold',icon:'bold',_style:'BOLD'},
                {label:'italic',icon:'italic',_style:'ITALIC'},
            ],
            [
                {label:'unordered list',icon:'list-ul',block:'unordered-list-item'},
                {label:'ordered list',icon:'list-ol',block:'ordered-list-item'},
            ]
        ]
    };
    constructor(props) {
        super(props);
        this.state['value'] = this._setValue(props.value);
        this.state['buttons'] = props.buttons;

        if(typeof props.render_buttons=="function") this.render_buttons = props.render_buttons.bind(this);
        if(typeof props.render_button=="function") this.render_button = props.render_button.bind(this);
    }

    _export_to_markdown(content_state){
        if(typeof content_state == "undefined") content_state=this._value().getCurrentContent();
        return stateToMarkdown(content_state);
    }
    _export_to_html(content_state){
        if(typeof content_state == "undefined") content_state=this._value().getCurrentContent();
        return this.state.value.getCurrentContent().getPlainText();
    }
    _export_to_raw(content_state){
        if(typeof content_state == "undefined") content_state=this._value().getCurrentContent();
        return JSON.stringify(convertToRaw(contentState));;
    }

    _import_from_markdown(v){
        const contentState = stateFromMarkdown(v);
        let editorState = EditorState.createWithContent(contentState);

        return editorState;
    }
    _import_from_raw(v){
        const contentState = convertFromRaw(JSON.parse(v));
        let editorState = EditorState.createWithContent(contentState);

        return editorState;
    }
    _import_from_html(v){
        const blocksFromHTML = convertFromHTML(v);
        const contentState = ContentState.createFromBlockArray(blocksFromHTML);
        editorState = EditorState.createWithContent(contentState);

        return editorState;
    }

    _handleKeyCommand(command) {
        const newState = RichUtils.handleKeyCommand(this._value(), command);
        if (newState) {
            this.handleChange(newState);
            return true;//'handled';
        }
        return false;//'not-handled';
    }
    command(command,e) {
        if(e && e.preventDefault) e.preventDefault();
        if (this._handleKeyCommand(command)) {
            this.fixFocus();
        }
    }
    fixFocus(){
        if(this._focus_timeout)clearTimeout(this._focus_timeout);
        this._focus_timeout = setTimeout(()=>{this.focus()},10);
    }

    button_is_active(btn){
        const selection = this._value().getSelection();
        const currentContent = this._value().getCurrentContent();

        if(typeof btn.action == "string" && typeof btn.active == "undefined"){
            console.log(this._value().getCurrentInlineStyle());
            console.log(currentContent.getBlockForKey(selection.getStartKey()).getType(),selection.getStartKey());
            return
                this._value().getCurrentInlineStyle().has(btn.action) ||
                this._value().getCurrentContent().getBlockForKey(selection.getStartKey()).getType()==btn.action
            ;
        }
        if(typeof btn.active == "function" ){
            return btn.active.call(this);
        }
        return false;
    }

    normalize_button(btn){
        if(typeof btn._style == "string"){
            btn.onClick = ()=>{
                this.handleChange(RichUtils.toggleInlineStyle(this._value(), btn._style));
                this.fixFocus();
            };
        }else if(typeof btn.block == "string"){
            btn.onClick = ()=>{
                this.handleChange(RichUtils.toggleBlockType(this._value(), btn.block));
                this.fixFocus();
            };
        }else if(typeof btn.action == "string"){
            btn.onClick = this.command.bind(this,btn.action);
        }else if(typeof btn.action == "function"){
            btn.onClick = btn.action.bind(this);
        }

        return btn;
    }

    render_button(btn,ky){
        btn = this.normalize_button({...btn});
        if(React.isValidElement(btn)){
            return React.cloneElement(btn,{
                key: ky,
                active: this.button_is_active(btn),
                onClick: btn.onClick ? btn.onClick.bind(this) : ()=>{},
            });
        }
        let classname = classNames(btn.className,{
            ["btn btn-xs"] : true,
            ["btn-default"] : true,
            ["active"] : this.button_is_active(btn),
        });

        return <a key={ky} {...this.safeProps({...btn})} className={classname}>
            {btn.children || <i className={"fa fa-"+btn.icon}></i>}
        </a>;
    }
    _setValue(v){
        let editorState;
        if(v && typeof v == "string"){
            if(this.props.format == 'markdown'){
                editorState = this._import_from_markdown(v);
            }else { //html
                editorState = this._import_from_html(v);
            }
        }else if(v && v instanceof EditorState){
            editorState = v;
        }else{
            editorState = EditorState.createEmpty();
        }
        return editorState;
    }
    setValue(v){
        let val = this._setValue(v);
        super.setValue(val);
    }

    validate(){
        let value = this.state.value.getCurrentContent().getPlainText();
        return this._validate(value);
    }

    value(){
        if(this.props.format == 'markdown') {
            return this._export_to_markdown();
        }else if(this.props.format == 'html') {
            return this._export_to_html();
        }

        return this.state.value.getCurrentContent().getPlainText();
    }
    render_buttons(buttons){
        if(typeof buttons == "undefined") buttons = this.state.buttons;
        return Object.keys(buttons).map((ky,i)=>{
            let btn = buttons[ky];
            if(btn instanceof Array){
                return <div key={i+'_g'+ky} {...this.props.button_group}>
                    {this.render_buttons(btn)}
                </div>;
            }else{
                return this.render_button(btn,i+'_'+ky);
            }
        });
    }
    render_input(){
        let props = this.props;
        const editorState = this.state.value;

        let className = props.className+' RichEditor-editor';
        let contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }
        let editor_style = props.style || {} ;
        if(!editor_style.height) editor_style.height='auto';
        //if(typeof props.onKeyDown == 'function') props.onKeyDown = props.onKeyDown.bind(this);
        //if(typeof props.onKeyUp == 'function') props.onKeyUp = props.onKeyUp.bind(this);
        return <div>
            <div className={className} onClick={this.focus.bind(this)} style={editor_style}>
                <Editor {...props} ref="_input"
                    editorState={editorState}
                    handleKeyCommand={this.command.bind(this)}
                    onChange={this.handleChange.bind(this)}
                    onBlur={this.handleBlur.bind(this)}
                    onFocus={this.handleFocus.bind(this)}
                    onClick={this.handleClick.bind(this)}
                />
            </div>
        </div>;
    }
    renderElement(el,label=true,icon=true,tip=true){
        return <div className="sp-rich-editor">
            <div className="">
                {this.render_buttons()}
            </div>
            {super.renderElement(el,label,icon,tip)}
            </div>;
    }

};