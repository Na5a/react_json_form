/**
 * Created by nasa on 2/22/16.
 */


import React, { Component } from 'react';
import classnNames from 'classnames';
import appComponent from './../app/appComponent';

export default class Spinner extends appComponent{
    static defaultProps={
        loading: false,
        overlay: true,
        type:'bars',
        lProps:{ //loading props
            //className: '',
            //style: {},
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            loading:props.loading,
        };
    };
    isLoading(){
        return this.props.loading==true;
    }

    _render(){
        return <div className="">
            {this.props.children}
        </div>;
    }
    _render_spinner_dots(){
        return <div className="spin-dots"></div>;
    }
    _render_spinner_bars(){
        return <div className="spin-bars">
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
            <div className="bar4"></div>
            <div className="bar5"></div>
            <div className="bar6"></div>
        </div>;
    }
    _render_spinner_bootstrap(){
        return <div className="spin-bootstrap"><i className="fa fa-spinner spinner"></i></div>;
    }

    _render_overlay(){
        return <div className="sp-overlay"></div>;
    }
    render_spinner(){
        switch (this.props.type){
            case 'dots':
                return this._render_spinner_dots();
            case 'bootstrap':
                return this._render_spinner_bootstrap();
            case 'bars':
                return this._render_spinner_bars();
            case 'no': case 'disable': case 'overlay':
                return <div className=""></div>;
        }
        return this._render_spinner_dots();
    }
    render_loading(){
        let props = this.props.lProps ? this.props.lProps : {};
        let className = classnNames(props.className,{
            ['sp-spinner']:true,
            ['sp-spinner-'+this.props.type]:true,
        });


        return <div key="spinnerLoading" {...props} className={className}>
            <div className="sp-children">
                {this._render()}
            </div>
            {this.props.overlay && this._render_overlay() || null}
            <div className="sp-container">{this.render_spinner()}</div>
            <div className="clear"></div>
        </div>;
    }
    render__(){
        return <div key="spinnerLoader" ref="content" {...this.safeProps()}>
            {this.props.loading ? this.render_loading() : this._render()}
            <div className="clear"></div>
        </div>;
    }
    render(){
        let props = this.props;//this.props.lProps ? this.props.lProps : {};
        if(this.isLoading() && this.props.lProps) props= {...props,...this.props.lProps};

        let className = classnNames(props.className,{
            ['sp-spinner']: this.isLoading(),
            ['sp-spinner-'+this.props.type]: this.isLoading(),
        });

        let {loading, overlay, lProps, ...safeprops} = this.safeProps();
        //console.log(className);
        return <div {...safeprops} className={className}>
            <div className="sp-children">
                {this._render()}
            </div>
            {this.isLoading() && <div>
                {this.props.overlay && this._render_overlay() || null}
                <div className="sp-container">{this.render_spinner()}</div>
            </div> || null}
            <div className="clear"></div>
        </div>;
    }
}
