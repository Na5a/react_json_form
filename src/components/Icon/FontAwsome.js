import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import appComponent from './../app/appComponent';

export default class FontAwsome extends appComponent {
    constructor (props) {
        super(props);
    };
    render () {
        //console.log(this.props);
        let className = classNames(this.props.className, {
            ['sp_icon']: true,
            ['fa']: true,
            ['fa-' + this.props.icon]: true
        });
        //let className = this.props.className + this.props.bsClass +' '+this.props.icon;
        return (
            <i {...this.safeProps()} className={className}>{this.props.children}</i>
        );
    };
};
