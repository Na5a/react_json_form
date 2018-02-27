/**
 * Created by nasa on 3/2/16.
 */

import React, { Component } from 'react';
import Form from './index';

/*export default (props)=>{
    return (
        <Form className="form-horizontal" {...props} />
    )
}*/

export default class formJsonComponent extends Component {
    _form = false;

    render(){
        if(!this._form){
            this._form = <Form className="form-horizontal" {...this.props} />;
        }
        return this._form;
    }
}
