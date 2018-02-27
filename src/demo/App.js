import React, { Component } from 'react';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
//import { createBrowserHistory } from 'history';

import Forms from './forms/';
import Form1 from './forms/Form1';

const PrimaryLayout = () => (
    <div className="primary-layout">
        <Switch>
            <Route exact path="/" component={Forms} />
            <Route exact path="/form1" component={Form1} />
            <Redirect to="/" />
        </Switch>
    </div>
);
class App extends Component {
    render_child(){
        return   <Router>
            <PrimaryLayout />
        </Router>
    }
    render_child_(){
        return   <Router>
            <Route path="/" >
                <Route path="form1" component={Form1} />
                {/*<Route path="inbox" component={Inbox}>
                    <Route path="messages/:id" component={Message} />
                </Route>*/}
            </Route>
        </Router>;
    }
    render_nav() {
        return <nav className="navbar navbar-inverse">
            <div className="container">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand" href="#">ReactJsonForm</a>
                </div>
                <div id="navbar" className="collapse navbar-collapse">
                    <ul className="nav navbar-nav">
                        <li className="active"><a href="#">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>
            </div>
        </nav>;

    }
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    {this.render_nav()}
                </header>
                <div className="container">
                  {this.render_child()}
                </div>
              </div>
            );
    }
}

export default App;
