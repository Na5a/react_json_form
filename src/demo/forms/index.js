import React, { Component } from 'react';
import { Link } from 'react-router-dom'

const FormIndex = (props) => (
    <div>
        <h2>DEMO list</h2>
        <ul>
            <li><Link to="/form1">form1 - </Link></li>
            <li><Link to="/form2">form2 - </Link></li>
        </ul>
        <div>{props.children}</div>
    </div>
);


export default FormIndex;