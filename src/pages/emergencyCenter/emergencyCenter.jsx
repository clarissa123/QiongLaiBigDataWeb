/* eslint-disable no-duplicate-case */
import React, { Component } from 'react'
import Top from '../../components/top/top'
import { Layout, Modal, Input, Button, message, Select, DatePicker, Form, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import './emergencyCenter.less'
import dot from './images/dot.png'
import more_icon from './images/more_icon.png'
import warn_icon from './images/warn_icon.png'
import find_icon from './images/find_icon.png'
import redTip from '../allWarningInfo/images/call_police_1.png'
import yellowTip from '../allWarningInfo/images/call_police_2.png'
import greenTip from '../allWarningInfo/images/call_police_4.png'
import blueTipWeather from './images/call_police_5.png'
import call_police_person from './images/call_police_person.png'
import echarts from 'echarts'
import moment from 'moment'
import 'moment/locale/zh-cn'
import qionglaiJson from '../../utils/qionglai'
import locale from 'antd/es/date-picker/locale/zh_CN'

import {
    getProjectQueryAll,
    getPrincipalQueryAll,
    getSendCode,
    getCallPoliceInfo,
    getCallThePoliceHint,
    getEarlyWarningQueryAllTo,
    getAppealRecordQueryAll,
    getAppealRecordAdd,
    getAppealRecordUpdate
} from '../../api/emergencyCenter'

import axios from 'axios'

const { Content } = Layout
const { Search } = Input
const { Option } = Select
const selectStyle = {
    width: '12.76vw',
    height: '1.875vw',
    backgroundColor: 'transparent',
    border: '1px solid rgba(43, 177, 255, 0.17)'
}

//应急指挥的路由组件
class EmergencyCenter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible1: false,
            visible2: false,
            visible3: false,
            visible4: false,
            visible5: false,
            visible6: false,
            visible7: false,
            visible8: false,
            visible9: false,
            name: '',    //镇名
            tableData: [],
            concatPerson: [],    //所有区域负责人联络方式（包含总负责人）
            searchConcatPerson: [],  //某个地区负责人联络方式
            principalName: '',
            phone: '',
            townName: '',
            status: '',
            oneVideo: [],    //某个景区景点视频
            latestWeatherInfo: [],
            latestTrafficInfo: [],
            latestGeologicalEarlyInfo: [],
            color: '',
            color1: '',
            backgroundColor: '',
            backgroundColor1: '',
            imgTip: '',
            imgTip1: '',
            imgTip3: '',
            momentColor: '',
            momentColor1: '',
            info: '',
            //报警人信息
            callPoliceInfo: [],
            lon: 0,//经度
            lat: 0,//纬度
            totalPhone: '',
            value: '',
            time: '',
            timeNow: Date.parse(moment().format('YYYY-MM-DD HH:mm:ss')), // 当前时间
            key: '',
            //景区负责人联络方式
            scenicChargePersonList: [],
            unitPersonList: [],
            showData: 1,
            searchPersonInfo: {},
            //总负责人联络方式
            totalInfo: {},
            //申诉记录
            shenSuInfo: [],
            updateId: 0,
            //搜索结果
            searchResult: [],
            contractPhone1: '',
        }
    }

    componentDidMount() {
        this.getQiongLaiOption()
        this.timer = setInterval(
            () => {
                this.getQiongLaiOption()
            }, 1000 * 60)
        this.getConcatInfo()
        this.timer = setInterval(
            () => {
                this.getConcatInfo()
            }, 1000 * 60)
        this.getGeologicalEarlyInfo()
        this.timer = setInterval(
            () => {
                this.getGeologicalEarlyInfo()
            }, 1000 * 60)
        this.getWeatherInfo()
        this.timer = setInterval(
            () => {
                this.getWeatherInfo()
            }, 1000 * 3600)
        this.getTrafficInfo()
        this.timer = setInterval(
            () => {
                this.getTrafficInfo()
            }, 1000 * 3600)
        this.getTotalPhone()
        this.timer = setInterval(
            () => {
                this.getTotalPhone()
            }, 1000 * 3600)
        this.getCallPolice()
        this.timer = setInterval(
            () => {
                this.getCallPolice()
            }, 1000 * 60)

        this.getShenSuInfo()
        this.timer = setInterval(
            () => {
                this.getShenSuInfo()
            }, 1000 * 60)
    }

    showModal2 = () => {
        this.setState({
            visible2: true,
        })
    };
    showModal3 = () => {
        this.setState({
            visible3: true,
        })
    };
    showModal4 = (color, momentColor, backgroundColor, imgTip, info, time, contractPhone) => {
        this.setState({
            visible6: true,
            color1: color,
            momentColor1: momentColor,
            backgroundColor1: backgroundColor,
            imgTip1: imgTip,
            info: info,
            time1: time,
            contractPhone1: contractPhone,
        })
    };
    showModal5 = (color, momentColor, backgroundColor, imgTip, info, time) => {
        this.setState({
            visible7: true,
            color1: color,
            momentColor1: momentColor,
            backgroundColor1: backgroundColor,
            imgTip1: imgTip,
            info: info,
            time1: time
        })
    };
    //新增申诉记录
    clickAddBtn = () => {
        this.setState({
            visible8: true
        })
    };
    //查看申诉记录详情
    clickLookBtn = (id) => {
        let shenSuDetail = this.state.shenSuInfo.find(item => item.id === id)
        this.setState({
            visible9: true,
            updateId: shenSuDetail.id
        })
        const registerTimes = moment(shenSuDetail.registerTimes)
        registerTimes.milliseconds(0)
        this.props.form.setFieldsValue({
            registerTimes: registerTimes,
            grade: shenSuDetail.grade,
            erea: shenSuDetail.erea,
            classify: shenSuDetail.classify,
            person: shenSuDetail.person,
            headline: shenSuDetail.headline,
            contents: shenSuDetail.contents,
            result: shenSuDetail.result,
            remark: shenSuDetail.remark,
        })
    }

    handleCancel1 = e => {
        this.setState({
            visible1: false,
        })
    };
    handleCancel2 = e => {
        this.setState({
            visible2: false,
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
    handleCancel6 = e => {
        this.setState({
            visible6: false,
        })
    };
    handleCancel7 = e => {
        this.setState({
            visible7: false,
        })
    };
    handleCancel8 = e => {
        this.setState({
            visible8: false,
        }, function () {
            this.closeForm()
        })
    };
    handleCancel9 = e => {
        this.setState({
            visible9: false,
        }, function () {
            this.closeForm()
        })
    };
    //获取报警人信息
    getCallPolice = () => {
        getCallPoliceInfo().then(res => {
            this.setState({
                callPoliceInfo: res.yk,    //报警人信息
            })
        })
    };
    //销毁定时器
    componentWillUnmount() {
        clearInterval(this.timer)
    }

    timeFormat = (x) => {
        let diff = moment(Date.now()).format('x') - moment(x).format('x')
        let days = moment.duration(diff).days()
        let hours = moment.duration(diff).hours()
        let minutes = moment.duration(diff).minutes()
        let result = ""
        if (days !== 0) {
            result += Math.abs(days) + "天"
        }
        if (hours !== 0) {
            result += Math.abs(hours) + "时"
        }
        if (minutes !== 0) {
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

    timeFormat2 = (x) => {
        let diff = moment(Date.now()).format('x') - moment(x).format('x')
        let days = moment.duration(diff).days()
        let hours = moment.duration(diff).hours()
        let minutes = moment.duration(diff).minutes()
        let result = ""
        if (days !== 0) {
            result += Math.abs(days) + "天"
        }
        if (days === 0 && hours !== 0) {
            result += Math.abs(hours) + "时"
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

    timeFormat3 = (x) => {
        let diff = moment(Date.now()).format('x') - moment(x).format('x')
        let days = moment.duration(diff).days()
        let hours = moment.duration(diff).hours()
        let minutes = moment.duration(diff).minutes()
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

    //邛崃地图
    getQiongLaiOption = () => {
        this.getCallPolice()
        setTimeout(() => {
            let geoJson = qionglaiJson
            let myChart = echarts.init(document.getElementById('container'))
            echarts.registerMap('邛崃', geoJson)
            let data = [
                { name: '卧龙镇' },
                { name: '天台山镇' },
                { name: '茶园乡' },
                { name: '固驿镇' },
                { name: '临邛街道办事处' },
                { name: '文君街道办事处' },
                { name: '火井镇' },
                { name: '南宝乡' },
                { name: '高河镇' },
                { name: '平乐镇' },
                { name: '道佐乡' },
                { name: '临济镇' },
                { name: '夹关镇' },
                { name: '水口镇' },
                { name: '大同乡' },
                { name: '桑园镇' },
                { name: '前进镇' },
                { name: '冉义镇' },
                { name: '羊安镇' },
                { name: '高埂镇' },
                { name: '高何镇' },
            ]
            const myData = []
            this.state.callPoliceInfo.forEach((item) => {
                if (item.states === '未处理') {
                    myData.push({
                        name: '游客一键报警',
                        value: [item.longitude, item.latitude, 150],
                        time: item.times,
                        phone: item.phone,
                        nickname: item.nickname,
                        townName: item.townName,
                        status: item.states,
                        id: item.id,
                    })
                }
            })
            const trafficData = []
            const townValue = [
                {
                    'townName': '平乐镇',
                    'longitude': 103.332656,
                    'latitude': 30.343334,
                },
                {
                    'townName': '天台山镇',
                    'longitude': 103.177357,
                    'latitude': 30.302336,
                },
                {
                    'townName': '夹关镇',
                    'longitude': 103.222217,
                    'latitude': 30.257689,
                },
                {
                    'townName': '火井镇',
                    'longitude': 103.224726,
                    'latitude': 30.381134,
                },
                {
                    'townName': '临济镇',
                    'longitude': 103.29057,
                    'latitude': 30.264217,
                },
                {
                    'townName': '南宝山镇',
                    'longitude': 103.258092,
                    'latitude': 30.402464,
                },
                {
                    'townName': '大同镇',
                    'longitude': 104.289757,
                    'latitude': 30.863368,
                },
                {
                    'townName': '孔明街道',
                    'longitude': 103.407089,
                    'latitude': 30.376069,
                },
                {
                    'townName': '桑园镇',
                    'longitude': 103.460793,
                    'latitude': 30.47483,
                },
                {
                    'townName': '临邛街道',
                    'longitude': 103.476287,
                    'latitude': 30.412704,
                },
                {
                    'townName': '文君街道',
                    'longitude': 103.464718,
                    'latitude': 30.404525,
                },
                {
                    'townName': '高埂街道',
                    'longitude': 103.643587,
                    'latitude': 31.012186,
                },
                {
                    'townName': '固驿街道',
                    'longitude': 103.589856,
                    'latitude': 30.371892,
                },
                {
                    'townName': '羊安街道',
                    'longitude': 103.703663,
                    'latitude': 30.392383,
                },
                {
                    'townName': '高何镇',
                    'longitude': 103.15873,
                    'latitude': 30.32406,
                },
            ]
            const temp = []
            this.state.latestTrafficInfo.forEach((item) => {
                townValue.map((v, i) => {
                    if (item.townName === v.townName && temp.indexOf(item.townName) === -1) {
                        temp.push(item.townName)
                        trafficData.push({
                            name: '交通预警',
                            time: item.time,
                            id: item.id,
                            value: [v.longitude, v.latitude, 150],
                            townName: item.townName,
                        })
                    }

                })
            })

            const convertData = function (data) {
                let res = []
                for (var i = 0;i < data.length;i++) {
                    let item = {}
                    item.name = data[i].name
                    res.push(item)
                }
                return res
            }

            let option = {
                geo: {
                    show: true,
                    map: '邛崃',
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                color: '#fff',
                                fontSize: 16,
                            }
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                color: '#fff',
                            }
                        }
                    },
                    roam: false,    //禁止地图随着鼠标滚轮缩放
                    itemStyle: {
                        normal: {
                            areaColor: '#3E82F7',
                            borderColor: '#000',
                            borderWidth: 1.5,
                        },
                        emphasis: {
                            areaColor: '#2045A0',
                            borderWidth: 1.5,
                        }
                    }
                },
                series: [
                    {
                        name: '邛崃',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        data: convertData(data),
                        symbolSize: 5,
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: true
                            },
                            emphasis: {
                                show: true
                            }
                        },
                    },
                    {
                        name: '游客一键报警',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        data: myData,
                        symbolSize: function (val) {
                            return val[2] / 8
                        },
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke',
                            //涟漪特效
                            period: 3, //特效动画时长
                            scale: 4, //波纹的最大缩放比例
                        },
                        hoverAnimation: true,
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'bottom',
                                show: true,
                                textStyle: {
                                    fontSize: 16,
                                }
                            },
                        },
                        itemStyle: {
                            normal: {
                                color: '#E53333',
                                shadowBlur: 10,
                                shadowColor: '#E53333',
                            }
                        },
                        zlevel: 1
                    },
                    {
                        map: '邛崃',
                        type: 'map',
                        geoIndex: 0,
                        aspectScale: 0.75, //长宽比
                        showLegendSymbol: false, // 存在legend时显示
                        roam: true,
                        animation: false,
                        data: convertData(data)
                    },
                    {
                        name: '交通预警',
                        type: 'effectScatter',
                        // type: 'custom',     //配置显示方式为用户自定义
                        coordinateSystem: 'geo',
                        data: trafficData,
                        symbolSize: function (val) {
                            return val[2] / 8
                        },
                        // symbol: './images/dot.png',
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke',
                            //涟漪特效
                            period: 3, //特效动画时长
                            scale: 4, //波纹的最大缩放比例
                        },
                        hoverAnimation: true,
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'bottom',
                                show: true,
                                textStyle: {
                                    fontSize: 16,
                                }
                            },
                        },
                        itemStyle: {
                            normal: {
                                color: '#F5AB6B',
                                shadowBlur: 30,
                                shadowColor: '#F5AB6B',

                            }
                        },
                        zlevel: 1,
                    }
                ]
            }
            myChart.setOption(option)

            myChart.on('click', function (params) {
                //地图点击事件
                if (params.componentType === 'series' && params.componentSubType === 'map' && params.seriesName !== '交通预警') {
                    if (params.name === '平乐镇') {
                        var name = '平乐古镇'
                        const data = params.data
                        this.setState({
                            visible1: true,
                            name: name,
                            callName: data.nickname,
                            callPhone: data.phone,
                            callTime: data.time,
                            callAddress: data.townName,
                            status: data.states,
                            callId: data.id,
                        })
                        this.getVideofromTownName(name)
                    } else {
                        var name = params.name
                        this.setState({
                            visible1: true,
                            name: name,
                            callName: data.nickname,
                            callPhone: data.phone,
                            callTime: data.time,
                            callAddress: data.townName,
                            status: data.states,
                            callId: data.id,
                        })
                        this.getVideofromTownName(name)
                    }
                } else if (params.componentType === 'series' && params.componentSubType === 'effectScatter' && params.seriesName !== '交通预警') {
                    var name = params.name
                    const data = params.data
                    this.setState({
                        visible5: true,
                        name: name,
                        callName: data.nickname,
                        callPhone: data.phone,
                        callTime: data.time,
                        callAddress: data.townName,
                        status: data.status,
                        callId: data.id,
                    })
                    this.getCallPolice()
                }
            }.bind(this))
        }, 1000)
    };

    //根据镇名获取视频监控数据
    getVideofromTownName = (name) => {
        if (name === '平乐古镇') {
            name = '平乐镇'
        }
        getProjectQueryAll({ townName: name }).then(res => {
            this.setState({
                tableData: res.video,
            })
        })
    };

    //查找
    searchInfo = (name) => {
        if (name === '') {
            message.destroy()  //拒绝吐丝
            message.error('不能为空')
            return false
        }
        let that = this
        axios.all([getPrincipalQueryAll({ name: name, type: 0 }), getPrincipalQueryAll({ name: name, type: 2 }), getPrincipalQueryAll({ name: name, type: 3 })])
            .then(axios.spread(function (...tempArr) {
                let result = tempArr.filter(function (element, index, self) {
                    return element.fzr.length > 0
                })
                if (result.length > 0) {
                    that.setState({
                        searchResult: result[0].fzr
                    })
                } else {
                    that.setState({
                        searchResult: []
                    })
                }
            }))
    }

    //获取地区负责人联络方式（含总负责人）
    getConcatInfo = (name) => {
        let chargePerson = ''
        //获取总负责人联络方式
        getPrincipalQueryAll({ type: 1 }).then(res => {
            chargePerson = res.fzr[0]
            //获取分区域负责人联络方式
            getPrincipalQueryAll({ name: name, type: 0 }).then(res => {
                res.fzr.unshift(chargePerson)
                this.setState({
                    concatPerson: res.fzr
                })
            })
        })
    };

    //获取景区负责人联络方式
    getScenicConcatInfo = (name) => {
        getPrincipalQueryAll({ name: name, type: 2 }).then(res => {
            this.setState({
                scenicChargePersonList: res.fzr
            })
        })
    }

    //获取相关单位负责人联络方式
    getUnitConcatInfo = (name) => {
        //获取相关单位负责人联络方式    
        getPrincipalQueryAll({ name: name, type: 3 }).then(res => {
            this.setState({
                unitPersonList: res.fzr
            })
        })
    }

    //获取申诉记录
    getShenSuInfo = () => {
        getAppealRecordQueryAll().then(res => {
            this.setState({
                shenSuInfo: res.query,
            })
        })
    }

    handleVideo = (val) => {
        this.setState({
            visible1: false,
            visible4: true,
            oneVideo: val,
        })
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
            const weatherInfo = time.map((val, key) => {
                const temp = {}
                temp.value = val.value
                temp.id = key + 1
                temp.times = val.times
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
                //     temp.imgTip = blueTipWeather
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
                latestWeatherInfo: weatherInfo,
            })
        }).catch((error) => {
            console.log(error)
        }
        )
    };

    //获取交通预警信息
    getTrafficInfo = () => {
        let that = this
        axios.get(window.BaseUrl + '/EC/earlyWarningQueryAllOr')
            .then(function (res) {
                const item = res.data.jtyj
                let tm = []
                item.map((val, key) => {
                    tm.push([val.particulars, val.times, val.townName, val.contractName, val.contractPhone])
                })
                const allTrafficInfo2 = tm.map((val, key) => {
                    const temp1 = {}
                    temp1.info = val[0]
                    temp1.time = val[1]
                    temp1.townName = val[2]
                    temp1.contractPerson = val[3]
                    temp1.contractPhone = val[4]
                    temp1.id = key + 1
                    temp1.color1 = 'rgba(245,171,107,1)'
                    temp1.momentColor1 = 'rgba(245,171,107,0.94)'
                    temp1.backgroundColor1 = 'rgba(245,171,107,1)'
                    temp1.imgTip1 = yellowTip
                    return temp1
                })
                that.setState({
                    latestTrafficInfo: allTrafficInfo2
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    //获取地质预警信息
    getGeologicalEarlyInfo = () => {
        getEarlyWarningQueryAllTo().then(res => {
            const item = res.dzyj
            let tm = []
            tm.push(item[item.length - 1])
            const allGeologicalEarlyInfo = tm.map((val, key) => {
                const temp1 = {}
                temp1.info = val.particulars
                temp1.time = val.times
                temp1.id = key + 1
                temp1.color1 = 'rgba(245,171,107,1)'
                temp1.momentColor1 = 'rgba(245,171,107,0.94)'
                temp1.backgroundColor1 = 'rgba(245,171,107,1)'
                temp1.imgTip1 = yellowTip
                temp1.townName = val.townName
                return temp1
            })
            this.setState({
                latestGeologicalEarlyInfo: allGeologicalEarlyInfo
            })

        })
    }

    handleInfo = (imgTip, value, time, color, backgroundColor) => {
        this.setState({
            visible3: true,
            imgTip3: imgTip,
            value: value,
            time: time,
            color: color,
            backgroundColor: backgroundColor
        })
    };

    // 总联系人
    getTotalPhone = () => {
        getPrincipalQueryAll({ type: 1 }).then(res => {
            this.setState({
                totalPhone: res.fzr[0] ? res.fzr[0].contractPhone : ''
            })
        })
    };

    //发送短信
    sendMsg = (val, telphone) => {
        getSendCode({ content: val, telphone: telphone }).then(res => {
            message.info(res.Message, 2)
        })
    };

    //跳转到全部预警信息列表页
    handleAllPoliceInfo = () => {
        this.props.history.push('/allPoliceInfo')
    };

    //更改报警处理的状态  
    changeStatus = (id) => {
        getCallThePoliceHint({ id: id }).then(res => {
            if (res === true) {
                message.success('修改状态成功')
                this.setState({
                    visible5: false,
                }, () => {
                    window.location.reload()
                })
            }
        })
    }

    //负责人联络方式选择器
    handleChange = (value) => {
        switch (value) {
            case "地区负责人": {
                this.getConcatInfo()
                this.setState({
                    showData: 1
                })
                break
            }
            case "景区负责人": {
                this.getScenicConcatInfo()
                this.setState({
                    showData: 2
                })
                break
            }
            case "相关单位负责人": {
                this.getUnitConcatInfo()
                this.setState({
                    showData: 3
                })
                break
            }
        }
    }

    //登记时间
    registerOnChange = (value, dateString) => {
        // console.log('Selected Time: ', value);
        // console.log('Formatted Selected Time: ', dateString);
    }

    registerOnOk = (value, dateString) => {
        // console.log('onOk: ', value);
    }

    closeForm = () => {
        this.props.form.resetFields()
    };

    //新增申诉详情
    insertForm = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.registerTimes = moment(values.registerTimes).format('YYYY-MM-DD HH:mm:ss')
                getAppealRecordAdd(values).then(res => {
                    if (res === true) {
                        message.success('新增申诉记录成功')
                        this.setState({
                            visible8: false
                        })
                        this.closeForm()
                    }
                })
            }
        })
    };

    //修改某条的申诉详情
    updateForm = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.registerTimes = moment(values.registerTimes).format('YYYY-MM-DD HH:mm:ss')
                values.id = this.state.updateId
                getAppealRecordUpdate(values).then(res => {
                    if (res === true) {
                        message.success('修改申诉记录成功')
                        this.setState({
                            visible9: false
                        })
                        this.closeForm()
                        this.getShenSuInfo()
                    }
                })
            }
        })
    };

    render() {
        const { TextArea } = Input
        const { getFieldDecorator } = this.props.form

        return (
            <Layout>
                <Top />
                <Content className='emergencyCenter'>
                    <div className="item_left">
                        <div className="item_left_one">
                            <div className="chargePerson">
                                {/* 申诉记录*/}
                                <div className="scenicChargePerson">
                                    <div className="scenicChargePerson_title">
                                        <span>应急指挥记录</span>
                                    </div>
                                    <div className="scenicChargePerson_content">
                                        <div className="scenicChargePerson_content_scroll">
                                            <div className="scenicChargePerson_content_container">
                                                {
                                                    this.state.shenSuInfo.length === 0 ? '暂无数据' :
                                                        this.state.shenSuInfo.map((v, i) => {
                                                            return (
                                                                <div className="shenSuInfo_item">
                                                                    <div><span>{i + 1}</span></div>
                                                                    <div><span>{v.person}</span></div>
                                                                    <div><span style={{ 'color': v.grade === '三级' ? '#F5AB6B' : '' }}>{v.contents}</span></div>
                                                                    <div onClick={this.clickLookBtn.bind(this, v.id)}><span style={{ 'color': v.grade === '三级' ? '#F5AB6B' : '' }}>查看详情</span></div>
                                                                </div>
                                                            )
                                                        })
                                                }
                                            </div>
                                        </div>
                                        <div className="addBtn" onClick={this.clickAddBtn}><span>新增应急指挥记录</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mapMonitoring">
                                <div className="mapMonitoring_title">
                                    <span className='mapMonitoring_map'>地图监控</span>
                                    <div className='mapMonitoring_allPoliceInfo' onClick={this.handleAllPoliceInfo.bind(this)}><img src={warn_icon} alt="" /><span>全部预警信息</span></div>
                                </div>
                                <div className="mapMonitoring_content">
                                    <div id="container" ref="chart" style={{ width: '100%', height: "100%" }} ></div>
                                </div>
                            </div>
                        </div>
                        <div className="responsibleContact">
                            <div className="responsibleContact_title">
                                <span>负责人联络方式</span>
                                <div className='find' onClick={this.showModal2}>
                                    <img src={find_icon} alt="" /><span>查找</span></div>
                            </div>
                            <div className="responsibleContact_content">
                                <div className="responsibleContact_content_container">
                                    <div className="dropDown_menu">
                                        <Select defaultValue="地区负责人" dropdownClassName="my_drop" dropdownMatchSelectWidth="6.77vw" dropdownMenuStyle={{ height: '6.77vw', top: '755px' }} onChange={this.handleChange}>
                                            <Option className="drop_item" value="地区负责人">地区负责人</Option>
                                            <Option className="drop_item" value="景区负责人">景区负责人</Option>
                                            <Option className="drop_item" value="相关单位负责人">相关单位负责人</Option>
                                        </Select>
                                    </div>
                                    <div className="dropDown_con" style={{ display: this.state.concatPerson && this.state.showData === 1 ? 'inline-flex' : 'none' }}>
                                        {
                                            this.state.concatPerson.length === 0 ? '暂无数据' :
                                                this.state.concatPerson.map((val, key) => {
                                                    return (
                                                        <div ><img src={dot}
                                                            alt="" /><span>{key === 0 ? '邛崃市' : val.name}负责人-{val.contractName}-{val.contractPhone}</span>
                                                        </div>
                                                    )
                                                })
                                        }
                                    </div>
                                    <div className="dropDown_con" style={{ display: this.state.scenicChargePersonList && this.state.showData === 2 ? 'inline-flex' : 'none' }}>
                                        {
                                            this.state.scenicChargePersonList.length === 0 ? '暂无数据' :
                                                this.state.scenicChargePersonList.map((val, key) => {
                                                    return (
                                                        <div ><img src={dot}
                                                            alt="" /><span>{val.name}负责人-{val.contractName}-{val.contractPhone}</span>
                                                        </div>
                                                    )
                                                })
                                        }
                                    </div>
                                    <div className="dropDown_con" style={{ display: this.state.unitPersonList && this.state.showData === 3 ? 'inline-flex' : 'none' }}>
                                        {
                                            this.state.unitPersonList.length === 0 ? '暂无数据' :
                                                this.state.unitPersonList.map((val, key) => {
                                                    return (
                                                        <div ><img src={dot}
                                                            alt="" /><span>{val.departmentName}负责人-{val.contractName}-{val.contractPhone}</span>
                                                        </div>
                                                    )
                                                })
                                        }
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="item_right">
                        <div className="weatherWarning">
                            <div className="weatherWarning_title">
                                <span>天气预报</span>
                                <Link to='/allWarningInfo'>
                                    <div className='more'><img src={more_icon} alt="" /><span>更多</span></div>
                                </Link>
                            </div>
                            <div className="weatherWarning_content">
                                {this.state.latestWeatherInfo.map((val, key) => {
                                    if (key < 2) {
                                        return (
                                            <div className="weatherWarning_row">
                                                <div className="warn">
                                                    <div className='warn_pic'>
                                                        <img src={val.imgTip} alt="" />
                                                    </div>
                                                    <div className="warn_time">
                                                        <span style={{ color: val.momentColor }}>{this.timeFormat3(val.times)}</span>
                                                    </div>
                                                </div>
                                                <div className='warn_con'
                                                    style={{ color: val.color }}>{
                                                        val.value
                                                    }</div>
                                                <Button className='myLook'
                                                    style={{ background: val.backgroundColor }}
                                                    onClick={this.handleInfo.bind(this, val.imgTip, val.value, val.times, val.color, val.backgroundColor)}
                                                >查看</Button>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>
                        <div className="trafficEarlyWarning">
                            <div className="trafficEarlyWarning_title">
                                <span>交通预警</span>
                                <Link to='/allWarningInfo'>
                                    <div className='more'><img src={more_icon} alt="" /><span>更多</span></div>
                                </Link>
                            </div>
                            <div className="trafficEarlyWarning_content">
                                {
                                    this.state.latestTrafficInfo.map((val, key) => {
                                        if (key < 4) {
                                            return (
                                                <div className="trafficEarlyWarning_row" key={key}>
                                                    <div className="warn">
                                                        <div className='warn_pic'>
                                                            <img src={val.imgTip1} alt="" />
                                                        </div>
                                                        <div className="warn_time">
                                                            <span style={{ color: val.momentColor1 }}>
                                                                {this.timeFormat(val.time)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='warn_con' style={{ color: val.color1 }}>
                                                        {val[key] === null ? '暂无数据' : val.info}
                                                    </div>
                                                    <Button className='myLook'
                                                        style={{ background: val.backgroundColor1 }}
                                                        onClick={
                                                            this.showModal4.bind(this, val.color1, val.momentColor1, val.backgroundColor1, val.imgTip1, val.info, val.time, val.contractPhone)
                                                        }
                                                    >查看
                                                        </Button>
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>

                        <div className="geologicalEarlyWarning">
                            <div className="geologicalEarlyWarning_title">
                                <span>地质预警</span>
                                <Link to='/allWarningInfo'>
                                    <div className='more'><img src={more_icon} alt="" /><span>更多</span></div>
                                </Link>
                            </div>
                            <div className="geologicalEarlyWarning_content">
                                {
                                    this.state.latestGeologicalEarlyInfo.map((val, key) => {
                                        if (key < 1) {
                                            return (
                                                <div className="geologicalEarlyWarning_row" key={key}>
                                                    <div className="warn">
                                                        <div className='warn_pic'>
                                                            <img src={val.imgTip1} alt="" />
                                                        </div>
                                                        <div className="warn_time">
                                                            <span style={{ color: val.momentColor1 }}>
                                                                {this.timeFormat2(val.time)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='warn_con' style={{ color: val.color1 }}>
                                                        {val[key] === null ? '暂无数据' : val.info}
                                                    </div>
                                                    <Button className='myLook'
                                                        style={{ background: val.backgroundColor1 }}
                                                        onClick={
                                                            this.showModal5.bind(this, val.color1, val.momentColor1, val.backgroundColor1, val.imgTip1, val.info, val.time)
                                                        }
                                                    >查看
                                                        </Button>
                                                </div>
                                            )
                                        }
                                    })
                                }



                            </div>
                        </div>
                    </div>
                    {/*查看视频监控弹框*/}
                    <Modal
                        wrapClassName={'videoModal'}
                        visible={this.state.visible1}
                        onCancel={this.handleCancel1}
                        width='32.67vw'
                        height='16.33vw'
                    >
                        <div className="videoModal_title">
                            <span>{this.state.name}</span>
                        </div>
                        <div className="videoModal_content">
                            {
                                (this.state.tableData.length === 0) ? '暂无数据' :
                                    this.state.tableData.map((val, key) => {
                                        return (
                                            <div key={key} onClick={this.handleVideo.bind(this, val)}>
                                                <span>{val.scenicSpotName}-{val.videoName}</span></div>
                                        )
                                    })
                            }
                        </div>
                    </Modal>
                    {/*查看某个视频弹框*/}
                    <Modal
                        wrapClassName={'oneVideoModal'}
                        visible={this.state.visible4}
                        onCancel={this.handleCancel4}
                        width='66.67vw'
                        height='51.66vw'
                    >
                        <div className="oneVideoModal_title">
                            <span>{this.state.oneVideo.townName}-{this.state.oneVideo.scenicSpotName}-{this.state.oneVideo.videoName}</span>
                        </div>
                        <div className="oneVideoModal_content">
                            <video controls="controls" width="100%" height="100%" preload="auto" data-setup='{}'>
                                <source
                                    src={this.state.oneVideo.videoValue}
                                    type="application/x-mpegURL" />
                            </video>
                        </div>
                    </Modal>
                    {/*查找负责人联络方式弹框*/}
                    <Modal
                        wrapClassName={'myModal2'}
                        visible={this.state.visible2}
                        onCancel={this.handleCancel2}
                        width='35.33vw'
                    >
                        <div className="modal_title">
                            <span>查找负责人</span>
                            <span></span>
                        </div>
                        <div className="modal_content">
                            <Search
                                className={'mySearch'}
                                placeholder="请输入负责人负责区域、或姓名"
                                enterButton="搜索"
                                size="large"
                                onSearch={this.searchInfo}
                            />
                            <div className="show_data">
                                <div className="data_title">
                                    <div className="area"><span>负责区域</span></div>
                                    <div className="name"><span>负责人</span></div>
                                    <div className="phone"><span>联络方式</span></div>
                                </div>
                                <div className="data_con">
                                    {
                                        (this.state.searchResult.length === 0) ? '暂无数据' :
                                            this.state.searchResult.map((val, key) => {
                                                return (
                                                    <div className="item">
                                                        <div className="area"><span>{val.name === undefined ? '暂无数据' : val.name}</span></div>
                                                        <div className="name"><span>{val.contractName === undefined ? '暂无数据' : val.contractName}</span></div>
                                                        <div className="phone"><span>{val.contractPhone === undefined ? '暂无数据' : val.contractPhone}</span></div>
                                                    </div>
                                                )
                                            })
                                    }
                                </div>
                            </div>
                        </div>
                    </Modal>
                    {/*查找报警人弹框*/}
                    <Modal
                        wrapClassName={'call_police_modal'}
                        visible={this.state.visible5}
                        onCancel={this.handleCancel5}
                        width='35.33vw'
                    >
                        <div className="modal_title">
                            <span>预警详情</span>
                            <span onClick={this.handleAllPoliceInfo.bind(this)}>查看全部预警信息</span>
                            <span></span>
                        </div>
                        <div className="modal_content">
                            <div className='call_police_person'><img src={call_police_person} alt="" /></div>
                            <div className={'call_police_bg'}>
                                <p className="callName"><span className="callName_tit">报警人姓名：</span><span>{this.state.callName}</span></p>
                                <p className="callPhone"><span className="callPhone_tit">报警人电话：</span><span>{this.state.callPhone}</span></p>
                                <p className="callTime"><span className="callTime_tit">报警时间：</span><span>{this.state.callTime}</span></p>
                                <p className="callAddress">
                                    <span className="callAddress_tit">报警地址：</span>
                                    <span className="callAddress_con">{this.state.callAddress}</span>
                                </p>
                                <p className="call_status">
                                    <div className="call_status_con">
                                        <span>状态：</span><span>{this.state.status}</span>
                                    </div>
                                    <div className="item_btn" style={{ display: this.state.status === '已处理' ? 'none' : 'inline-block' }}>
                                        <Button className='handle' onClick={this.changeStatus.bind(this, this.state.callId)}>已处理</Button>
                                    </div>
                                </p>
                            </div>
                        </div>
                    </Modal>
                    {/*查看天气预警信息弹框*/}
                    <Modal
                        wrapClassName={'myModal3'}
                        visible={this.state.visible3}
                        onCancel={this.handleCancel3}
                        width='43.46vw'
                    >
                        <div className="modal_title">
                            <span>预警详情
                             </span>
                            <span></span>
                        </div>
                        <div className="modal_content">
                            <div className="warn_pic">
                                <img src={this.state.imgTip3} alt="" />
                                <span style={{ color: this.state.color }}>
                                    {this.timeFormat3(this.state.time)}
                                </span>
                            </div>
                            <div className='warn_con'
                                style={{ color: this.state.color }}>{
                                    this.state.value ? this.state.value : ''
                                }</div>
                            <Button className='myButton' style={{ backgroundColor: this.state.backgroundColor }}
                                onClick={this.sendMsg.bind(this, this.state.value, this.state.totalPhone)}>向该地区负责人发送安全预警短信！</Button>
                        </div>
                    </Modal>
                    {/* 查看交通预警信息弹框 */}
                    <Modal
                        wrapClassName={'myModal3'}
                        visible={this.state.visible6}
                        onCancel={this.handleCancel6}
                        width='43.46vw'
                    >
                        <div className="modal_title">
                            <span>预警详情</span>
                            <span></span>
                        </div>
                        <div className="modal_content">
                            <div className="warn_pic">
                                <img src={yellowTip} alt="" />
                                <span style={{ color: this.state.color1 }}>
                                    {this.timeFormat(this.state.time1)}
                                </span>
                            </div>
                            <div className='warn_con'
                                style={{ color: this.state.color1 }}>{this.state.info}</div>
                            <Button className='myButton' style={{ backgroundColor: this.state.backgroundColor1 }}
                                onClick={
                                    this.sendMsg.bind(this, this.state.info, this.state.contractPhone1)
                                }>向该地区负责人发送安全预警短信！</Button>
                        </div>
                    </Modal>
                    {/* 查看地质预警信息弹框 */}
                    <Modal
                        wrapClassName={'myModal3'}
                        visible={this.state.visible7}
                        onCancel={this.handleCancel7}
                        width='43.46vw'
                    >
                        <div className="modal_title">
                            <span>预警详情</span>
                            <span></span>
                        </div>
                        <div className="modal_content">
                            <div className="warn_pic">
                                <img src={yellowTip} alt="" />
                                <span style={{ color: this.state.color1 }}>
                                    {this.timeFormat2(this.state.time1)}
                                </span>
                            </div>
                            <div className='warn_con'
                                style={{ color: this.state.color1 }}>{this.state.info}</div>
                            <Button className='myButton' style={{ backgroundColor: this.state.backgroundColor1 }}
                                onClick={
                                    this.sendMsg.bind(this, this.state.info, this.state.totalPhone)
                                }>向该地区负责人发送安全预警短信！</Button>
                        </div>
                    </Modal>
                    {/* 新增申诉记录弹框 */}
                    <Modal
                        wrapClassName={'myModal8'}
                        visible={this.state.visible8}
                        onCancel={this.handleCancel8}
                        width='83.33vw'
                    >
                        <div className="modal_title">
                            <span>新增申诉记录
                             </span>
                            <span></span>
                        </div>
                        <div className="modal_content">
                            <div className="left_con">
                                <Form labelCol={{ span: 5 }} wrapperCol={{ span: 13 }} hideRequiredMark={false}
                                    className='shensu_modal' layout='horizontal'>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item label="*登记时间">
                                                {getFieldDecorator('registerTimes', {
                                                    rules: [{ required: true, message: '请选择登记时间' }],
                                                })(
                                                    <DatePicker locale={locale} style={{ width: '12.76vw' }} className="registerDatePicker" showTime placeholder="请选择登记时间" onChange={this.registerOnChange} onOk={this.registerOnOk} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item label="*事件等级">
                                                {getFieldDecorator('grade', {
                                                    rules: [{ required: true, message: '请选择事件等级' }],
                                                })(
                                                    <Select
                                                        style={selectStyle}
                                                        className="grade"
                                                        size='large'
                                                        placeholder="请选择"
                                                    >
                                                        <Option key='1' value='一级'>一级</Option>
                                                        <Option key='2' value='二级'>二级</Option>
                                                        <Option key='3' value='三级'>三级</Option>
                                                    </Select>,
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="*事发区域">
                                                {getFieldDecorator('erea', {
                                                    rules: [{ required: true, message: '请输入事发区域' }],
                                                })(<Input className="area_input" placeholder='请输入事发区域' autoComplete='off' />)}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item label="*事件分类">
                                                {getFieldDecorator('classify', {
                                                    rules: [{ required: true, message: '请选择事件分类' }],
                                                })(
                                                    <Select
                                                        style={selectStyle}
                                                        className="classify"
                                                        size='large'
                                                        placeholder="请选择"
                                                    >
                                                        <Option key='1' value='紧急事件'>紧急事件</Option>
                                                        <Option key='2' value='一般事件'>一般事件</Option>
                                                    </Select>,
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="相应人员">
                                                {getFieldDecorator('person')(<Input className="person_input" autoComplete='off' />)}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item label="*事件标题">
                                                {getFieldDecorator('headline', {
                                                    rules: [{ required: true, message: '请输入事件标题' }],
                                                })(<Input className="headline_input" style={{ width: '31.2vw' }} placeholder='请输入事件标题' autoComplete='off' />)}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item label="*事件内容">
                                                {getFieldDecorator('contents', {
                                                    rules: [{ required: true, message: '请输入事件内容' }],
                                                })(
                                                    <TextArea className="contents_input" style={{ width: '31.2vw' }} placeholder="请输入事件内容" allowClear autoSize={{ minRows: 3, maxRows: 5 }} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item label="处理结果">
                                                {getFieldDecorator('result', {})(
                                                    <TextArea className="result_input" style={{ width: '31.2vw' }} placeholder="请输入处理结果" allowClear autoSize={{ minRows: 3, maxRows: 5 }} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item label="备注">
                                                {getFieldDecorator('remark', {})(
                                                    <TextArea className="remark_input" style={{ width: '31.2vw' }} placeholder="请输入备注" allowClear autoSize={{ minRows: 3, maxRows: 5 }} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item wrapperCol={{ span: 12, offset: 15 }}>
                                        <Button className='okBtn' type="primary" htmlType="submit" onClick={this.insertForm}>提交</Button>
                                        <Button className='calcelBtn' onClick={this.handleCancel8}>取消</Button>
                                    </Form.Item>
                                </Form>
                            </div>
                            <div className="right_con"></div>
                        </div>
                    </Modal>
                    {/* 修改申诉记录弹框 */}
                    <Modal
                        wrapClassName={'myModal9'}
                        visible={this.state.visible9}
                        onCancel={this.handleCancel9}
                        width='83.33vw'
                    >
                        <div className="modal_title">
                            <span>申诉记录详情</span>
                            <span></span>
                        </div>
                        <div className="modal_content">
                            <div className="left_con">
                                <Form labelCol={{ span: 5 }} wrapperCol={{ span: 13 }} hideRequiredMark={false}
                                    className='shensu_modal' layout='horizontal'>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item label="*登记时间">
                                                {getFieldDecorator('registerTimes', {
                                                    rules: [{ required: true, message: '请选择登记时间' }],
                                                })(
                                                    <DatePicker locale={locale} style={{ width: '12.76vw' }} className="registerDatePicker" showTime placeholder="请选择登记时间" onChange={this.registerOnChange} onOk={this.registerOnOk} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item label="*事件等级">
                                                {getFieldDecorator('grade', {
                                                    rules: [{ required: true, message: '请选择事件等级' }],
                                                })(
                                                    <Select
                                                        style={selectStyle}
                                                        className="grade"
                                                        size='large'
                                                        placeholder="请选择"
                                                    >
                                                        <Option key='1' value='一级'>一级</Option>
                                                        <Option key='2' value='二级'>二级</Option>
                                                        <Option key='3' value='三级'>三级</Option>
                                                    </Select>,
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="*事发区域">
                                                {getFieldDecorator('erea', {
                                                    rules: [{ required: true, message: '请输入事发区域' }],
                                                })(<Input className="area_input" placeholder='请输入事发区域' autoComplete='off' />)}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item label="*事件分类">
                                                {getFieldDecorator('classify', {
                                                    rules: [{ required: true, message: '请选择事件分类' }],
                                                })(
                                                    <Select
                                                        style={selectStyle}
                                                        className="classify"
                                                        size='large'
                                                        placeholder="请选择"
                                                    >
                                                        <Option key='1' value='紧急事件'>紧急事件</Option>
                                                        <Option key='2' value='一般事件'>一般事件</Option>
                                                    </Select>,
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="相应人员">
                                                {getFieldDecorator('person')(<Input className="person_input" autoComplete='off' />)}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item label="*事件标题">
                                                {getFieldDecorator('headline', {
                                                    rules: [{ required: true, message: '请输入事件标题' }],
                                                })(<Input className="headline_input" style={{ width: '31.2vw' }} placeholder='请输入事件标题' autoComplete='off' />)}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item label="*事件内容">
                                                {getFieldDecorator('contents', {
                                                    rules: [{ required: true, message: '请输入事件内容' }],
                                                })(
                                                    <TextArea className="contents_input" style={{ width: '31.2vw' }} placeholder="请输入事件内容" allowClear autoSize={{ minRows: 3, maxRows: 5 }} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item label="处理结果">
                                                {getFieldDecorator('result', {})(
                                                    <TextArea className="result_input" style={{ width: '31.2vw' }} placeholder="请输入处理结果" allowClear autoSize={{ minRows: 3, maxRows: 5 }} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={12}>
                                            <Form.Item label="备注">
                                                {getFieldDecorator('remark', {})(
                                                    <TextArea className="remark_input" style={{ width: '31.2vw' }} placeholder="请输入备注" allowClear autoSize={{ minRows: 3, maxRows: 5 }} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item wrapperCol={{ span: 12, offset: 15 }}>
                                        <Button className='okBtn' type="primary" htmlType="submit" onClick={this.updateForm}>修改</Button>
                                        <Button className='calcelBtn' onClick={this.handleCancel9}>取消</Button>
                                    </Form.Item>
                                </Form>
                            </div>
                            <div className="right_con"></div>
                        </div>
                    </Modal>
                </Content >
            </Layout >
        )
    }
}
const WrappedApp = Form.create({ name: 'coordinated' })(EmergencyCenter)
export default WrappedApp