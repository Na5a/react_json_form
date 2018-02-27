/**
 * Created by nasa on 5/4/16.
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import i18n from "../../../utils/i18n";

import BaseInput from './mask';
import Icon from './../../../components/Icon';
//import MaskInput from './mask';
import SpCheckbox from './sp-checkbox';

//import Uniform from './uniform-checkbox';
const $ = window.jQuery;

export default class inlineDate extends BaseInput{
    _names={
        ja:{
            m:[ 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
            d:[31,31,31,31,31,31,30,30,30,30,30,29],
            w:['شنبه','یک شنبه','دو شنبه','سه شنبه','چهار شنبه','پنج شنبه','جمعه']
        },
        go:{
            m:['January','February','March','April','May','June','July','August','September','October','November','December'],
            d:[31,28,31,30,31,30,31,31,30,31,30,31],
            w:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
        }
    };
    _hndlrtimeout = 0;
    static defaultProps= {
        ...BaseInput.defaultProps,
        show_year: true,
        show_month: true,
        show_day: true,
        persistent: false,
        show_picker: true,
        show_picker_on_focus: true,
        on_picker: 'years',
        closeOnSelect:true,
        clear_button:{
            show:true,
            label:i18n._('clear date'),
            onChange:()=>{}
        },
        handleClick:function(e){
            this.handleFocus(e);
        }
    };
    constructor (props) {
        super(props);
        //this.state['inpY'] = this.state['inpM'] = this.state['inpD'] = null;
        this.state['isFocused'] = false;
        this.state['on_picker'] = props.on_picker;
        this.state['show_picker'] = props.show_picker;
    }
    componentDidMount() {
        super.componentDidMount();
        /*$(this.refs._input).on('keyup',(e)=>{
            //console.log(e);
        });*/
        if(this._show_picker()){
            $(window).on('click tap keydown',(event)=>{
                let $picker = $(this.refs._picker);
                if($picker && $picker.parent().has(event.target).length == 0 && !$picker.parent().is(event.target)){
                    this.unFocusPicker();
                }
            });
            $(this.refs._input).on('keydown click',()=>{
                let pos = this.getCursorPosition();
                let picker = false;
                if(this.props.show_year && pos <4) {
                    picker = 'years';
                    if(this.value() >=50 && this.value()<=99){
                        this.setValue('13'+this.value());
                    }
                }else if(this.props.show_month && pos >= 4 && pos <= 7)
                    picker='months';
                else if(this.props.show_day && pos > 7)
                    picker='days';
                if(picker && picker!=this.getOnPicker()){
                    this.setOnPicker(picker);
                    this._clearTimeout();
                }
            });

        }
    }
    _fix_year(year,len){
        if(typeof len == 'undefined') len = 0;
        if(year >= 50 && year <= 99){
            year = '13'+year;
        }else if(len >= 1 && year.toString().length == 1){
            year = '200'+year;
        }else if(len >= 2 && year.toString().length == 2){
            year = '20'+year;
        }
        return year;
    }
    _show_picker(){
        return this.state.show_picker;
    }
    _get_mask_pattern(){
        var mask = '';
        if(this.props.show_year) mask+='{{9999}}';
        if(this.props.show_month) mask+=(mask ? '-':'') + '{{99}}';
        if(this.props.show_day) mask+=(mask ? '-':'') + '{{99}}';
        return mask;
    }
    _getValues(value){
        if(!value) value = this.value();
        if(value){
            let vs = (value.replace('/', '-').replace('.', '-') + '-01-01').split("-", 4);
            //console.log(value,vs);
            let c = -1;
            let year , month , day;
            if(this.props.show_year) year = parseInt(vs[++c]);
            if(this.props.show_month) month = parseInt(vs[++c]);
            if(this.props.show_day) day = parseInt(vs[++c]);
            return {year, month , day};
        }
        return {year:'', month:'' , day:''};
    }
    _validate_year(val){
        if(val == undefined) val = this._getValues().year;
        if((val > 1300 && val < 1500) || (val > 1900 && val < 2500)) return true;

        return false;
    }
    _validate_month(val){
        if(val == undefined) val = this._getValues().month;
        if((val >= 1 && val <= 12)) return true;

        return false;
    }
    _validate_day(val){
        if(val == undefined) val = this._getValues().day;
        if((val >= 1 && val <= 31)) return true;

        return false;
    }
    _isJalali(year){
        if(!year) year = this._getCurrentYear();
        return (year.toString().substr(0,2) == 13) || (year.toString().substr(0,2) == 14);
    }
    _getCurrentYear(){
        let y = new Date().getFullYear();
        if(i18n.language()=='fa') y -=621;
        return y;
    }
    _clearTimeout(){
        if(this._hndlrtimeout) clearTimeout(this._hndlrtimeout);
    }

    getCursorPosition() {
        var pos = 0;
        //console.log(this.refs._input);
        if(this.refs._input) {
            var el = this.refs._input;
            if ('selectionStart' in el) {
                pos = el.selectionStart;
            } else if ('selection' in document) {
                el.focus();
                var Sel = document.selection.createRange();
                var SelLength = document.selection.createRange().text.length;
                Sel.moveStart('character', -el.value.length);
                pos = Sel.text.length - SelLength;
            }
        }
        return pos;
    }

    setOnPicker(on){
        this.setState({'on_picker':on});
    }
    getOnPicker(){
        return this.state.on_picker;
    }

    setDate(y,m,d){
        y = y && y>0 ? this._fix_year(y,0) : '';

        /*let value = '';
        if(this.props.show_year) value+=y;
        if(this.props.show_month) value+=(value ? '-':'') + m;
        if(this.props.show_day) value+=(value ? '-':'') + d;
        this.setValue(value);*/
        //this.setValue(this.normalizeDate({year:y,month:m,day:d}));
        this.handleChange(this.normalizeDate({year:y,month:m,day:d}));
    }
    setValue(val){
        //console.log(val);
        super.setValue(val);
    }

    normalizeDate(vs){
        let ret = '';
        if(typeof vs == 'string') vs = this._getValues(vs);

        if(vs.year=='' && vs.month > 12) {vs.year=this._fix_year(vs.month);vs.month='';}
        else if(!vs.year) vs.year = this._getCurrentYear();
        if(!vs.month) vs.month = '1';
        if(!vs.day) vs.day = '1';
        if(vs.year > 9999) vs.year = this._getCurrentYear();
        if(vs.month > 12) vs.month = '12';
        if(vs.day > 31) vs.day = '31';

        /*if(vs.year >=60 && vs.year<=99){
            vs.year = '13'+vs.year;
        }*/
        //console.log(vs);

        if(this.props.show_month && vs.month.toString().trim().length==1) vs.month='0'+vs.month.toString().trim();
        if(this.props.show_day && vs.day.toString().trim().length==1) vs.day='0'+vs.day.toString().trim();

        if(this.props.show_year) ret += vs.year;
        if(this.props.show_month) ret += (ret ? '-':'') + vs.month;
        if(this.props.show_day) ret += (ret ? '-':'') + vs.day;

        return ret;
    }

    validate(){
        if(super.validate()) {
            let val = this.value();
            let vs = this._getValues();
            //console.log(vs,val);
            if ((val === '' || val === null || val === undefined) && !this.props.rules.required) return true;
            if(!this.isVisible() && !this.props.validateOnHide) return true;
            if(this.props.show_year && !this._validate_year(vs.year)){
                this.setValidateMsg(i18n._('invalid x',{x:i18n._('year')}));
                return false;
            }
            if(this.props.show_month && !this._validate_month(vs.month)){
                this.setValidateMsg(i18n._('invalid x',{x:i18n._('month')}));
                return false;
            }
            if(this.props.show_day && !this._validate_day(vs.day)){
                this.setValidateMsg(i18n._('invalid x',{x:i18n._('day')}));
                return false;
            }
            this.setValue(this.normalizeDate(vs));

            return true;
        }
        return false;
    }

    unFocusPicker(){
        //this.focus();
        this.setState({'isFocused':false,hasFocus:false});
    }
    hidePicker(dly){
        if(typeof dly == 'undefined') dly = 200;
        this._clearTimeout();
        this._hndlrtimeout = setTimeout(()=>{
            this.unFocusPicker();
        },dly);
    }
    handleChange(value){
        super.handleChange(value);
        this.handleFocus();
    }
    handleFocus(e){
        super.handleFocus(e);
        if(this.props.show_picker && this.props.show_picker_on_focus) this.setState({'isFocused':true});
    }
    handleBlur(e){
        super.handleBlur(e);
        if(this.state.value) {
            let vs = this._getValues();
            vs.year = this._fix_year(vs.year);
            this.setValue(this.normalizeDate(vs));
            this.doValidate();
        }
        this.hidePicker(200);
        //this.setState({'isFocused':false});
    }
    handleNextMonth(e){
        e.stopPropagation();
        this._clearTimeout();
        let vs = this._getValues();
        if(!vs.month ) vs.month = 1;
        else if(vs.month == 12){vs.year++;vs.month=1;}
        else vs.month++;
        this.setValue(this.normalizeDate(vs));
    }
    handlePrevMonth(e){
        e.stopPropagation();
        this._clearTimeout();
        let vs = this._getValues();
        if(!vs.month ) vs.month = 12;
        else if(vs.month == 1){vs.year--;vs.month=12;}
        else vs.month--;
        this.setValue(this.normalizeDate(vs));
    }
    handleNextAndPrev(tp,e){
        e.stopPropagation();
        this._clearTimeout();

        if(this.getOnPicker()=='years'){
            this.handleChangeYear(tp,e);
        }else if(this.getOnPicker()=='months'){
            if(tp > 0) this.handleNextMonth(e);
            else this.handlePrevMonth(e);
        }else if(this.getOnPicker()=='days'){
            this.handleChangeDay(tp,e);
        }
    }
    handleChangeDay(st,e){
        e.stopPropagation();
        this._clearTimeout();
        let vs = this._getValues();
        vs.day = vs.day + st;
        this.setValue(this.normalizeDate(vs));
    }
    handleChangeYear(st,e){
        e.stopPropagation();
        this._clearTimeout();
        let vs = this._getValues();
        if(!vs.year ) vs.year = this._getCurrentYear();
        vs.year = vs.year + st;
        this.setValue(this.normalizeDate(vs));
    }
    handlePickerMonthSelect(mn,e){
        e.stopPropagation();
        this._clearTimeout();
        //this.setState({'isFocused':true});
        let dt = this._getValues();
        if(!dt.year) dt.year = this._getCurrentYear();
        dt.month = mn;
        this.setDate(dt.year,dt.month,dt.day);
        //if(this.props.closeOnSelect) {
            if(this.props.show_day) this.setOnPicker('days');
            else if(this.props.closeOnSelect){
                this.focus();
                this.unFocusPicker();
                this.doValidate();
            }
        //}
    }
    handlePickerYearSelect(y,e){
        e.stopPropagation();
        this._clearTimeout();

        //this.setState({'isFocused':true});
        let dt = this._getValues();
        dt.year = y;
        this.setDate(dt.year,dt.month,dt.day);
        if(this.props.show_month) this.setOnPicker('months');
        else if(this.props.show_day) this.setOnPicker('days');
        else if(this.props.closeOnSelect){
            this.focus();
            this.unFocusPicker();
            this.doValidate();
        }
    }
    handlePickerDaySelect(d,e){
        e.stopPropagation();
        this._clearTimeout();
        //this.setState({'isFocused':true});
        let dt = this._getValues();
        dt.day = d;
        this.setDate(dt.year,dt.month,dt.day);
        if(this.props.closeOnSelect){
            this.focus();
            this.unFocusPicker();
            this.doValidate();
        }
    }
    handleMouseOut(){
        this.hidePicker();
    }
    handleMouseOver(){
        this._clearTimeout();
    }

    getMonthName(m){
        let y = this._getValues().year;
        if(!y) y = this._getCurrentYear();
        let name = this._isJalali(y) ? 'ja' : 'go';

        return this._names[name].m[m-1];
    }
    _render_month_name(dt,m){
        if(!dt.year) dt.year = this._getCurrentYear();
        let name = this._isJalali(dt.year) ? 'ja' : 'go';
        let cls = 'picker__day picker__day--infocus';
        if(m+1 == dt.month) cls += ' picker__day--today picker__day--highlighted';
        return <div className={cls} onClick={this.handlePickerMonthSelect.bind(this,m+1)}>{this._names[name].m[m]}</div>;
    }
    _render_year(y,inactive){
        let dt = this._getValues();
        if(!dt.year) dt.year = this._getCurrentYear();
        let cls = inactive ? 'picker__day picker__day--outfocus':'picker__day picker__day--infocus';
        if(y == dt.year) cls += ' picker__day--today picker__day--highlighted';
        return <div className={cls} onClick={this.handlePickerYearSelect.bind(this,y)}>{y}</div>;
    }
    _render_day(d,inactive){
        let dt = this._getValues();
        if(!dt.year) dt.year = this._getCurrentYear();
        let cls = inactive ? 'picker__day picker__day--outfocus':'picker__day picker__day--infocus';
        if(d == dt.day) cls += ' picker__day--today picker__day--highlighted';
        return <div className={cls} onClick={this.handlePickerDaySelect.bind(this,d)}>{d}</div>;
    }

    render_month_names(){
        let dt = this._getValues();
        //let name = this._isJalali(dt.year) ? 'ja' : 'go';
        return(
            <table className="picker__table months"><tbody>
                <tr>
                    <td>{this._render_month_name(dt,0)}</td>
                    <td>{this._render_month_name(dt,1)}</td>
                    <td>{this._render_month_name(dt,2)}</td>
                </tr>
                <tr>
                    <td>{this._render_month_name(dt,3)}</td>
                    <td>{this._render_month_name(dt,4)}</td>
                    <td>{this._render_month_name(dt,5)}</td>
                </tr>
                <tr>
                    <td>{this._render_month_name(dt,6)}</td>
                    <td>{this._render_month_name(dt,7)}</td>
                    <td>{this._render_month_name(dt,8)}</td>
                </tr>
                <tr>
                    <td>{this._render_month_name(dt,9)}</td>
                    <td>{this._render_month_name(dt,10)}</td>
                    <td>{this._render_month_name(dt,11)}</td>
                </tr>
            </tbody></table>
        );
    }
    render_years(){
        let dt = this._getValues();
        let start_date = this._getCurrentYear();
        let fix_date = start_date.toString().substr(0,3)+"0";
        if(!dt.year) dt.year = this._getCurrentYear();
        if(this._isJalali(dt.year)){
            fix_date = "1390";
        }
        if(dt.year.toString().length < 4){
            dt.year = dt.year.toString() + fix_date.substr(dt.year.toString().length);
        }
        start_date = parseInt(dt.year.toString().substr(0,3)+"0")-1;
        return(
            <table className="picker__table months"><tbody>
            <tr>
                {/*<td>{this._render_year(start_date++,true)}</td>*/}
                <td><a className="picker__day picker__day--outfocus" onClick={this.handleChangeYear.bind(this,-10)}><Icon icon="angle-double-right" /> {start_date++}</a></td>
                <td>{this._render_year(start_date++)}</td>
                <td>{this._render_year(start_date++)}</td>
            </tr>
            <tr>
                <td>{this._render_year(start_date++)}</td>
                <td>{this._render_year(start_date++)}</td>
                <td>{this._render_year(start_date++)}</td>
            </tr>
            <tr>
                <td>{this._render_year(start_date++)}</td>
                <td>{this._render_year(start_date++)}</td>
                <td>{this._render_year(start_date++)}</td>
            </tr>
            <tr>
                <td>{this._render_year(start_date++)}</td>
                <td>{this._render_year(start_date++)}</td>
                <td><a className="picker__day picker__day--outfocus" onClick={this.handleChangeYear.bind(this,10)}>{start_date++} <Icon icon="angle-double-left" /></a></td>
                {/*<td>{this._render_year(start_date++,true)}</td>*/}
            </tr>
            <tr>
            </tr>
            </tbody></table>
        );
    }
    render_days(){
        let dt = this._getValues();
        let name = this._isJalali(dt.year) ? 'ja' : 'go';
        let days = this._names[name]['d'][dt.month-1];
        let weeks = Math.ceil(days / 7);
        let tbody = [];
        for(let w = 0; w < weeks;w++){
            let dd = 0;
            let tr = [];
            for(let d = w*7 ; dd < 7 && d < days;d++,dd++){
                tr.push(
                    React.DOM.td({key:'d_'+w+'_'+d},this._render_day(d+1))
                );
            }
            tbody.push(React.DOM.tr({key:'w_'+w},tr));
        }
        return React.DOM.table({key:'days_table',className:'picker__table days'}, [
            React.DOM.tbody({key:'days_tbody'},tbody)
        ]);
    }
    render_part(){
        //console.log(this.getOnPicker());
        if(this.getOnPicker() == 'years'){
            return this.render_years();
        }else if(this.getOnPicker() == 'months'){
            return this.render_month_names();
        }
        return this.render_days();
    }
    render_input_day(){
        let dt = this._getValues();
        let name = this._isJalali(dt.year) ? 'ja' : 'go';
        let items = this._names[name].d[dt.month-1];

        return <select defaultValue={dt.day} className="form-control pl-5 pr-5" tabIndex="992"
                       onFocus={()=>{this._clearTimeout();}}
                       onChange={(e)=>{
                            this.handlePickerDaySelect(e.target.value,e);
                           // this.setDate(dt.year,e.target.value,dt.day);
                       }}
                       style={{width:50,maxHeight:200}} >
            {[...Array(items).keys()].map((i,k)=>{
                return <option key={'mpop'+k} value={k +1}>{k+1}</option>;
            })}
        </select>;
    }
    render_input_month(){
        let dt = this._getValues();
        let name = this._isJalali(dt.year) ? 'ja' : 'go';
        let items = this._names[name].m;
        return <select defaultValue={dt.month} className="form-control pl-5 pr-5" tabIndex="991"
                       onFocus={()=>{this._clearTimeout();}}
                       onChange={(e)=>{
                            if(e.target.value >= 1) this.handlePickerMonthSelect(e.target.value,e);
                           // this.setDate(dt.year,e.target.value,dt.day);
                       }}
                       placeholder={i18n._('month')}
                       style={{width:90}} >
            <option value={0}>{i18n._('month')}</option>
            {items.map((i,k)=>{
                return <option key={'mpop'+k} value={k +1}>{i}</option>;
            })}
        </select>;
    }
    render_input_year(){
        let dt = this._getValues();
        //if(!dt.year) dt.year = this._getCurrentYear();
        let handleOnBlur = (e)=>{
            let dt = this._getValues();
            let year = dt.year!='' ? this._fix_year(dt.year) : '';
            if(dt.year != year) {
                this.setDate(year, dt.month, dt.day);
            }
        };

        return <input type="number" value={dt.year} className="form-control pl-5 pr-5 " tabIndex="990"
                       min={0} max={3000}
                       placeholder={i18n._('year')/*this._getCurrentYear()*/}
                       onFocus={()=>{this._clearTimeout();}}
                       onBlur={handleOnBlur.bind(this)}
                       onKeyDown={(e)=>{
                           //console.log(e.keyCode,e.target.value);
                           if(e.keyCode==46){//Delete key
                               if(e.target.value==''){
                                   this.setValue('');
                               }
                           }
                       }}
                       onChange={(e)=>{
                            let val = e.target.value;
                            //if(val!='' && val <= 1) val = this._getCurrentYear();
                           //console.log(val);
                            if(val){
                                this.handlePickerYearSelect(val,e);
                            }else{
                                this.handlePickerYearSelect(13,e);
                                //this.handlePickerYearSelect(0,e);
                                //let dt = this._getValues();
                                //this.handleChange(''+'-'+dt.month+'-'+dt.day);
                            }
                           this.setOnPicker('years');
                           // this.setDate(dt.year,e.target.value,dt.day);
                       }}
                      style={{width:60}} maxLength="4" />;
    }
    render_clear_button(){
        let props = this.props.clear_button;
        if(props && props.show!==false){
            let checked = this.isReadonly();//this.state.value == '';
            return <SpCheckbox checked={checked} label={props.label} onChange={(v1,v2)=>{
                this._clearTimeout();
                if(v2 == true){
                    this.setValue('');
                    this.setReadonly(true);
                }else{
                    this.setReadonly(false);
                }
                if(typeof props.onChange=='function') props.onChange.call(this,v1,v2);
            }}/>
        }
        return null;
    }
    render_picker(){
        /*let vs = this._getValues();
        if(!vs.year) vs.year = this._getCurrentYear();
        if(!vs.month) vs.month = 1;
        if(!vs.day) vs.day = 1;*/
        return (
            <div className="picker picker--focused picker--opened" onMouseOut={this.handleMouseOut.bind(this)} onMouseOver={this.handleMouseOver.bind(this)} ref="_picker">
                {this.render_picker_error()}
                <div className="picker__holder">
                    <div className="picker__frame">
                        <div className="picker__wrap">
                            <div className="picker__box no-padding">
                                {!this.isReadonly() && <div className="picker__header pt-10 pb-10">
                                    <table dir="ltr" cellPadding="0" cellSpacing="0" style={{margin:'auto'}}><tbody><tr>
                                    {this.props.show_day && <td className="picker__month valign-middle">
                                        {/*this.getMonthName(vs.month)*/}
                                        {this.render_input_day()}
                                    </td> || null}
                                    {this.props.show_month && <td className="picker__month valign-middle">
                                        {/*this.getMonthName(vs.month)*/}
                                        {this.render_input_month()}
                                    </td> || null}
                                    {this.props.show_year && <td className="picker__year valign-middle">
                                        {/*vs.year*/}
                                        {this.render_input_year()}
                                    </td> || null}
                                    </tr></tbody></table>
                                    <div className="picker__nav--prev" onClick={this.handleNextAndPrev.bind(this,-1)}> </div>
                                    <div className="picker__nav--next" onClick={this.handleNextAndPrev.bind(this,1)}> </div>
                                </div> || null}
                                {!this.isReadonly() && this.render_part() || null}
                                <div className="picker__footer pt-10 pb-5 pl-10 pr-10">
                                    {this.render_clear_button()}
                                    <div className="clear"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    render_picker_error(){
        if(!this.state.validate){
            let className = classNames({
                //['visible-xs']:true,
                ['sp-input-tip']:true,
                ['sp-input-tip-top-caret']:false,
            });
            return <div className={className} style={{maxWidth:288}}>
                <div className="sp-input-tip-text sp-input-tip-danger">
                     {this.state.validate_msg}
                </div>
            </div>
        }
        return false;
    }
    render_tip_error(){
        if(this.state.isFocused  && this._show_picker()){
            return null;
        }
        return super.render_tip_error();
    }

    render(){
        this.state.mask = this._get_mask_pattern();
        /*console.log(this.value());
         return this.renderElement(
            <MaskInput className="form-control ltr text-align" mask={pattern} cleanMode={true} value={this.value()}  />
        );*/
        if(this._show_picker()) {
            let input = <div style={{position:'relative'}}>
                {this.render_input()}
                <div className="clear"></div>
                {this.state.isFocused && this.render_picker() || null}
            </div>;

            if(this.isCleanMode()){
                return input;
            }else {
                return this.renderElement(input);
            }
        }
        return super.render();
    }


};