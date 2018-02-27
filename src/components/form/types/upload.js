/**
 * Created by nasa on 3/1/16.
 */

import React, { Component } from 'react';
import classNames from 'classnames';
//import accept from 'attr-accept';
import Cropper from 'react-cropper';

import Dropzone from "../../dropzone";
import i18n from "../../../../utils/i18n";

import BaseInput from './input';
import Icon from './../../../components/Icon';
import Translator from './../../../components/Translator';
import {Warning as WarningDialog} from './../../../components/Modal/Appender';

var _default_types = {
    image:'image/jpeg, image/png',
    document:'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    sheet:'.csv, text/*, application/csv, application/excel, application/vnd.ms-excel, application/vnd.msexcel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    all:'*',
};
export default class uploadinput extends BaseInput{
    static _counter= 0;
    _files = []; // array of file result

    static defaultProps= {
        ...BaseInput.defaultProps,
        cleanMode:false,
        accept:'image',              // accept file types, use _default_types or mime types
        multiple:false,
        floatingLabel:false,
        originLoad:true,
        dropzone:{              // custom accept availibale in dropzone
            label:'drop files to upload or click',
            disableClick:false,
            //minSize:100,
            //maxSize:100,
        },
        cropper:{               // cropper for accept type "image"
            buttons:true
        },
        image:{
            className:'overflow-hidden center-block'
        }
    };
    constructor (props) {
        super(props);
        this.state['files'] = [];
        this.state['update'] = Date.now();
        this.state['_counter'] = ++uploadinput._counter;

        if(typeof props.handleOnDrop == 'function') this.handleOnDrop = props.handleOnDrop.bind(this);
        if(typeof props.handleClearFile == 'function') this.handleClearFile = props.handleClearFile.bind(this);
    }
    shouldComponentUpdate(nextProps, nextState){
        return this.state.files!=nextState.files
            || this.state.value!=nextState.value
            || this.state.files.length != nextState.files.length
            || this.state.update != nextState.update
            || this.state.validate_msg!=nextState.validate_msg || this.state.validate!=nextState.validate;
    }
    read_file(file){
        //if(typeof indx == 'undefined') indx = 0;
        //let file = this.file(indx);

        if(file){
            var reader  = new FileReader();
            var _loop = true;
            file.loading = true;
            reader.onload = ()=>{
                //file.result = reader.result;
                this._files[file.index] = reader.result;
                file.loading = false;
            };
            reader.onloadend = ()=>{
                file.loading = false;
                this.setState({update:Date.now()});
                this.doValidate();
            };
            reader.onerror = ()=>{
                file.loading = false;
                this.handleClearFile(file.index);
            };
            reader.readAsDataURL(file);

            return file;
        }
        return null;
    }
    handleOnDrop(files) {
        if(files && files[0]) {
            if(this.props.accept == 'image' && !this.props.multiple) {
                this.setState({files: files});
            }else{
                files.map((file,i)=>{
                    file.index = i;
                    this.read_file(file);
                });
                this.setState({files: files});
            }
            this.handleChange('');
        }
    }
    handleOnDropRejected(files){
        WarningDialog(
            i18n._('warning'),
            i18n._('selected files is invalid')
        );
        //console.log(files);
    }

    handleClearFile(indx){
        if(typeof indx == 'undefined' || !this.files() || this.files().length <= 1){
            this.setState({files: []});
            this._files = [];
            this.handleChange('');
        }else{
            let files = Array(...this.state.files);
            if(typeof files[indx]!='undefined'){
                files.splice(indx,1);
                this._files.splice(indx,1);
                this.setState({files: files});
                this.handleChange('');
            }
        }
    }
    handleClearValue(){
        this.setState({value: ''});
        this.handleChange('');
    }
    bytesToSize(bytes){
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + i18n._(sizes[i]);
    }

    file(indx){
        if(typeof indx == 'undefined') indx = 0;
        if(this.state.files && this.state.files[indx]){
            return this.state.files[indx];
        }
        return null;
    }
    files(){
        return this.state.files;
    }
    value(){
        if (!this.refs.cropper || typeof this.refs.cropper.getCroppedCanvas === 'undefined'){
            if(this.files() && this.files().length){
                let files = [];
                this.files().map((file,indx)=>{
                    //if(file) files.push(this.read_file(indx));
                    if(file && this._files[file.index]){
                        files.push(this._files[file.index]);
                        //files.push(file.result);
                    }
                });
                return this.props.multiple ? files : files[0];
            }
            return '';
        }
        return this.refs.cropper.getCroppedCanvas().toDataURL();
    }
    setValue(val){
        this.setState({
            value: val
        });
    }


    render_value(){
        let val = this.state.value;
        let props = {
            style:{width:'100%',maxHeight:250,maxWidth:250,...this.props.cropper.style},
            ...this.props.image
        };
        if(this.props.originLoad) val += '?'+Date.now();
        return <div className="text-center">
            <div {...props}>
                <img src={val} style={{width:'100%'}} />
            </div>
            <a className="btn btn-primary mt-10 btn-xs btn-labeled" onClick={this.handleClearValue.bind(this)}>
                <b><Icon icon="times" /></b>
                <Translator>edit</Translator>
            </a>
        </div>;
    }

    render_dropbox(){
        let form = this.props;
        let {user} = this.state;
        //console.log(user);
        let dzone = {
            label:'drop files to upload or click',
            style:{width:'100%',height:'320px'},
            onDrop:this.handleOnDrop.bind(this),
            onDropRejected:this.handleOnDropRejected.bind(this),
            className: 'dz-default dz-message '+(this.props.dropzone.label===false ? 'dz-icon-center':''),
            //accept:(typeof _default_types[this.props.type]!='undefined' && _default_types[this.props.type]||'*'),
            multiple: this.props.multiple,
            ...this.props.dropzone
        };
        if(!dzone.accept && typeof _default_types[this.props.accept]!='undefined'){
            dzone.accept = _default_types[this.props.accept];
        }else if(!dzone.accept && this.props.accept){
            dzone.accept = this.props.accept;
        }

        let children = <div>
            <div className="dropzone center-block" style={dzone.style}><Dropzone {...dzone} style={{}}>
                {dzone.label!==false && <div><Translator>{dzone.label || this.props.label}</Translator></div> || null}
            </Dropzone></div>
        </div>;
        return  children;
    }
    render_file_type_icon(file){
        let _name = file.name;
        if (/\.(jpe?g|png|gif)$/i.test(_name)){
            //return <Icon icon="file-image-o" class="fa-2x" />
            return <img src={file.preview} style={{width:40}} />
        }else if (/\.(pdf)$/i.test(_name)){
            return <Icon icon="file-pdf-o" className="fa-2x" />
        }else if (/\.(doc|docx)$/i.test(_name)){
            return <Icon icon="file-word-o" className="fa-2x" />
        }else if (/\.(xls|csv)$/i.test(_name)){
            return <Icon icon="file-excel-o" className="fa-2x" />
        }else if (/\.(rar|zip|tar|gzip|7z|gz)$/i.test(_name)){
            return <Icon icon="file-zip-o" className="fa-2x" />
        }else{
            return <Icon icon="file-o" className="fa-2x" />
        }
    }
    render_files(){
        let files = this.files();
        return <div>
            {files && files.map((file,indx)=>{
               return <div key={file.name+'_'+indx} className="media">
                   <div className="media-left">
                       <div style={{width:40}} className="text-center">{this.render_file_type_icon(file)}</div>
                   </div>
                   <div className="media-body media-middle">
                       <div className="">{file.name}</div>
                       <div className="text-muted">{file.size && this.bytesToSize(file.size) || null}</div>
                   </div>
                   <div className="media-right media-middle">
                       {!file.loading &&
                            <a onClick={this.handleClearFile.bind(this, indx)}><Icon icon="times"/></a>
                       || <Icon icon="spinner" className="spinner"/>}
                   </div>
               </div>
            })}

        </div>;
    }
    render_cropper_btns(){
        //let cropper = this.refs.cropper;
        //if(cropper) {
        let btns = {zoom:true,move:true,rotate:true};
        if(typeof this.props.buttons == "object"){
            btns.zoom = this.props.buttons.zoom || true;
            btns.move = this.props.buttons.move || true;
            btns.rotate = this.props.buttons.rotate || true;
        }
        return <div className="text-center">
            {btns.zoom && <div className="btn-group btn-group-xs mb-5">
                <button type="button" className="btn btn-default btn-xs" onClick={(e)=> {this.refs.cropper.zoom(0.1);}}>
                    <Icon icon="plus-circle"/>
                </button>
                <button type="button" className="btn btn-default btn-xs" onClick={(e)=> {this.refs.cropper.zoom(-0.1);}}>
                    <Icon icon="minus-circle"/>
                </button>
            </div> || null}
            {btns.move && <div className="btn-group btn-group-xs mb-5 ml-5">
                <button type="button" className="btn btn-default btn-xs" onClick={(e)=> {this.refs.cropper.move(-10,0);}}>
                    <Icon icon="arrow-right"/>
                </button>
                <button type="button" className="btn btn-default btn-xs" onClick={(e)=> {this.refs.cropper.move(10,0);}}>
                    <Icon icon="arrow-left"/>
                </button>
                <button type="button" className="btn btn-default btn-xs" onClick={(e)=> {this.refs.cropper.move(0,-10);}}>
                    <Icon icon="arrow-up"/>
                </button>
                <button type="button" className="btn btn-default btn-xs" onClick={(e)=> {this.refs.cropper.move(0,10);}}>
                    <Icon icon="arrow-down"/>
                </button>
            </div> || null}
            {btns.rotate && <div className="btn-group btn-group-xs mb-5 ml-5">
                <button type="button" className="btn btn-default btn-xs" onClick={(e)=> {this.refs.cropper.rotate(-90);}}>
                    <Icon icon="rotate-left"/>
                </button>
                <button type="button" className="btn btn-default btn-xs" onClick={(e)=> {this.refs.cropper.rotate(90);}}>
                    <Icon icon="rotate-right"/>
                </button>
            </div> || null}

            {/*<div className="btn-group btn-group-xs mb-5 ml-5">
             <button type="button" className="btn btn-default btn-xs" onClick={(e)=> {cropper.scaleX(-1);}}>
             <Icon icon="arrows-h"/>
             </button>
             <button type="button" className="btn btn-default btn-xs" onClick={(e)=> {cropper.scaleY(-1);}}>
             <Icon icon="arrows-v" style={{width:12}}/>
             </button>
             </div>*/}
        </div>;
        //}
        //return null;
    }
    render_cropper(){
        let file = this.file(0);
        //console.log(user);
        let preview_c = 'img-preview-container'+this.state._counter;
        let preview_cls = 'img-preview2'+this.state._counter;

        let cropper = {
            className:'image-cropper-container',
            src:file.preview,
            style:{ /*height: 300,*/ width:'100%',maxHeight:250,maxWidth:250 },
            aspectRatio:1/1,
            //preview:'.'+preview_cls,
            guides:true,
            dragMode:'move',
            viewMode:1,
            ...this.props.cropper
            //crop:this.handleCrop.bind(this),
        };
        let children = <div>
                    {this.props.cropper.buttons && this.render_cropper_btns() || null}
                    <a className="btn position-absolute" onClick={this.handleClearFile.bind(this,undefined)}><Icon icon="times"/></a>
                    <center>
                        <Cropper ref='cropper' {...cropper} />
                    </center>
        </div>;
        return  children;
    }

    render_input(){
        if(this.state.value){
            return this.render_value();
        }
        if(this.state.files && this.state.files.length > 0){
            if(this.props.accept == 'image' && !this.props.multiple) {
                return this.render_cropper();
            }else {
                return this.render_files();
            }
        }
        return this.render_dropbox()
    }

};