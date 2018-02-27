/**
 * Created by nasa on 5/17/16.
 */
import React, {Component, PropTypes} from 'react';

'use strict';

export function safeProps(props) {
    //let {history,location,params,route,routeParams,routes,...props} = _props;
    let valid_attr =['accept','accept-charset','accesskey','action','align','alt','async','autocomplete','autofocus','autoplay','bgcolor','border','challenge','charset','checked','cite','class','color','cols','colspan','content','contenteditable','contextmenu','controls','coords','data','datetime','default','defer','dir','dirname','disabled','download','draggable','dropzone','enctype','for','form','formaction','headers','height','hidden','high','href','hreflang','http-equiv','id','ismap','keytype','kind','label','lang','list','loop','low','manifest','max','maxlength','media','method','min','multiple','muted','name','novalidate','onabort','onafterprint','onbeforeprint','onbeforeunload','onblur','oncanplay','oncanplaythrough','onchange','onclick','oncontextmenu','oncopy','oncuechange','oncut','ondblclick','ondrag','ondragend','ondragenter','ondragleave','ondragover','ondragstart','ondrop','ondurationchange','onemptied','onended','onerror','onfocus','onhashchange','oninput','oninvalid','onkeydown','onkeypress','onkeyup','onload','onloadeddata','onloadedmetadata','onloadstart','onmousedown','onmousemove','onmouseout','onmouseover','onmouseup','onmousewheel','onoffline','ononline','onpagehide','onpageshow','onpaste','onpause','onplay','onplaying','onpopstate','onprogress','onratechange','onreset','onresize','onscroll','onsearch','onseeked','onseeking','onselect','onshow','onstalled','onstorage','onsubmit','onsuspend','ontimeupdate','ontoggle','onunload','onvolumechange','onwaiting','onwheel','open','optimum','pattern','placeholder','poster','preload','rel','required','reversed','rows','rowspan','sandbox','scope','scoped','selected','shape','size','sizes','span','spellcheck','src','srcdoc','srclang','start','step','style','tabindex','target','title','translate','type','usemap','value','width','wrap','classname','htmlfor','readonly','key'];//
    //console.log(props);
    Object.keys(props).map((k,indx)=>{
        let k1 = k.toString().toLowerCase();
        if(k1.indexOf('data-')!=0 && valid_attr.indexOf(k1)==-1){
            delete props[k];
            //props[k]=null;
        }
    });
    if(typeof props['readonly'] !== 'undefined'){
        props['readOnly'] = props['readonly'];
        delete props['readonly'];
    }
    return props;
}
export default class appComponent extends Component {

    /*static contextTypes = {
        router:  React.PropTypes.object
    };*/

    _isMounted = false;
    constructor (props) {
        super(props);
        this.state = {
            ...this.state
        };
        this.setState = this.setState.bind(this);
        this.replaceState = this.replaceState.bind(this);
    }

    isMounted(){
        return this._isMounted;
    }
    safeProps(_props) {
        if(!_props) _props = {...this.props};//helper.assign({...this.props});//{...this.props};
        return safeProps(_props);
    }


    componentDidMount() {
        this._isMounted = true;
    }
    componentDidUpdate(prevProps, prevState) {
        this._isMounted = true;
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    componentWillUpdate(nextProps,nextState){
        this._isMounted = false;
    }

    setState(state){
        if(this._isMounted){
            super.setState(state);
        }else{
            console.log('[WARNING] appComponent::setState ',state);
        }
    }
    replaceState(completeState, callback){
        if(this._isMounted){
            super.replaceState(completeState, callback);
        }else{
            console.log('[WARNING] appComponent::replaceState ',completeState, callback);
        }
    }

}