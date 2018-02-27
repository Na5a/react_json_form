/**
 * Created by nasa on 3/1/16.
 */
import React, { Component } from 'react';
import Icon from './../../../components/Icon';

import BaseInput from './input';

const $ = window.jQuery;

export default class proficiency extends BaseInput{
    static defaultProps= {
        ...BaseInput.defaultProps,
        floatingLabel: false,
        icons:{
            empty: 'star-o',
            half: 'star-half-o',
            full: 'star'
        },
        className: ' ltr',
        min:1,
        max:4,
        data:{},
        popover:{
            trigger:'hover',
            //container:'body',
            placement:'top',
            //template:'<div class="popover ltr" role="tooltip"><div class="arrow"></div><h3 class="popover-title dir"></h3><div class="popover-content dir"></div></div>'
        }
    };
    componentDidMount() {
        super.componentDidMount();

        if(this.refs._container){
            $(this.refs._container).find('a').popover(this.props.popover);
        }
    }
    feedback_icon(){
        return (<i />);
    }
    _data(key){
        if(this.props.data[key]){
            return this.props.data[key];
        }
        return {};
    }
    handleStarClick(val,e){
        e.preventDefault();
        this.setValue(val);
        this.doValidate();
    }
    handleStarHover(val,e){
        e.preventDefault();
        //this.setValue(val);
    }
    render_star(star){
        let val = this.value();
        let icon;
        if(star <= val){
            icon = <Icon icon={this.props.icons.full} className="fa-2x mr-5" />;
        }else{
            icon = <Icon icon={this.props.icons.empty} className="fa-2x mr-5" />;
        }
        let data = this._data(star);

        return <a key={'star_'+star} className="pull-right" onClick={this.handleStarClick.bind(this,star)} data-toggle="popover" title={data.title} data-content={data.desc}>
            {icon}
        </a>;
    }
    render_stars(){
        let stars = [];
        for(let star=this.props.min;star <= this.props.max;star++){
            stars.push(this.render_star(star));
        }
        return stars;
    }
    render_input(){
        return <div ref="_container" className={"proficiency "+this.props.className}>
            <input type="hidden" name={this.props.name} value={this.value()} />
            <div className="ltr">
                {this.render_stars()}
            </div>
            <div className="clear"></div>
        </div>;
    }

};