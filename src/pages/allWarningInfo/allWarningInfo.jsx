import React, { Component } from 'react'
import Top from '../../components/top/top'
import { Button, Layout, Modal, message } from "antd"
import { Link } from 'react-router-dom'
import './allWarningInfo.less'
import moment from 'moment'
import 'moment/locale/zh-cn'
import redTip from "./images/call_police_1.png"
import yellowTip from "./images/call_police_2.png"
import blueTip from "./images/call_police_3.png"
import greenTip from "./images/call_police_4.png"
import blueTipWeather from '../emergencyCenter/images/call_police_5.png'
import {
    getPrincipalQueryAll,
    getSendCode,
    getEarlyWarningQueryAllTo
} from '../../api/emergencyCenter'
import axios from 'axios'
const { Content } = Layout

export default class AllWarningInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allWeatherInfo: [],     //所有的天气预警信息
            allTrafficInfo: [],
            weatherInfo: [],   //所有的交通预警信息
            allGeologicalEarlyInfo: [],
            color: '',
            color1: '',
            color2: '',
            color5: '',
            momentColor: '',
            momentColor1: '',
            momentColor2: '',
            momentColor5: '',
            backgroundColor: '',
            backgroundColor1: '',
            backgroundColor2: '',
            backgroundColor5: '',
            imgTip: '',
            imgTip1: '',
            imgTip2: '',
            imgTip5: '',
            visible3: false,
            visible4: false,
            visible5: false,
            info: '',
            info1: '',
            info5: '',
            timeNow: Date.parse(moment().format('YYYY-MM-DD HH:mm:ss')),
            time: '',
            time1: '',
            time5: '',
            latestGeologicalEarlyInfo: [],
            totalPhone: '',

            townName1: '',
            contractName1: '',
            contractPhone1: '',
        }
    }

    componentDidMount() {
        this.getWeatherInfo()
        this.timer = setInterval(
            () => {
                this.getWeatherInfo()
            }, 1000 * 60)
        this.getTrafficInfo()
        this.timer = setInterval(
            () => {
                this.getTrafficInfo()
            }, 1000 * 3600)
        this.getGeologicalEarlyInfo()
        this.timer = setInterval(
            () => {
                this.getGeologicalEarlyInfo()
            }, 1000 * 60)
        this.getTotalPhone()
        this.timer = setInterval(
            () => {
                this.getTotalPhone()
            }, 1000 * 60)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    showModal3 = (color, momentColor, backgroundColor, imgTip, info, time) => {
        this.setState({
            visible3: true,
            color: color,
            momentColor: momentColor,
            backgroundColor: backgroundColor,
            imgTip: imgTip,
            info: info,
            time: time
        })
    };
    showModal4 = (color, momentColor, backgroundColor, imgTip, info, time, townName, contractName, contractPhone) => {
        this.setState({
            visible4: true,
            color1: color,
            momentColor1: momentColor,
            backgroundColor1: backgroundColor,
            imgTip1: imgTip,
            info1: info,
            time1: time,
            townName1: townName,
            contractName1: contractName,
            contractPhone1: contractPhone,
        })
    };

    showModal5 = (color, momentColor, backgroundColor, imgTip, info, time) => {
        this.setState({
            visible5: true,
            color5: color,
            momentColor5: momentColor,
            backgroundColor5: backgroundColor,
            imgTip5: imgTip,
            info5: info,
            time5: time
        })
    };
    handleCancel3 = e => {
        this.setState({
            visible3: false,
        })
    };
    handleCancel4 = e => {
        this.setState({
            visible4: false,
        })
    };
    handleCancel5 = e => {
        this.setState({
            visible5: false,
        })
    };

    timeFormat = (x) => {
        let diff = moment(Date.now()).format('x') - moment(x).format('x')
        let days = moment.duration(diff).days()
        let hours = moment.duration(diff).hours()
        let minutes = moment.duration(diff).minutes()
        let seconds = moment.duration(diff).seconds()

        let result = ""
        if (days !== 0) {
            result += Math.abs(days) + "天"
        }
        if (hours !== 0) {
            result += Math.abs(hours) + "小时"
        }
        if (days === 0 && hours === 0 && minutes !== 0) {
            result += Math.abs(minutes) + "分钟"
        }
        if (diff > 0) {
            result += "前"
        } else if (diff < 0) {
            result += "后"
        }

        if (result === '前') {
            result = '刚刚'
        }
        return result
    }

    //获取天气预警信息
    getWeatherInfo = () => {
        axios({
            method: 'get',
            url: window.BaseUrl + '/EC/earlyWarningQueryAll',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {}
        }).then((response) => {
            let res = response.data
            const item = res.tqyj
            const time = []
            item.map((val, key) => {
                val.map((value, key) => {
                    time.push(value)
                })
            })
            this.setState({
                allWeatherInfo: time
            })
            const weatherInfo = this.state.allWeatherInfo.map((val, key) => {
                const temp = {}
                temp.info = val.value
                temp.id = key + 1
                temp.time = val.times
                temp.color = '#38B3FF'
                temp.momentColor = '#38B3FF'
                temp.backgroundColor = '#38B3FF'
                temp.imgTip = blueTipWeather
                // if (val.value.includes('黄色')) {
                //     temp.color = 'rgba(245,171,107,1)'
                //     temp.momentColor = 'rgba(245,171,107,0.94)'
                //     temp.backgroundColor = 'rgba(245,171,107,1)'
                //     temp.imgTip = yellowTip
                // } else if (val.value.includes('蓝色')) {
                //     temp.color = 'rgba(44,177,255,1)'
                //     temp.momentColor = 'rgba(44,177,255,0.94)'
                //     temp.backgroundColor = 'rgba(44,177,255,1)'
                //     temp.imgTip = blueTip
                // } else if (val.value.includes('红色')) {
                //     temp.color = 'rgba(229,51,51,1)'
                //     temp.momentColor = 'rgba(229,51,51,0.94)'
                //     temp.backgroundColor = 'rgba(229,51,51,1)'
                //     temp.imgTip = redTip
                // } else {            //绿色
                //     temp.color = 'rgba(65,255,216,1)'
                //     temp.momentColor = 'rgba(65,255,216,0.94)'
                //     temp.backgroundColor = 'rgba(65,255,216,1)'
                //     temp.imgTip = greenTip
                // }
                return temp
            })
            this.setState({
                weatherInfo: weatherInfo
            })
        }).catch((error) => {
            console.log(error)
        }
        )
    };
    // 获取交通预警信息
    getTrafficInfo = () => {
        let that = this
        axios.get(window.BaseUrl + '/EC/earlyWarningQueryAllOr')
            .then(function (res) {
                let trafficInfo = res.data.jtyj
                let tm = []
                const allTrafficInfo1 = trafficInfo.map((val, key) => {
                    tm.push([val.times, val.particulars, val.townName, val.contractName, val.contractPhone])
                })
                const allTrafficInfo2 = tm.map((val, key) => {
                    const temp1 = {}
                    temp1.info = val
                    temp1.id = key + 1
                    temp1.color = 'rgba(245,171,107,1)'
                    temp1.momentColor = 'rgba(245,171,107,0.94)'
                    temp1.backgroundColor = 'rgba(245,171,107,1)'
                    temp1.imgTip = yellowTip
                    return temp1
                })
                that.setState({
                    allTrafficInfo: allTrafficInfo2,
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    };

    //获取地质预警信息
    getGeologicalEarlyInfo = () => {
        getEarlyWarningQueryAllTo().then(res => {
            const item = res.dzyj
            let tm = []
            item.map((val, key) => {
                tm.push([val.particulars, val.times, val.townName])
            })
            const allGeologicalEarlyInfo = tm.map((val, key) => {
                const temp1 = {}
                temp1.info = val[0]
                temp1.time = val[1]
                temp1.id = key + 1
                temp1.color2 = 'rgba(245,171,107,1)'
                temp1.momentColor2 = 'rgba(245,171,107,0.94)'
                temp1.backgroundColor2 = 'rgba(245,171,107,1)'
                temp1.imgTip2 = yellowTip
                temp1.townName = val[2]
                return temp1
            })
            this.setState({
                latestGeologicalEarlyInfo: allGeologicalEarlyInfo
            })
        })
    }

    // 总联系人
    getTotalPhone = () => {
        getPrincipalQueryAll({ type: 1 }).then(res => {
            this.setState({
                totalPhone: res.fzr[0] ? res.fzr[0].contractPhone : ''
            })
        })
    };
    // 发送
    sendMsg = (val, telphone) => {
        getSendCode({ content: val, telphone: telphone }).then(res => {
            message.info(res.Message, 2)
        })
    };

    render() {
        return (
            <Layout>
                <Top />
                <Content className='allWarningInfo'>
                    <div className="overview">
                        <Link to='/emergencyCenter'><span>返回应急指挥</span></Link>
                    </div>
                    <div className='allWarningInfo_content'>
                        <div className="item geologicalEarlyWarning">
                            <div className="item_tit geologicalEarlyWarning_tit">
                                <span>地质预警</span>
                            </div>
                            <div className="item_con geologicalEarlyWarning_con">
                                {
                                    this.state.latestGeologicalEarlyInfo.map((val, key) => {
                                        return (
                                            <div className="geologicalEarlyWarning_row" key={key}>
                                                <div className="warn">
                                                    <div className='warn_pic'>
                                                        <img src={val.imgTip2} alt="" />
                                                    </div>
                                                    <div className="warn_time">
                                                        <span style={{ color: val.color2 }}>{this.timeFormat(val.time)}</span>
                                                    </div>
                                                </div>
                                                <div className='warn_con'
                                                    style={{ color: val.color2 }}>{val.info}</div>
                                                <Button className='myLook'
                                                    onClick={this.showModal5.bind(this, val.color2, val.momentColor2, val.backgroundColor2, val.imgTip2, val.info, val.time)}
                                                    style={{ background: val.backgroundColor }}>查看</Button>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="item trafficEarlyWarning">
                            <div className="item_tit trafficEarlyWarning_tit">
                                <span>交通预警</span>
                            </div>
                            <div className="item_con trafficEarlyWarning_con">
                                {
                                    this.state.allTrafficInfo.map((val, key) => {
                                        return (
                                            <div className="trafficEarlyWarning_row" key={key}>
                                                <div className="warn">
                                                    <div className='warn_pic'>
                                                        <img src={val.imgTip} alt="" />
                                                    </div>
                                                    <div className="warn_time">
                                                        <span style={{ color: val.color }}>{this.timeFormat(val.info[0])}</span>
                                                    </div>
                                                </div>
                                                <div className='warn_con'
                                                    style={{ color: val.color }}>{val.info[1]}</div>
                                                <Button className='myLook'
                                                    onClick={this.showModal4.bind(this, val.color, val.momentColor, val.backgroundColor, val.imgTip, val.info[1], val.info[0], val.info[2], val.info[3], val.info[4])}
                                                    style={{ background: val.backgroundColor }}>查看</Button>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="item weatherWarning">
                            <div className="item_tit weatherWarning_tit">
                                <span>天气预报</span>
                            </div>
                            <div className="item_con weatherWarning_con">
                                {
                                    this.state.weatherInfo.map((val, key) => {
                                        return (
                                            <div className="weatherWarning_row" key={key}>
                                                <div className="warn">
                                                    <div className='warn_pic'>
                                                        <img src={val.imgTip} alt="" />
                                                    </div>
                                                    <div className="warn_time">
                                                        <span style={{ color: val.color }}>{this.timeFormat(val.time)}</span>
                                                    </div>
                                                </div>
                                                <div className='warn_con'
                                                    style={{ color: val.color }}>{val.info}</div>
                                                <Button className='myLook'
                                                    onClick={this.showModal3.bind(this, val.color, val.momentColor, val.backgroundColor, val.imgTip, val.info, val.time)}
                                                    style={{ background: val.backgroundColor }}>查看</Button>
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>
                    </div>
                    {/*查看天气预警信息弹框*/}
                    <Modal
                        wrapClassName={'myModal3'}
                        visible={this.state.visible3}
                        onCancel={this.handleCancel3}
                        width='43.46vw'
                    >
                        <div className="modal_title">
                            <span>预警详情</span>
                            <span></span>
                        </div>
                        <div className="modal_content">
                            <div className="warn_pic">
                                <img src={this.state.imgTip} alt="" />
                                <span style={{ color: this.state.color }}>{this.timeFormat(this.state.time)}</span>
                            </div>
                            <div className='warn_con'
                                style={{ color: this.state.color }}>{this.state.info}</div>
                            <Button className='myButton' style={{ backgroundColor: this.state.backgroundColor }}
                                onClick={this.sendMsg.bind(this, this.state.info, this.state.totalPhone)}>向该地区负责人发送安全预警短信！</Button>
                        </div>
                    </Modal>
                    {/*查看交通预警信息弹框*/}
                    <Modal
                        wrapClassName={'myModal3'}
                        visible={this.state.visible4}
                        onCancel={this.handleCancel4}
                        width='43.46vw'
                    >
                        <div className="modal_title">
                            <span>预警详情</span>
                            <span></span>
                        </div>
                        <div className="modal_content">
                            <div className="warn_pic">
                                <img src={this.state.imgTip1} alt="" />
                                <span style={{ color: this.state.color1 }}>{this.timeFormat(this.state.time1)}</span>
                            </div>
                            <div className='warn_con'
                                style={{ color: this.state.color1 }}>{this.state.info1}</div>
                            <Button className='myButton' style={{ backgroundColor: this.state.backgroundColor1 }}
                                onClick={this.sendMsg.bind(this, this.state.info1, this.state.contractPhone1)}>向该地区负责人发送安全预警短信！</Button>
                        </div>
                    </Modal>
                    {/*查看地质预警信息弹框*/}
                    <Modal
                        wrapClassName={'myModal3'}
                        visible={this.state.visible5}
                        onCancel={this.handleCancel5}
                        width='43.46vw'
                    >
                        <div className="modal_title">
                            <span>预警详情</span>
                            <span></span>
                        </div>
                        <div className="modal_content">
                            <div className="warn_pic">
                                <img src={this.state.imgTip5} alt="" />
                                <span style={{ color: this.state.color5 }}>{this.timeFormat(this.state.time5)}</span>
                            </div>
                            <div className='warn_con'
                                style={{ color: this.state.color5 }}>{this.state.info5}</div>
                            <Button className='myButton' style={{ backgroundColor: this.state.backgroundColor5 }}
                                onClick={this.sendMsg.bind(this, this.state.info5, this.state.totalPhone)}>向该地区负责人发送安全预警短信！</Button>
                        </div>
                    </Modal>

                </Content>
            </Layout>
        )
    }
}
