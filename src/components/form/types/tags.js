/**
 * Created by nasa on 3/1/16.
 */

import React, { Component } from 'react';
import classNames from 'classnames';

import BaseInput from './input';
import Autocomplete from './autocomplete';
//import BaseInput from './../../../../utils/helper';



export default class tagsinput extends BaseInput{
    _darg_updateEdge = true;
    _timeout = null;

    static defaultProps= {
        ...BaseInput.defaultProps,
        delimiter:',',
        className:'bootstrap-tagsinput',
        limit:5,                    // max tags
        minChars:2,
        addOnBlur:true,
        addOnEnter:true,
        draggingClassName:'sp-placeholder',
        floatingLabel:false,
        submitByEnter: false,
        selectable: false,             // selectable mode
        renderLogo:true,               // show item logo or image in tag
        sortable:true,                 // is a sortable list
        autocomplete:true,             // is autocomplete mode, set object for autocomplete options
        options:undefined,             // autocomplete suggestions
        ajax:undefined,                // autocomplete ajax options, {url,data,type,...}
        tags:[],
        onAddTag:(tag,tags)=>{},
        onRemoveTag:(tag)=>{},
        onDragStart:()=>{},
        onDragOver:()=>{},
        onDragEnd:()=>{},

    };
    constructor(props) {
        super(props);
        this.state.options = this.normalizeOptions(props.options);
        this.state.autocomplete = props.autocomplete;
        this.state.tags = props.tags;
        this.state.draggingIndex = null;

        if(typeof props.normalizeTag =='function') this.normalizeTag = props.normalizeTag.bind(this);
        if(typeof props.normalizeOptions =='function') this.normalizeOptions = props.normalizeOptions.bind(this);
        if(typeof props.normalizeOption =='function') this.normalizeOption = props.normalizeOption.bind(this);
        if(typeof props.transformResult =='function') this.transformResult = props.transformResult;
        if(typeof props.render_tag =='function') this.render_tag = props.render_tag.bind(this);
        if(typeof props.render_tags =='function') this.render_tags = props.render_tags.bind(this);
        if(typeof props.render_tag_text =='function') this.render_tag_text = props.render_tag_text.bind(this);
        if(typeof props.render_tag_image =='function') this.render_tag_image = props.render_tag_image.bind(this);
    }
    componentDidMount(prevProps,prevState) {
        super.componentDidMount();
    }
    componentWillReceiveProps(nextProps) {
        /*this.setState({
            draggingIndex: nextProps.draggingIndex
        });*/
    }

    normalizeTag(tag){
        return tag;
    }

    /*normalize options*/
    normalizeOptions(options){
        return options;
    }
    /*normalize option*/
    normalizeOption(itm){
        return {...itm, data: itm.id, value: itm.name};
    }
    /*transform ajax result*/
    transformResult(response){ //bind with autocomplete
        return {suggestions:this.normalize(response.result)};
    }

    isAddable(){
        return !this.isReadonly() && this.length() < this.props.limit;
    }
    isSortable(indx,tag) {
        if(this.isReadonly()) return false;

        if(typeof tag == 'undefined') tag = this.state.tags[indx];
        return this.props.sortable && tag.sortable !== false;
    }
    isRemovable(indx,tag) {
        if(typeof tag == 'undefined') tag = this.state.tags[indx];
        return !this.isReadonly() && tag.removable !== false ;
    }
    isDragging(indx) {
        if(this.isReadonly()) return false;

        if(typeof indx!='undefined'){
            return this.state.draggingIndex==indx;
        }
        return this.state.draggingIndex>=0 && this.state.draggingIndex!==null && this.state.draggingIndex!==undefined;
    }
    options(){
        return this.state.options;
    }
    setOptions(options){
        this.setState({
            options:this.normalizeOptions(options)
        });
    }
    findIndexByX(value,data,x){
        if(!x) x = 'value';
        for(let i in data){
            if(data[i][x] == value){
                return i;
            }
        }
        return false;
    }

    tags(){
        return this.state.tags;
    }
    setTags(tags){
        if(!tags) tags=[];
        this.setState({tags:tags});
    }
    addTag(tag){
        if(this.isAddable()) {
            if (typeof tag.label == 'undefined') tag.label = tag.value;
            if (this.findIndexByX(tag.value, this.tags()) === false) {
                let tags = this.tags().slice();//copy array
                //let tag = {value:tag.value,label:tag.label};
                tags.push(tag);
                this.setTags(tags);
                this.props.onAddTag.call(this, tag, tags);
            }
        }
    }
    removeTag(value){
        let index = this.findIndexByX(value,this.tags());
        if(index!==false){
            let tags = this.tags().slice();//copy array
            let tag = tags[index];
            //delete tags[index];
            tags.splice(index, 1);
            this.setTags(tags);
            this.props.onRemoveTag.call(this,tag);
        }
    }
    tag(value){
        let index = this.findIndexByX(value,this.tags());
        if(index!==false){
            return this.state.tags[index];
        }
        return false;
    }
    length(){
        return this.tags().length;
    }

    _value(){
        if(this.refs._input){
            return this.refs._input._value();
        }
        return super._value();
    }
    value(){
        let tags = this.tags();
        if(tags && tags.length > 0){
            let _tags = [];
            for(let i in tags){
                let tag = tags[i];
                if(tag.value) {
                    _tags.push(tag.value.toString().replace(new RegExp(this.props.delimiter, 'g'), ' '));
                }
            }
            return _tags.join(this.props.delimiter);
        }
        return '';
    }
    setValue(val){
        if(this.refs._input){
            this.refs._input.setValue(val);
        }
        super.setValue(val);
    }

    onSelect(sel){

    }
    onSearchStart(query){

    }
    onSearchComplete(query, suggestions){

    }
    handleInputChange(e){
        super.handleChange(e);
    }
    handleClick(e){
        if(e && e.preventDefault) e.preventDefault();
        this.focus();
    }
    validate() {
        return super.validate();
    }
    handleSubmitByEnter(e){
        if(this.props.addOnEnter) {
            if (e.keyCode == 13) {
                e.preventDefault();
                e.stopPropagation();
                let tag = {value: this._value(), label: this._value()};
                this.addTag(tag);
                this.setValue('');
            }
        }
    }
    handleAutocompleteBlur(e){
        super.handleBlur(e);
        if (this.props.addOnBlur) {
            this._timeout = setTimeout(()=> {
                this.handleBlur(e);
            }, 100);
        }
    }
    handleBlur(e){
        super.handleBlur(e);
        if(this.props.addOnBlur) {
            if (!this.props.selectable && this._value()) {
                let tag = {value: this._value(), label: this._value()};
                this.addTag(tag);
                this.setValue('');
            }else {
                this.setValue('');
            }
        }
    }
    handleFocus(e){
        clearTimeout(this._timeout);
        super.handleFocus(e);
    }
    handleAddTag(e){
        if(e && e.preventDefault) e.preventDefault();

    }
    handleRemoveTag(tag,e){
        if(e && e.preventDefault) e.preventDefault();
        this.removeTag(tag.value);
    }

    /*Drag sortable start*/
    //<editor-fold desc="Drag sortable start">
    handleDragStart(indx,e){
        //if(e && e.preventDefault) e.preventDefault();
        let draggingIndex = indx;

        this.props.onDragStart(indx);
        this.setState({draggingIndex:draggingIndex});

        let dt = e.dataTransfer;
        if (dt !== undefined) {
            e.dataTransfer.setData('text', e.target);

            //fix http://stackoverflow.com/questions/27656183/preserve-appearance-of-dragged-a-element-when-using-html5-draggable-attribute
            if (dt.setDragImage && e.currentTarget.tagName.toLowerCase() === 'a') {
                dt.setDragImage(e.target, 0, 0);
            }
        }
        this._darg_updateEdge = true;
    }
    handleDragEnd(e) {
        if(e && e.preventDefault) e.preventDefault();
        this.props.onDragEnd();
        setTimeout(()=>{this.setState({draggingIndex:null})},30);
    }
    handleDragDrop(e) {
        this.handleDragEnd(e);
    }
    handleDragOver(indx,e) {
        if(e && e.preventDefault) e.preventDefault();
        this.props.onDragOver(indx);
        let mouseBeyond;
        let positionX, positionY;
        let height, topOffset;
        let items = this.tags();
        const overEl = e.currentTarget; //underlying element //TODO: not working for touch
        const indexFrom = Number(this.state.draggingIndex);
        height = overEl.getBoundingClientRect().height;

        positionX = e.clientX;
        positionY = e.clientY;
        topOffset = overEl.getBoundingClientRect().top;
        const indexDragged = Number(indx); //index of underlying element in the set DOM elements
        if (this.props.outline === "grid") {
            mouseBeyond = this.isMouseBeyond(positionX, overEl.getBoundingClientRect().left, overEl.getBoundingClientRect().width)
        }else{
            mouseBeyond = this.isMouseBeyond(positionY, topOffset, height)
        }
        if (indexDragged !== indexFrom && mouseBeyond) {
            items = this.swapArrayElements(items, indexFrom, indexDragged);
            this.setState({
                tags: items, draggingIndex: indexDragged
            });
        }
    }
    swapArrayElements(items, indexFrom, indexTo){
        var item = items[indexTo];
        items[indexTo] = items[indexFrom];
        items[indexFrom] = item;
        return items;
    }
    isMouseBeyond(mousePos, elementPos, elementSize) {
        var breakPoint = elementSize / 2;
        var mouseOverlap = mousePos - elementPos;
        return mouseOverlap > breakPoint;
    }
    //</editor-fold>
    /*end drag sort*/
    render_tag_close(indx,tag){
        if(this.isRemovable(indx)!==false){
            return  <span data-role="remove" onClick={this.handleRemoveTag.bind(this,tag)}></span>
        }
        return null;
    }
    render_tag_image(indx,tag){
        let classname = classNames('',{
            ['tag label label-flat']:true,
            ['bg-primary']:true,
            ['no-padding']:true,
            ['pr-20']:tag.removable!==false,
            ['pr-10']:tag.removable===false,
        });
        let src = tag[this.props.renderLogo] || tag.image || tag.logo;
        return <span className={classname}>
                <img src={src} style={{width:'auto',height:28,margin:1}} className="mr-10" />
                {tag.label}
                {this.render_tag_close(indx,tag)}
        </span>;

    }
    render_tag_text(indx,tag){
        let classname = classNames('',{
            ['tag label label-flat']:true,
            ['bg-primary']:true,
            ['pr-5']:tag.removable===false,
        });
        return <span className={classname}>
            {tag.label}
            {this.render_tag_close(indx,tag)}
        </span>;
    }
    render_tag(indx,tag){
        if(typeof tag.label == 'undefined') tag.label = tag.value;

        let props = {
            'data-id':indx,
            className:'sp-tag pull-left ',
            key:tag.value+'_'+tag.label+'_'+indx
        };
        if(this.isSortable(indx)){
            props = {...props,
                className:props.className+(this.isDragging(indx) ? this.props.draggingClassName : ""),
                draggable:true,
                onDragOver:this.handleDragOver.bind(this,indx),
                onDragStart:this.handleDragStart.bind(this,indx),
                onDragEnd:this.handleDragEnd.bind(this),
                //onMouseUp:this.handleDragEnd.bind(this),
                onDrop:this.handleDragDrop.bind(this),
                onTouchMove:this.handleDragOver.bind(this,indx),
                onTouchStart:this.handleDragStart.bind(this,indx),
                onTouchEnd:this.handleDragEnd.bind(this),
            };
        }
        //console.log(tag,this.props.renderLogo,tag[this.props.renderLogo]);
        if(this.props.renderLogo && (tag[this.props.renderLogo] || tag.image || tag.logo)){
            return <span {...props}>{this.render_tag_image(indx,tag)}</span>;
        }
        return <span {...props}>{this.render_tag_text(indx,tag)}</span>;
    }
    render_tags(){
        let tags = this.tags();
        return <div>{Object.keys(tags).map((i)=>{
            return this.render_tag(i,tags[i]);
        })}</div>;
    }

    render_input_autocomplete_element(){
        let size = this._value().toString().length;
        //console.log(this.state.value);
        return <Autocomplete ref="_input" size={size} _p={this}
            value={this._value()}
            cleanMode={true}
            autoSelectFirst={false}
            options={this.props.options}
            normalizeOption={this.normalizeOption.bind(this)}
            transformResult={this.transformResult}
            //transformResult={function(response){return {suggestions:this.normalize(response.result.users)}}}
            ajax={this.props.ajax}
            placeholder={this.props.placeholder}
            onSelected={(sg)=>{
                //console.log(sg);
                if(sg) {
                    //this.addTag({value: sg.value, label: sg.label});
                    this.addTag(sg);
                    this.setValue('');
                    this.focus();
                }
            }}
            //handleChange_={this.handleInputChange.bind(this)}
            handleBlur={this.handleAutocompleteBlur.bind(this)}
            handleFocus={this.handleFocus.bind(this)}
            onKeyDown={this.handleSubmitByEnter.bind(this)}
            onDrop={(e)=>{e.preventDefault();return false;}}
            {...(typeof this.props.autocomplete=='object' ? this.props.autocomplete : {})}
        />
    }
    render_input_text_element(){
        let size = this._value().toString().length;
        return <input ref="_input" size={size} _p={this}
                      value={this._value()}
                      placeholder={this.props.placeholder}
                      onChange={this.handleInputChange.bind(this)}
                      onBlur={this.handleBlur.bind(this)}
                      onFocus={this.handleFocus.bind(this)}
                      onKeyUp={this.handleSubmitByEnter.bind(this)}
                      onDrop={(e)=>{e.preventDefault();return false;}}
        />;
    }
    render_input_element(){
        if(this.isAddable()) {
            if(this.props.autocomplete){
                return this.render_input_autocomplete_element();
            }
            return this.render_input_text_element();
        }
        return null;
    }
    render(){
        let classname = 'sp-tagsinput '+this.props.className;
        let el= <div className={classname} onClick={this.handleClick.bind(this)}>
            {this.render_tags()}
            {!this.isReadonly() && this.render_input_element()}
        </div>;

        return this.renderElement(el);
    }
};