# react_json_form
A easy and scalable form builder and validator with **JSON** or **Object** for **React JS**, Dynamically
> **Note:** this code is not completly move and some feature are disabled for now, working on it

## Background
one year ago i worked on project with multiple forms and various and customizable inputs, i try to make easy way to generate form and handle it with ReactJS and JSON/Object and BS3. the result of that was this component.
this code is not completely on NPM, _working on free time_                                                                                        
## What You Can Do
 1. generate easy form with json or object
 2. handle ajax or html submit
 3. validator and easy way to add your custom validation
 4. multiple type support and easy way to add your custom type
 5. jquery ajax support

## all form props
here is supported props of form in main component

```jsx
{
        cache_form:true,
        result : {},
        fields : {},
        autoGenerator:true,
        autoFocus:true,
        autoScroll:false,
        validateAll:true,
        autoHandleError:true,
        handleSubmit:undefined, // submit function
        toggleFormOnValid:true, //toggle Form On Success
        cols: 2,
        step:1, // multi step support with fields array, [future support]
        ajax: true,
        method:'post', // form method
        ajaxSetting:{cache:false,contentType:false,processData:false},
        data:{},
        sendAs:'json', // ajax from send data type FormData or json
        submit:{
            label:'submit',
            className:'btn btn-success ml-10'
        },
        reset:false/*{
            className:'btn btn-default ml-10',
            label:'reset'
        }*/,
        init:{}, //init form data from server with ajax, json or callback
        then: function(data){},
        catch: function(err){}
    }
```
## all input props
here is supported base input props base input component, _some of input types has own custom props_

```jsx
{
        value : '', //defualt input value
        //dir:'auto',
        iconText:null,
        icon:null,
        tabIndex:"0",
        autoComplete:"off",
        cleanMode:false,
        mode:'text',
        validate:true,
        rules: {},
        tip: '\u00a0',
        required: false,
        className: 'form-control',
        formgroup: null,
        validateOnChange: true,
        validateOnBlur: true,
        validateOnHide: false,
        floatingLabel: false,
        showLabel: true,
        show: true,
        submitByEnter: true,
        readonly: false,
        /*lifecycle methods override to use */
        onUpdate:function(prevProps,prevState){},
        onUpdating:function(prevProps,prevState){},
        onChange:function(old_value,new_value){},
        onValidating:function(){},
        onValidated:function(v){},
        onUnmount:function(){},
        onReceiveProps:function(nextProps){},
        onMount:function(){}
    }
```
## supported types for now
all supported types exist in [types](src/components/form/types) dir and define in [index.js](src/components/form/types/index.js) see it. 
### base component
1. [input](src/components/form/types/input.js)
1. [hidden](src/components/form/types/hidden.js)
1. [numerical](src/components/form/types/numerical.js)
1. [password](src/components/form/types/password.js)
1. [range](src/components/form/types/range.js)
1. [checkbox](src/components/form/types/checkbox.js)
2. [radio](src/components/form/types/radio.js)
2. [select](src/components/form/types/select.js)
2. [static](src/components/form/types/static.js)
2. [textarea](src/components/form/types/textarea.js)

### advanced component
1. [autocomplete](src/components/form/types/autocomplete.js) - base on jquery https://github.com/devbridge/jQuery-Autocomplete
1. [autocompletex](src/components/form/types/autocompletex.js) - extend of autocomplete
1. [autocompletex2](src/components/form/types/autocompletex2.js) - extend of autocomplete
1. [bs-select](src/components/form/types/bs-select.js) - boostrap 3 select
1. [captcha](src/components/form/types/captcha.js) - disable for now
1. [google-map](src/components/form/types/google-map.js) - disable for now
1. [inline-date](src/components/form/types/inline-date.js)
1. [mask](src/components/form/types/mask.js) - jquery formatter
1. [mail](src/components/form/types/mail.js) - mail with autocomplete support with @
1. [pincode](src/components/form/types/pincode.js) - get pin code
1. [proficiency](src/components/form/types/proficiency.js) - select proficiency in number of stars or ...
1. [select2](src/components/form/types/select2.js) - jquery select2
1. [sp-checkbox](src/components/form/types/sp-checkbox.js) - custom checkbox
1. [sp-radio](src/components/form/types/sp-radio.js) - custom radio
1. [tags](src/components/form/types/tags.js) - select tag with order and ajax support
1. [texteditor](src/components/form/types/texteditor.js) - simple WYSIWYG with markdown support
1. [upload](src/components/form/types/upload.js) - dropbox upload and crop image support, disable for now


## validator
here is the current input validator, you can add your own validator with callback function on input or change the [validator]((src/components/form/validator.js)) file
1. matchTo: other input name for matching (exp. two password match and ...)
1. between: check value is in range of two numbers (exp. [1,10])
1. max: number maximum
1. min: number minimum
1. maxLen: string maximum lenght
1. minLen: string minimum lenght
1. numeric: value must be numerical
1. required: value is required and can't be empty
1. phone: check phone format
1. mobile: check mobile phone format
1. date: check date format
1. email: check email format (default active in [mail](src/components/form/types/mail.js) component)
1. _set your role with callback for checking_

### how to use validator
```jsx
    name: {type:'text',label:'required value',rules:{required:true,minLen:1}}
    age: {type:'number',label:'age',rules:{between:[10,99]}}
    
```
password checking with matchTo
```jsx
    'Pwd': {type:'password',mode:'password',rules:{required:true,minLen:3},'password'},
    'Pwd2': {type:'password',mode:'password',rules:{required:true,matchTo:'Pwd2'},label:'repeat password'},
    
```

## How to use
See [demo](src/demo) folder for examples
Complete API reference is available _soon_

### use with props
```jsx
import Form from 'src/components/form/';

let props = {
        cols: 1,
        ajax: true,
        autoGenerator: true,
        autoFocus: true,
        validateAll: true,
        action: '/users/login.json',
        fields: {
            'username': {type:'login',label:'username',placeholder:'email or phone number',value:''},
            'password': {type:'password',mode:'password',rules:{required:true},icon:'key', placeholder:'password', label:'password',value:''}
        }
    };
const MyForm = () => (
    <Form {...props} />
)
```
example of extend use
```jsx 
import appForm from 'src/components/form';
export default class Form1 extends appForm {
    static defaultProps= {
        ...appForm.defaultProps,
        cols: 1,
        ajax: true,
        autoGenerator: true,
        autoFocus: true,
        validateAll: true,
        action: '/users/login.json',
        fields: {
            'username': {type:'login',label:'username',placeholder:'email or phone number',value:''},
            'password': {type:'password',mode:'password',rules:{required:true},icon:'key', placeholder:'password', label:'password',value:''}
        }
    };
}
<Form1>
    this is form title
    {/*form input generte here*/}
</Form1>
```

## images
![login page](https://github.com/Na5a/react_json_form/raw/master/public/images/login.png)
![form2](https://github.com/Na5a/react_json_form/raw/master/public/images/form2.png)

