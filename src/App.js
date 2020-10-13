import React, {Component} from 'react';
import { BrowserRouter, HashRouter, Route, Switch} from 'react-router-dom';
import VideoSurveillance from './pages/videoSurveillance/videoSurveillance';
import EmergencyCenter from './pages/emergencyCenter/emergencyCenter';
import ProjectManagement from './pages/projectManagement/projectManagement';
import ProjectDistribution from './pages/projectDistribution/projectDistribution';
import ProjectList from './pages/projectList/projectList';
import ProjectDetails from './pages/projectDetails/projectDetails';
import AllWarningInfo from './pages/allWarningInfo/allWarningInfo';
import InsertProject from './pages/insertProject/insertProject';
import UpdateProject from './pages/updateProject/updateProject';
import AllPoliceInfo from './pages/allPoliceInfo/allPoliceInfo';
// import NotExist from './pages/notExist/404';
// import Login from './pages/Login/Login'

/*
    应用的根组件
 */
export default class App extends Component {
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route exact path="/" component={VideoSurveillance}/>
                    {/* 登录界面 */}
                    {/* <Route path='/login' component={Login}/> */}
                    <Route path='/videoSurveillance' component={VideoSurveillance}/>
                    <Route path='/emergencyCenter' component={EmergencyCenter}/>
                    <Route path='/projectManagement' component={ProjectManagement}/>
                    <Route path='/projectDistribution' component={ProjectDistribution}/>
                    <Route path='/projectList' component={ProjectList}/>
                    <Route path='/projectDetails/:id' component={ProjectDetails}/>
                    <Route path='/allWarningInfo' component={AllWarningInfo}/>
                    <Route path='/insertProject' component={InsertProject}/>
                    <Route path='/updateProject/:id' component={UpdateProject}/>
                    <Route path='/allPoliceInfo' component={AllPoliceInfo}/>
                    {/*当上述内容都不匹配时，将呈现<404>*/}
                    {/* <Route component={NotExist}/> */}
                </Switch>
            </HashRouter>
        )
    }
}
