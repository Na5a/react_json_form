/**
 * Created by nasa on 3/2/16.
 */

import React from 'react';
import classNames from 'classnames';

import Icon from './../../components/Icon';
import Form from './form';

export default class formCustom extends Form {

    render_btn_submit(){
        let classname = classNames(this.props.submit.className,{
            ['btn-labeled btn-labeled-left']:true
        });
        return <button type="submit" {...this.props.submit} style={{minWidth:100}} className={classname}>
            <b><Icon icon="check" /></b>
            <span>{this.props.submit.label}</span>
        </button>;
    }

}
