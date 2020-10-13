import React, { Component } from "react"
import { Form, Icon, Input, Button, message } from 'antd'
import { hashHistory } from 'react-router'
import { login } from './../../services/login'
import { setSession } from './../../utils/storage'
import "./Login.scss"
import { getPermission } from './../../constants/permissions'
// import EchartMap from './../../components/Echarts/Map/Map';

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        let _this = this
        document.onkeydown = function (e) {
            var ev = document.all ? window.event : e
            if (ev.keyCode === 13) {
                _this.handleSubmit(e)
            }
        }
    }
    // 跳转注册页面
    quickRegiste() {
        hashHistory.push('registe')
    }

    // 洗数据以便存入session
    getDataToSession = (data) => {
        if (data) {
            let { permissionList, sysRole, sysUser } = data
            permissionList = permissionList && permissionList.length > 0 && permissionList.map(item => {
                return {
                    permissionCode: item.permissionCode,
                    typeSet: item.typeSet,
                    permissionName: item.permissionName
                }
            })
            sysRole = sysRole && sysRole.length > 0 && sysRole.map(item => {
                return {
                    roleId: item.roleId,
                    roleLevel: item.roleLevel,
                    roleName: item.roleName,
                    roleType: item.roleType
                }
            })
            let userInfo = {
                permissionList, // 权限列表
                sysRole: sysRole[0], // 角色
                loginName: sysUser.loginName // 用户名
            }
            return userInfo
        }
    }

    // 提交表单
    handleSubmit = e => {
        e.preventDefault()
        let that = this
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                login(values).then(res => {
                    let data = JSON.parse(JSON.stringify(res))
                    let userInfo = that.getDataToSession(data)
                    setSession('userInfo', userInfo)
                    message.success('登录成功！')
                    that.getPermission()
                    // hashHistory.push('publicOpinion/integrated');
                }).catch((err) => {
                    message.error(err.message)
                    // console.log(err);
                })
            }
        })
    };
    // 获取用户权限跳转不同页面
    getPermission = () => {
        if (getPermission('spjk')) {                                         // 视频监控权限
            location.href = '/bigdata/static/#/videoSurveillance'
        } else if (getPermission('yjzh')) {                                 // 应急指挥权限
            location.href = '/bigdata/static/#/emergencyCenter'
        } else if (getPermission('xmgl')) {                                 // 项目管理权限
            if (getPermission('xmgl_zl')) {                                  // 项目管理 => 总览
                location.href = '/bigdata/static/#/projectManagement'
            } else if (getPermission('xmgl_xmfb')) {                         // 项目管理 => 项目分布
                location.href = '/bigdata/static/#/projectDistribution'
            } else if (getPermission('xmgl_xmlb')) {                        // 项目管理 => 项目列表
                location.href = '/bigdata/static/#/projectList'
            }
        } else if (getPermission('yqjc')) {                                  // 舆情监测
            if (getPermission('yqjc_yqzhjc')) {                              // 舆情监测 => 综合监测
                hashHistory.push('publicOpinion/integrated')
            } else if (getPermission('yqjc_yqztjc')) {                       // 舆情监测 => 专题监测
                hashHistory.push('publicOpinion/thematic')
            }
        } else if (getPermission('dsjfx')) {                                // 大数据分析
            if (getPermission('dsjfx_lyzhjc')) {                            // 大数据分析 => 旅游综合检测
                hashHistory.push('data/touristData')
            } else if (getPermission('dsjfx_lkcxdsj')) {                    // 大数据分析 => 旅客出行大数据
                hashHistory.push('data/tripData')
            } else if (getPermission('dsjfx_lyxfdsj')) {                    // 大数据分析 => 游客消费大数据
                hashHistory.push('data/consumptionData')
            } else if (getPermission('dsjfx_lyxyxx')) {                     // 大数据分析 => 旅游信用信息
                hashHistory.push('data/publiCreditData')
            }
        } else if (getPermission('dsjzx')) {                                // 大数据中心
            hashHistory.push('dataCenter')
        } else {
            message.warning('请设置该用户权限!')
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div className="login_container">
                <div className="login_content">
                    <div className="line" />
                    <div className="login_left" />
                    <div className="login_right">
                        <h1 />
                        <div className="login_box">
                            <Form onSubmit={this.handleSubmit} className="login-form">
                                <Form.Item>
                                    {getFieldDecorator('loginName', {
                                        rules: [{ required: true, message: '请输入用户名!' }],
                                    })(
                                        <Input
                                            prefix={<Icon type="user" style={{ color: 'rgba(56,153,214,1)', fontSize: 20 }} />}
                                            placeholder="请输入用户名"
                                        />,
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: '请输入密码!' }],
                                    })(
                                        <Input
                                            prefix={<Icon type="safety-certificate" style={{ color: 'rgba(56,153,214,1)', fontSize: 20 }} />}
                                            type="password"
                                            placeholder="请输入密码"
                                        />,
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const CustomizedForm = Form.create({})(Login)
export default CustomizedForm