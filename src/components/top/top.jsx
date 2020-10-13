import React, { Component } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './top.less'
import { Icon, message, Menu, Dropdown } from 'antd'
import { setSession, getSession } from '../../utils/storage'
import people from './images/people.png'
import Logo from './images/logo.png'

const menu = (
    <Menu>
        <div className='inner_menu' style={{ width: '88%', marginLeft: '0.5vw', marginTop: '0.5vw' }}>
            <Menu.Item className='inner_menu_item'>
                <NavLink to='/projectManagement' activeClassName="my_son_active"><span>总览</span></NavLink>
            </Menu.Item>
            <Menu.Item className='inner_menu_item'>
                <NavLink to='/projectDistribution' activeClassName="my_son_active"><span>项目分布</span></NavLink>
            </Menu.Item>
            <Menu.Item className='inner_menu_item'>
                <NavLink to='/projectList' activeClassName="my_son_active"><span>项目列表</span></NavLink>
            </Menu.Item>
        </div>
    </Menu>
)

//路由组件
export default class Top extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: 1,
            userName: null,
        }
    }
    componentWillMount() {
        let userInfo = getSession("userInfo")
        if (userInfo) {
            this.setState({
                userName: userInfo.loginName
            })
        }
    }

    // 登出
    loginOut() {
        if (sessionStorage.getItem('userInfo')) {
            sessionStorage.removeItem('userInfo')
            this.jumpTo('login')   //退出登陆后调取该方法
        }
    }
    // 权限
    getPermission = (code, typeSet) => {
        let userInfo = sessionStorage.getItem("userInfo")
        let userPermission = userInfo ? JSON.parse(userInfo).permissionList : null
        if (code && !typeSet) {
            return userPermission && userPermission.some(item => item.permissionCode == code)
        } else if (code && typeSet) {
            let permissionArr = userPermission && userPermission.filter(item => item.permissionCode == code)
            return permissionArr.length > 0 && permissionArr[0].typeSet.some(item => item == typeSet)
        }
    }
    // 无权限提示
    disabledClick = (e) => {
        e.preventDefault()
        message.warning('你没有此权限')
    }
    // 项目跳转
    jumpTo = (url) => {
        window.location.href = `/#/${url}`
    }
    render() {
        const { type, userName } = this.state
        return <div className="app-header">
            <div className="header-nav-list-left">
                <ul>
                    {
                        this.getPermission('sy') ?
                            <li><Link onClick={this.jumpTo.bind(this, 'homePage')} activeClassName="active-left-home">首页</Link></li>
                            : <li><Link onClick={this.disabledClick.bind(this)}>首页</Link></li>
                    }
                    {
                        this.getPermission('cysjtj') ?
                            <li><Link onClick={this.jumpTo.bind(this, 'homePage')} activeClassName="active-left-home">产业数据统计</Link></li>
                            : <li><Link onClick={this.disabledClick.bind(this)}>产业数据统计</Link></li>
                    }
                    {
                        this.getPermission('yxxt') ?
                            <li className="pos-r">
                                <Link activeClassName="active-left-home">
                                    营销系统&nbsp;<i className="iconfont icon-xiangxia"></i></Link>
                                <ul className="header-nav-sublist">
                                    {
                                        this.getPermission('ykhx') ?
                                            <Link onClick={this.jumpTo.bind(this, 'data/tripData')} activeClassName="active-left-item">游客画像</Link>
                                            : <Link onClick={this.disabledClick.bind(this)}>游客画像</Link>
                                    }
                                    {
                                        this.getPermission('ykxftj') ?
                                            <Link onClick={this.jumpTo.bind(this, 'data/consumptionData')} activeClassName="active-left-item">游客消费统计</Link>
                                            : <Link onClick={this.disabledClick.bind(this)}>游客消费统计</Link>
                                    }
                                    {
                                        this.getPermission('dsjbg') ?
                                            <Link onClick={this.jumpTo.bind(this, 'data/bigDataReport')} activeClassName="active-left-item">大数据报告</Link>
                                            : <Link onClick={this.disabledClick.bind(this)}>大数据报告</Link>
                                    }

                                </ul>
                            </li>
                            :
                            <li className="pos-r">
                                <Link onClick={this.disabledClick.bind(this)}>营销系统&nbsp;<i className="iconfont icon-xiangxia"></i></Link>
                            </li>
                    }
                    {
                        this.getPermission('yqjc') ?
                            <li className="pos-r">
                                <Link activeClassName="active-left-home" onClick={this.jumpTo.bind(this, 'publicOpinion')}>
                                    舆情监测&nbsp;<i className="iconfont icon-xiangxia"></i></Link>
                                <ul className="header-nav-sublist">
                                    {
                                        this.getPermission('yqjc_yqzhjc') ?
                                            <Link onClick={this.jumpTo.bind(this, 'publicOpinion/integrated')} activeClassName="active-left-item">舆情综合监测</Link>
                                            : <Link onClick={this.disabledClick.bind(this)}>舆情综合监测</Link>
                                    }
                                    {
                                        this.getPermission('yqjc_yqztjc') ?
                                            <Link onClick={this.jumpTo.bind(this, 'publicOpinion/thematic')} activeClassName="active-left-item">舆情专题监测</Link>
                                            : <Link onClick={this.disabledClick.bind(this)}>舆情专题监测</Link>
                                    }
                                    {
                                        this.getPermission('ykmyd') ?
                                            <Link onClick={this.jumpTo.bind(this, 'publicOpinion/satisfaction')} activeClassName="active-left-item">游客满意度</Link>
                                            : <Link onClick={this.disabledClick.bind(this)}>游客满意度</Link>
                                    }
                                </ul>
                            </li>
                            :
                            <li className="pos-r">
                                <Link onClick={this.disabledClick.bind(this)}>舆情监测</Link>
                            </li>
                    }
                    {
                        this.getPermission('hyjg') ?
                            <li><Link onClick={this.jumpTo.bind(this, 'industryRegulations')} activeClassName="active-left-home">行业监管</Link></li>
                            : <li><Link onClick={this.disabledClick.bind(this)}>行业监管</Link></li>
                    }


                    {/* <li><NavLink to="/projectList" activeClassName="active-left-home">首页</NavLink></li>
                    <li><NavLink to="/videoSurveillance" activeClassName="active-left">产业数据统计</NavLink></li>
                    <li className="pos-r">
                        <NavLink onClick={(e) => {
                            e.preventDefault();
                        }} activeClassName="active-left" to="/videoSurveillance">
                            营销系统&nbsp;<i className="iconfont icon-xiangxia"></i></NavLink>
                        <ul className="header-nav-sublist">
                            <NavLink to="/projectManagement" activeClassName="active-left-item">游客画像</NavLink>
                            <NavLink to="/projectDistribution" activeClassName="active-left-item">游客消费统计</NavLink>
                            <NavLink to="/projectList" activeClassName="active-left-item">大数据报告</NavLink>
                        </ul>
                    </li>
                    <li><NavLink to="/videoSurveillance" activeClassName="active-left">舆情监测</NavLink></li>
                    <li><NavLink to="/videoSurveillance" activeClassName="active-left">行业监管</NavLink></li> */}


                    {/* {
                            this.getPermission('xmgl') ?
                                <li className="pos-r">
                                    <NavLink activeClassName="active" to="/projectManagement">
                                        项目管理&nbsp;<i className="iconfont icon-xiangxia"></i></NavLink>
                                    <ul className="header-nav-sublist">
                                        {
                                            this.getPermission('xmgl_zl') ?
                                                <NavLink to="/projectManagement" activeClassName="active-item">总览</NavLink>
                                                : <Link onClick={this.disabledClick.bind(this)}>总览</Link>
                                        }
                                        {
                                            this.getPermission('xmgl_xmfb') ?
                                                <NavLink to="/projectDistribution" activeClassName="active-item">项目分布</NavLink>
                                                : <Link onClick={this.disabledClick.bind(this)}>项目分布</Link>
                                        }
                                        {
                                            this.getPermission('xmgl_xmlb') ?
                                                <NavLink to="/projectList" activeClassName="active-item">项目列表</NavLink>
                                                : <Link onClick={this.disabledClick.bind(this)}>项目列表</Link>
                                        }

                                    </ul>
                                </li>
                                :
                                <li className="pos-r">
                                    <Link onClick={this.disabledClick.bind(this)}>项目管理&nbsp;<i className="iconfont icon-xiangxia"></i></Link>
                                </li>
                        }
                        {
                            this.getPermission('yjzh') ?
                                <li><NavLink to="/emergencyCenter" activeClassName="active">应急指挥</NavLink></li>
                                : <li><Link onClick={this.disabledClick.bind(this)}>应急指挥</Link></li>
                        }
                        {
                            this.getPermission('spjk') ?
                                <li><NavLink to="/videoSurveillance" activeClassName="active">视频监控</NavLink></li>
                                : <li><Link onClick={this.disabledClick.bind(this)}>视频监控</Link></li>
                        }
                        {
                            this.getPermission('spjk') ?
                                <li><NavLink to="/videoSurveillance" activeClassName="active">数据中心</NavLink></li>
                                : <li><Link onClick={this.disabledClick.bind(this)}>数据中心</Link></li>
                        } */}
                    {/* {
                    this.getPermission('yqjc') ? 
                        <li className="pos-r">
                            <Link activeClassName="active" onClick={this.jumpTo.bind(this,'publicOpinion')}>
                                舆情监测&nbsp;<i className="iconfont icon-xiangxia"></i></Link>
                            <ul className="header-nav-sublist">
                                {
                                    this.getPermission('yqjc_yqzhjc') ?
                                        <Link onClick={this.jumpTo.bind(this, 'publicOpinion/integrated')} activeClassName="active">舆情综合监测</Link>
                                        :<Link onClick={this.disabledClick.bind(this)}>舆情综合监测</Link>
                                }
                                {
                                    this.getPermission('yqjc_yqztjc') ?
                                        <Link onClick={this.jumpTo.bind(this, 'publicOpinion/thematic')} activeClassName="active">舆情专题监测</Link>
                                        : <Link onClick={this.disabledClick.bind(this)}>舆情专题监测</Link>
                                }
                                
                            </ul>
                        </li>
                        :
                        <li className="pos-r">
                            <Link onClick={this.disabledClick.bind(this)}>舆情监测</Link>
                        </li>
                }
                
                {
                    this.getPermission('dsjfx') ?
                        <li className="pos-r">
                            <Link activeClassName="active"  onClick={this.jumpTo.bind(this, 'data')}>
                                大数据分析&nbsp;<i className="iconfont icon-xiangxia"></i></Link>
                            <ul className="header-nav-sublist">
                                {
                                    this.getPermission('dsjfx_lyzhjc') ?
                                        <Link onClick={this.jumpTo.bind(this, 'data/touristData')} activeClassName="active">旅游综合监测</Link>
                                        : <Link onClick={this.disabledClick.bind(this)}>旅游综合监测</Link>
                                }
                                {
                                    this.getPermission('dsjfx_lkcxdsj') ?
                                        <Link onClick={this.jumpTo.bind(this, 'data/tripData')} activeClassName="active">游客出行大数据</Link>
                                        : <Link onClick={this.disabledClick.bind(this)}>游客出行大数据</Link>
                                }
                                {
                                    this.getPermission('dsjfx_lyxfdsj') ?
                                        <Link onClick={this.jumpTo.bind(this, 'data/consumptionData')} activeClassName="active">游客消费大数据</Link>
                                        : <Link onClick={this.disabledClick.bind(this)}>游客消费大数据</Link>
                                }
                                {
                                    this.getPermission('dsjfx_lyxfdsj') ?
                                        <Link onClick={this.jumpTo.bind(this, 'data/publiCreditData')} activeClassName="active">旅游信用信息建设</Link>
                                        : <Link onClick={this.disabledClick.bind(this)}>旅游信用信息建设</Link>
                                }
                            </ul>
                        </li>
                        : <li className="pos-r">
                            <Link onClick={this.disabledClick.bind(this)}>大数据分析</Link>
                        </li>
                }
                {
                    this.getPermission('dsjzx') ?
                        <li><Link onClick={this.jumpTo.bind(this, 'dataCenter')} activeClassName="active">大数据中心</Link></li>
                        : <li><Link onClick={this.disabledClick.bind(this)}>大数据中心</Link></li>
                } */}

                </ul>
            </div>

            <img className="logo" src={Logo} alt="" />

            <div className="header-nav-list-right">
                <ul>
                    <li className="pos-r">
                        <NavLink onClick={(e) => {
                            e.preventDefault()
                        }} activeClassName="active-right" to="/projectManagement">
                            项目管理&nbsp;<i className="iconfont icon-xiangxia"></i></NavLink>
                        <ul className="header-nav-sublist">
                            <NavLink to="/projectManagement" activeClassName="active-right-item">总览</NavLink>
                            <NavLink to="/projectDistribution" activeClassName="active-right-item">项目分布</NavLink>
                            <NavLink to="/projectList" activeClassName="active-right-item">项目列表</NavLink>
                        </ul>
                    </li>
                    <li className="pos-r">
                        <NavLink onClick={(e) => {
                            e.preventDefault()
                        }} activeClassName="active-right" to="/emergencyCenter">
                            应急指挥&nbsp;<i className="iconfont icon-xiangxia"></i></NavLink>
                        <ul className="header-nav-sublist">
                            <NavLink to="/emergencyCenter" activeClassName="active-right-item">应急指挥</NavLink>
                            <NavLink to="/" activeClassName="active-right-item">疫情防控</NavLink>
                        </ul>
                    </li>
                    <li><NavLink to="/videoSurveillance" activeClassName="active-right">视频监控</NavLink></li>
                    <li><NavLink to="/videoSurveillance1" activeClassName="active-right">数据中心</NavLink></li>

                    {/* {
                        this.getPermission('xmgl') ?
                            <li className="pos-r">
                                <NavLink activeClassName="active-right" to="/projectManagement">
                                    项目管理&nbsp;<i className="iconfont icon-xiangxia"></i></NavLink>
                                <ul className="header-nav-sublist">
                                    {
                                        this.getPermission('xmgl_zl') ?
                                            <NavLink to="/projectManagement" activeClassName="active-right-item">总览</NavLink>
                                            : <Link onClick={this.disabledClick.bind(this)}>总览</Link>
                                    }
                                    {
                                        this.getPermission('xmgl_xmfb') ?
                                            <NavLink to="/projectDistribution" activeClassName="active-right-item">项目分布</NavLink>
                                            : <Link onClick={this.disabledClick.bind(this)}>项目分布</Link>
                                    }
                                    {
                                        this.getPermission('xmgl_xmlb') ?
                                            <NavLink to="/projectList" activeClassName="active-right-item">项目列表</NavLink>
                                            : <Link onClick={this.disabledClick.bind(this)}>项目列表</Link>
                                    }

                                </ul>
                            </li>
                            :
                            <li className="pos-r">
                                <Link onClick={this.disabledClick.bind(this)}>项目管理&nbsp;<i className="iconfont icon-xiangxia"></i></Link>
                            </li>
                    }
                    {
                        this.getPermission('yjzh') ?
                            <li className="pos-r">
                                <NavLink activeClassName="active-right" to="/emergencyCenter">
                                    应急指挥&nbsp;<i className="iconfont icon-xiangxia"></i></NavLink>
                                <ul className="header-nav-sublist">
                                    {
                                        this.getPermission('yjzh') ?
                                            <NavLink to="/emergencyCenter" activeClassName="active-right-item">应急指挥</NavLink>
                                            : <Link onClick={this.disabledClick.bind(this)}>应急指挥</Link>
                                    }
                                    {
                                        this.getPermission('/') ?
                                            <NavLink to="/" activeClassName="active-right-item">疫情防控</NavLink>
                                            : <Link onClick={this.disabledClick.bind(this)}>疫情防控</Link>
                                    }
                                </ul>
                            </li>
                            :
                            <li className="pos-r">
                                <Link onClick={this.disabledClick.bind(this)}>应急指挥&nbsp;<i className="iconfont icon-xiangxia"></i></Link>
                            </li>
                    }
                    {
                        this.getPermission('spjk') ?
                            <li><NavLink to="/videoSurveillance" activeClassName="active-right">视频监控</NavLink></li>
                            : <li><Link onClick={this.disabledClick.bind(this)}>视频监控</Link></li>
                    }
                    {
                        this.getPermission('dsjzx') ?
                            <li><Link onClick={this.jumpTo.bind(this, 'dataCenter')} activeClassName="active-right">数据中心</Link></li>
                            : <li><Link onClick={this.disabledClick.bind(this)}>数据中心</Link></li>
                    } */}

                    {/* {
                    this.getPermission('yqjc') ? 
                        <li className="pos-r">
                            <Link activeClassName="active" onClick={this.jumpTo.bind(this,'publicOpinion')}>
                                舆情监测&nbsp;<i className="iconfont icon-xiangxia"></i></Link>
                            <ul className="header-nav-sublist">
                                {
                                    this.getPermission('yqjc_yqzhjc') ?
                                        <Link onClick={this.jumpTo.bind(this, 'publicOpinion/integrated')} activeClassName="active">舆情综合监测</Link>
                                        :<Link onClick={this.disabledClick.bind(this)}>舆情综合监测</Link>
                                }
                                {
                                    this.getPermission('yqjc_yqztjc') ?
                                        <Link onClick={this.jumpTo.bind(this, 'publicOpinion/thematic')} activeClassName="active">舆情专题监测</Link>
                                        : <Link onClick={this.disabledClick.bind(this)}>舆情专题监测</Link>
                                }
                                
                            </ul>
                        </li>
                        :
                        <li className="pos-r">
                            <Link onClick={this.disabledClick.bind(this)}>舆情监测</Link>
                        </li>
                }
                
                {
                    this.getPermission('dsjfx') ?
                        <li className="pos-r">
                            <Link activeClassName="active"  onClick={this.jumpTo.bind(this, 'data')}>
                                大数据分析&nbsp;<i className="iconfont icon-xiangxia"></i></Link>
                            <ul className="header-nav-sublist">
                                {
                                    this.getPermission('dsjfx_lyzhjc') ?
                                        <Link onClick={this.jumpTo.bind(this, 'data/touristData')} activeClassName="active">旅游综合监测</Link>
                                        : <Link onClick={this.disabledClick.bind(this)}>旅游综合监测</Link>
                                }
                                {
                                    this.getPermission('dsjfx_lkcxdsj') ?
                                        <Link onClick={this.jumpTo.bind(this, 'data/tripData')} activeClassName="active">游客出行大数据</Link>
                                        : <Link onClick={this.disabledClick.bind(this)}>游客出行大数据</Link>
                                }
                                {
                                    this.getPermission('dsjfx_lyxfdsj') ?
                                        <Link onClick={this.jumpTo.bind(this, 'data/consumptionData')} activeClassName="active">游客消费大数据</Link>
                                        : <Link onClick={this.disabledClick.bind(this)}>游客消费大数据</Link>
                                }
                                {
                                    this.getPermission('dsjfx_lyxfdsj') ?
                                        <Link onClick={this.jumpTo.bind(this, 'data/publiCreditData')} activeClassName="active">旅游信用信息建设</Link>
                                        : <Link onClick={this.disabledClick.bind(this)}>旅游信用信息建设</Link>
                                }
                            </ul>
                        </li>
                        : <li className="pos-r">
                            <Link onClick={this.disabledClick.bind(this)}>大数据分析</Link>
                        </li>
                }
                {
                    this.getPermission('dsjzx') ?
                        <li><Link onClick={this.jumpTo.bind(this, 'dataCenter')} activeClassName="active">大数据中心</Link></li>
                        : <li><Link onClick={this.disabledClick.bind(this)}>大数据中心</Link></li>
                } */}

                </ul>
                <div className="user-info">
                    <Link onClick={this.jumpTo.bind(this, 'manager/userManager')} className="userName-color">
                        <img src={people} alt="" />
                        &nbsp;&nbsp;{userName}&nbsp;&nbsp;
                    </Link>
                    <a onClick={this.loginOut.bind(this)}><span>注销</span></a>
                </div>
            </div>


        </div>
    }
}

