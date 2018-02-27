/**
 * Created by nasa on 3/1/16.
 */

import React, { Component } from 'react';
import classNames from 'classnames';

import BaseInput from './input';
import Icon from './../../../components/Icon';
import Map from './../../../components/Map';
import Translator from './../../../components/Translator';

export default class googlemap extends BaseInput{
    static defaultProps= {
        ...BaseInput.defaultProps,
        cleanMode:false,
        floatingLabel:false,
        center:{},
        zoom:14,
        markers:[],
        buttons:true,
        map:{               //map custom props

        }
    };
    constructor (props) {
        super(props);
        this.state.markers = props.markers;
        this.state.refresh_cnt = 1;

        if(typeof props.handleMapClick == 'function') this.handleMapClick = props.handleMapClick.bind(this);
        if(typeof props.handleMapMarkerRClick == 'function') this.handleMapMarkerRClick = props.handleMapMarkerRClick.bind(this);
        if(typeof props.handleMapMarkerClick == 'function') this.handleMapMarkerClick = props.handleMapMarkerClick.bind(this);
    }
    shouldComponentUpdate(nextProps, nextState){
        //return this.state.value!=nextState.value;
        return this.state.validate_msg!=nextState.validate_msg
            || this.state.validate!=nextState.validate
            || this.state.refresh_cnt!=nextState.refresh_cnt
        ;
    }

    normalize_value(v){
        let val = undefined;
        if(v) {
            if (typeof v == 'string') {
                let t = v.split(',');
                if (t && t.length == 2) {
                    val = {lat: parseFloat(t[0]), lng: parseFloat(v[1])};
                }
            } else if (typeof v == 'object' && v.lat && v.lng) {
                val = {lat: parseFloat(v.lat), lng: parseFloat(v.lng)};
            }
        }
        return val;
    }

    setValue(v){
        v = this.normalize_value(v);
        super.setValue(v);

        if(this.refs._map){
            if(v && v.lat) {
                let markers = [this.refs._map.marker_factory(v.lat, v.lng)];
                this.refs._map.setMarkers(markers);
                this.refs._map.setCenter({lat:v.lat, lng:v.lng});
                this.state.markers=markers;
                /*if(this.state.markers != markers){
                    this.refresh();
                }*/
            }else{
                this.refs._map.clearMarkers();
            }
        }
    }
    value(){
        return this.normalize_value(this.state.value);
    }

    handleMapClick(e){
        if(e.latLng) {
            let val = {lat: e.latLng.lat(), lng: e.latLng.lng()};
            this.setValue(val);
        }
    }

    handleMapMarkerClick(marker){
        this.setValue('');
    }

    handleMapMarkerRClick(e){

    }

    handleClearMarker(){
        if(this.refs._map){
            this.setState({markers:[]});
            this.setValue(null);
        }
    }
    handleGeolocation(){
        if(this.refs._map){
            this.refs._map.geolocation((center)=>{
                this.setValue(center);
            });
        }
    }
    handleRefresh(){
        this.refresh();
    }
    refresh(){
        if(this.refs._map){
            this.setState({
                refresh_cnt:this.state.refresh_cnt+1,
                markers: this.state.markers
            });
        }
    }

    render_buttons(){
        let btns = {geolocation:true,clear:true,reload:true};
        if(typeof this.props.buttons == "object"){
            btns.geolocation = this.props.buttons.geolocation || true;
            btns.clear = this.props.buttons.clear || true;
            btns.reload = this.props.buttons.reload || true;
        }
        return <div className="">
            <div className="btn-group btn-group-xs mb-5">
                {btns.geolocation && <button type="button" className="btn btn-default btn-xs" onClick={this.handleGeolocation.bind(this)}>
                    <Icon icon="map-marker" className="position-left"/>
                    <Translator>my geolocation</Translator>
                </button> || null}
                {btns.clear && <button type="button" className="btn btn-default btn-xs" onClick={this.handleClearMarker.bind(this)}>
                    <Icon icon="times" className="position-left"/>
                    <Translator>clear</Translator>
                </button> || null}
                {btns.reload && <button type="button" className="btn btn-default btn-xs btn-icon" onClick={this.handleRefresh.bind(this)}>
                    <Icon icon="refresh" className=""/>
                    {/*<Translator>reload</Translator>*/}
                </button> || null}
            </div>
        </div>;

    }
    render_map(){
        let props = {
            style:{height:250},
            handleMapClick:this.handleMapClick.bind(this),
            handleMarkerClick:this.handleMapClick.bind(this),
            handleMarkerRightClick:this.handleMapClick.bind(this),
            viewMode:false,

            ...this.props.map,

            ref:'_map',
            markers: this.state.markers,
        };

        if(this.value()){
            props.center = this.value();
        }

        return <Map {...props} />
    }

    render_input(){
        let value = this.value() ? this.value().lat+','+this.value().lng : undefined;
        return <div key={this.state.refresh_cnt}>
            <input ref="_input" type="hidden" name={this.props.name} value={value} />
            {this.render_buttons()}
            {this.render_map()}
        </div>
    }
};