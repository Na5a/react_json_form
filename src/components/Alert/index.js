/**
 * Created by nasa on 3/6/16.
 */

import React, { Component, PropTypes,cloneElement,create } from 'react';
import classNames from 'classnames';

import Icon from '../Icon';
import appComponent from '../app/appComponent';

export default class Alert extends appComponent {
    static propTypes = {};
    static defaultProps= {
        type:'danger',
        icon: '',
        icon_props:{
            //className: 'fa-fw text-success fa-2x'
        },
        style:{maxWidth:650,margin:'auto'},
        styled:true,
        dismiss:true
    };
    constructor(props, context) {
        super(props, context);
        this.state = {
            show_alert : true
        }
    }
    handleAlertDismiss(e){
        this.setState({
            show_alert : false
        });
    }
    componentWillReceiveProps(nextProps){
        if(super.componentWillReceiveProps) super.componentWillReceiveProps(nextProps);
        if(this.props.children != nextProps.children){
            this.setState({show_alert : true});
        }
    }
    render(){
        if(this.state.show_alert) {
            let dismiss = this.props.dismiss ? this.handleAlertDismiss.bind(this) : null;
            let classname = classNames(this.props.className,{
                ['alert']: true,
                ['alert-'+this.props.type]: true,
                ['alert-styled-left']:this.props.styled,
                ['alert-arrow-left']:this.props.styled
            });
            return (
                <div className={classname} style={this.props.style}>
                    {this.props.dismiss && <button type="button" className="close" onClick={dismiss}><span>&times;</span><span className="sr-only">Close</span></button>
                    || null}
                    {this.props.icon && <Icon icon={this.props.icon} {...this.props.icon_props} /> || null}
                    {this.props.children}
                </div>
            );
        }
        return null;
    }
}