/*
    入口js
 */
import React from 'react';
import ReactDom from 'react-dom';
import App from './App';
import 'core-js/es'  
import 'react-app-polyfill/ie9'  
import 'react-app-polyfill/stable'
import "./assets/style/common.less";


//将App组件标签渲染到index页面的div上
ReactDom.render(<App/>, document.getElementById('root'));
