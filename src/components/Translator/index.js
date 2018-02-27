/**
 * Created by nasa on 4/9/16.
 */

import React, { Component, PropTypes,cloneElement } from 'react';
import classNames from 'classnames';
import i18n from './../../utils/i18n';
import appComponent from './../app/appComponent';

export default class Translator extends appComponent {
    constructor(props) {
        super(props);
    };
    static defaultProps = {
    };
    static propTypes ={
        //children: PropTypes.string.isRequired
    };

    render() {
        let key = this.props.children;

        let _t = i18n._(key,{...this.props});
        if(typeof this.props._escape!='undefined' && !this.props._escape){
            return <span {...this.safeProps()} dangerouslySetInnerHTML={{__html:_t}}></span>;
        }
        return (<span {...this.safeProps()}>{_t}</span>);
    }
}