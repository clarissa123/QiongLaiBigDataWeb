import React, { Component } from 'react'
import Top from '../../components/top/top'
import { DatePicker, Layout, Pagination, Icon } from 'antd'
import moment from 'moment'
import './projectDistribution.less'
import ReactEcharts from 'echarts-for-react'
import echarts from 'echarts'
import { Link } from 'react-router-dom'

import { ClassAllQueryProject, ClassAllQueryProjectOr, TownIndustryQueryAll } from '../../api/projectDistribution'

const { Content } = Layout

//项目管理的路由组件
export default class ProjectDistribution extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //投资额新增统计
            monthData: [],      //投资额当月新增
            lastMonthSum: [],   //投资额上月累计总额
            lastYearMomentData: [], //投资额去年同期水平
            //项目数新增统计
            numData: [],      //项目数当月新增
            lastMonthNumSum: [],   //项目数上月累计总额
            lastYearMomentNumData: [], //项目数去年同期水平
            //地域分布
            hy: [],    //行业
            qy: [],    //区域总览
            townName: [],    //镇名
            townName2: [],    //镇名
            value: [],        //项目数
            value2: [],        //项目数
            totalss: [],         //投资额
            totalss2: [],         //投资额

            //年份选择器
            isopen: false,      //是否开启
            time: moment(new Date().getFullYear(), 'YYYY'),         //年份
            year: new Date().getFullYear(),
            loading: false,
        }
    }

    componentDidMount() {
        //根据年份获取项目时间分布
        this.queryFromYear(this.state.year)
        //获取地域分布项目数
        this.getTownIndustryQueryAll(this.state.year)
        //获取地域分布投资额
        this.getTownIndustryQueryAll2(this.state.year)
    }

    toggle = value => {
        this.setState({ loading: value })
    };

    //获取新增统计
    getClassAllQueryProject = (year) => {
        TownIndustryQueryAll({ yea: year }).then(res => {
            //投资额
            let monthData = []
            let lastMonthSum = []
            let lastYearMomentData = []
            res.my.map((v, i) => {
                return monthData.push(v.totalss)
            })
            res.mylj.map((v, i) => {
                return lastMonthSum.push(v.totalss)
            })
            res.qnlj.map((v, i) => {
                return lastYearMomentData.push(v.totalss)
            })
            this.setState({
                monthData: monthData,
                lastMonthSum: lastMonthSum,
                lastYearMomentData: lastYearMomentData
            })
            //项目数
            let numData = []
            let lastMonthNumSum = []
            let lastYearMomentNumData = []
            res.my.map((v, i) => {
                return numData.push(v.value)
            })
            res.mylj.map((v, i) => {
                return lastMonthNumSum.push(v.value)
            })
            res.qnlj.map((v, i) => {
                return lastYearMomentNumData.push(v.value)
            })
            this.setState({
                numData: numData,
                lastMonthNumSum: lastMonthNumSum,
                lastYearMomentNumData: lastYearMomentNumData
            })
        })
    };

    //获取地域分布(项目数)
    getTownIndustryQueryAll = (year) => {
        ClassAllQueryProject({ yea: this.state.year }).then(res => {
            this.setState({
                xmfb: [],
                townName: [],
                value: [],
            })
            this.setState({
                xmfb: res.xmfb,
            })
            this.state.xmfb.map((v, i) => {
                this.setState({
                    townName: this.state.townName.concat(v.townName),
                    value: this.state.value.concat(v.value),
                    totalss: this.state.totalss.concat(v.totalss),
                })
            })
        })
    };

    //获取地域分布(投资额)
    getTownIndustryQueryAll2 = (year) => {
        ClassAllQueryProjectOr({ yea: this.state.year }).then(res => {
            this.setState({
                xmfb2: [],
                townName2: [],
                totalss2: [],
                value2: [],
            })
            this.setState({
                xmfb2: res.xmfbsum,
            })
            this.state.xmfb2.map((v, i) => {
                this.setState({
                    townName2: this.state.townName2.concat(v.townName),
                    value2: this.state.value2.concat(v.value),
                    totalss2: this.state.totalss2.concat(v.totalss),
                })
            })
        })

    };

    getOption1 = () => {
        let fontSize = 16
        let offset = 7
        let option = {
            grid: {
                left: '4%',   // 与容器左侧的距离
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    color: '#fff',
                    fontSize: 25,
                },
            },
            dataZoom: [
                {    //区域缩放组件
                    "show": false,   //是否显示组件
                    // 启动或关闭
                    "zoomLock": true,
                    "realtime": true,
                    "height": 12,   //组件高度
                    "xAxisIndex": [ //设置 dataZoom-inside 组件控制的 x轴,可以用数组表示多个轴 
                        0
                    ],
                    bottom: '8%',    //组件离容器下侧的距离
                    "start": 0,     //数据窗口范围的起始百分比,表示30%
                    "end": 30,      //数据窗口范围的结束百分比,表示70%
                    // handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                    // handleSize: '110%',
                    // handleStyle: {
                    //     color: "#d3dee5",
                    // },
                    textStyle: {
                        color: "#fff",
                        fontFamily: 'SourceHanSansCN-Normal',
                        fontSize: 25,
                    },
                    borderColor: "#90979c"  //边框颜色
                },
                {
                    "type": "inside",   //slider表示有滑动块的，inside表示内置的
                    "show": false,
                    "xAxisIndex": [0],
                    "height": 15,
                    "start": 1,
                    "end": 100,
                    "zoomOnMouseWheel": false
                }],
            xAxis: {
                type: 'category',
                offset: offset,
                axisLabel: {
                    show: true,
                    interval: 0,
                    textStyle: {
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: fontSize,
                    },
                },
                splitLine: {
                    show: false,
                }, //网格线
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['rgba(44,177,255,0.1)', 'rgba(44,177,255,0.04)'],
                    }
                },
                axisTick: { //刻度
                    show: false,
                },
                axisLine: {     //x轴
                    show: true,
                    lineStyle: {
                        color: '#186CB0',
                    },
                },
                data: this.state.townName,
            },
            yAxis: {
                type: 'value',
                margin: 16,
                minInterval: 1, //不显示小数，只显示整数
                axisTick: { //刻度
                    show: false,
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: fontSize
                    },
                },
                splitLine: {
                    show: false,
                }, //网格线
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#186CB0',
                    }
                },//y轴
            },
            series: [
                {
                    type: 'bar',
                    barWidth: '30%',
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    { offset: 0, color: '#2CB1FF' },
                                    { offset: 1, color: '#032564' }
                                ]
                            )
                        },
                        emphasis: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    { offset: 0, color: '#2CB1FF' },
                                    { offset: 1, color: '#032564' }
                                ]
                            )
                        }
                    },
                    data: this.state.value,
                }
            ],
        }
        return option
    };
    getOption2 = () => {
        let fontSize = 16
        let offset = 7
        let option = {
            grid: {
                left: '4%',   // 与容器左侧的距离
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    color: '#fff',
                    fontSize: 25,
                },
            },
            dataZoom: [{    //区域缩放 
                "show": false,   //是否显示组件
                "realtime": true,
                "height": 12,   //组件高度
                "xAxisIndex": [ //设置 dataZoom-inside 组件控制的 x轴,可以用数组表示多个轴 
                    0
                ],
                bottom: '8%',    //组件离容器下侧的距离
                "start": 0,     //数据窗口范围的起始百分比,表示30%
                "end": 30,      //数据窗口范围的结束百分比,表示70%
                handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                handleSize: '110%',
                handleStyle: {
                    color: "#d3dee5",

                },
                textStyle: {
                    color: "#fff",
                    fontSize: 25,
                },
                borderColor: "#90979c"  //边框颜色
            }, {
                "type": "inside",   //slider表示有滑动块的，inside表示内置的
                "show": false,
                "xAxisIndex": [0],
                "height": 15,
                "start": 1,
                "end": 100,
                "zoomOnMouseWheel": false
            }],
            xAxis: {
                type: 'category',
                offset: offset,
                interval: 0,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: fontSize
                    },
                },
                splitLine: {
                    show: false,
                }, //网格线
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['rgba(44,177,255,0.1)', 'rgba(44,177,255,0.04)'],
                    }
                },
                axisTick: { //刻度
                    show: false,
                },
                axisLine: {     //x轴
                    show: true,
                    lineStyle: {
                        color: '#186CB0',
                    },
                },
                data: this.state.townName2,
            },
            yAxis: {
                type: 'value',
                axisTick: { //刻度
                    show: false,
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: fontSize
                    },
                },
                splitLine: {
                    show: false,
                }, //网格线
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#186CB0',
                    }
                },//y轴
            },
            series: [
                {
                    type: 'bar',
                    barWidth: '30%',
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    { offset: 0, color: '#2CB1FF' },
                                    { offset: 1, color: '#032564' }
                                ]
                            )
                        },
                        emphasis: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    { offset: 0, color: '#2CB1FF' },
                                    { offset: 1, color: '#032564' }
                                ]
                            )
                        }
                    },
                    data: this.state.totalss2,
                }
            ]
        }

        return option
    };
    getOption3 = () => {
        let fontSize = 16
        let symbolSize = 14
        let legend_itemWidth = 30
        let legend_itemHeight = 18
        let lineStyle = 3
        let option = {
            "tooltip": {
                "trigger": "axis",
                "axisPointer": {
                    "type": "shadow",
                },
                'textStyle': {
                    color: '#fff',
                    fontSize: 25,
                },
                formatter:
                    function (params, ticket, callback) {
                        // return '{b}<br/>{a0}:{c0}个<br/>{a1}:{c1}个<br/>{a2}:{c2}个<br/>'
                        var res = params[0].name
                        for (var i = 0, l = params.length;i < l;i++) {
                            if (params[i].value !== undefined) {
                                res += '<br/>' + params[i].seriesName + ' : ' + params[i].value + '万元'
                            } else {
                                res += '<br/>' + params[i].seriesName + ' : ' + '0.00万元'
                            }

                        }
                        return res
                        // setTimeout(function () {
                        //     // 仅为了模拟异步回调
                        //     callback(ticket, res);
                        // }, 1000)
                        // return 'loading';
                    }
            },
            "grid": {
                "borderWidth": 0,
                "top": '15%',
                "bottom": '10%',
                textStyle: {
                    color: "#fff",
                    fontSize: 25,
                }
            },
            "legend": {
                x: 'right',
                padding: [0, 56, 0, 0],   //可设定图例 [距上方距离，距右方距离，距下方距离，距左方距离]
                top: '0',
                textStyle: {
                    color: '#fff',
                    fontSize: fontSize,
                },
                "data": ['去年同期水平', '当月新增', '上月累计总额'],
                itemWidth: legend_itemWidth,
                itemHeight: legend_itemHeight,
            },
            "calculable": true,
            "xAxis": [{
                "type": "category",
                "axisLine": {
                    "show": true,
                    "lineStyle": {
                        color: 'rgba(44,177,255,0.5)'
                    }
                },
                "splitLine": {
                    "show": false
                },
                "axisTick": {
                    "show": false
                },
                "splitArea": {
                    "show": true,
                    "interval": 0,
                    "areaStyle": {
                        color: ['rgba(44,177,255,0.1)', 'rgba(44,177,255,0.04)'],
                    }
                },
                "axisLabel": {
                    "show": true,
                    "interval": 0,
                    "textStyle": {
                        color: '#fff',
                        fontSize: fontSize
                    },

                },
                "data": ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月',],
            }],
            "yAxis": [{
                "type": "value",
                "name": '投资额/万元',
                "nameTextStyle": {
                    color: '#fff',
                    fontSize: fontSize,
                    padding: 10

                },
                "splitLine": {
                    "show": false
                },
                "axisLine": {
                    "show": true,
                    "lineStyle": {
                        color: 'rgba(44,177,255,0.5)'
                    }
                },
                "axisTick": {
                    "show": false
                },
                "axisLabel": {
                    "show": true,
                    "interval": 0,
                    "textStyle": {
                        color: '#fff',
                        fontSize: fontSize
                    },

                },
                "splitArea": {
                    "show": false
                },

            }],
            "series": [
                {
                    "name": "上月累计总额",
                    "type": "bar",
                    "stack": "总量",
                    "itemStyle": {
                        "normal": {
                            "color": new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    { offset: 0, color: 'rgba(44,177,255,1)' },
                                    { offset: 1, color: 'rgba(43,176,255,0)' }
                                ]
                            ),
                            "barBorderRadius": 0,
                            "label": {
                                "show": false,
                                "position": "top",
                                "textStyle": {
                                    "color": "#fff",
                                    "fontSize": fontSize
                                },
                                formatter: function (p) {
                                    return p.value > 0 ? (p.value) : ''
                                }
                            }
                        }
                    },
                    "data": this.state.lastMonthSum
                },
                {
                    "name": "当月新增",
                    "type": "bar",
                    "stack": "总量",
                    "barMaxWidth": 20,
                    "barGap": "10%",
                    "itemStyle": {
                        "normal": {
                            "color": "#F5AB6B",
                            "label": {
                                "show": true,
                                "textStyle": {
                                    "color": "#fff",
                                    "fontSize": fontSize
                                },
                                "position": "top",
                                formatter: function (p) {
                                    return p.value > 0 ? (p.value) : ''
                                }
                            }
                        }
                    },
                    "data": this.state.monthData,
                },
                {
                    "name": "去年同期水平",
                    "type": "line",
                    symbolSize: symbolSize,
                    // symbol: 'circle',
                    "itemStyle": {
                        "normal": {
                            "color": "#3E82F7",
                            "barBorderRadius": 0,
                            "lineStyle": {
                                "width": lineStyle    //设置线条粗细
                            },
                            "label": {
                                "show": true,
                                "position": "top",
                                "textStyle": {
                                    "color": "#fff",
                                    "fontSize": fontSize
                                },
                                formatter: function (p) {
                                    return p.value > 0 ? (p.value) : ''
                                }
                            }
                        }
                    },
                    "data": this.state.lastYearMomentData
                },
            ]
        }
        return option
    };
    getOption4 = () => {
        let fontSize = 16
        let symbolSize = 14
        let legend_itemWidth = 30
        let legend_itemHeight = 18
        let lineStyle = 3
        let option = {
            "tooltip": {
                "trigger": "axis",
                "axisPointer": {
                    "type": "shadow",
                },
                'textStyle': {
                    color: '#fff',
                    fontSize: 25,
                },
                formatter:
                    function (params, ticket, callback) {
                        // return '{b}<br/>{a0}:{c0}个<br/>{a1}:{c1}个<br/>{a2}:{c2}个<br/>'
                        var res = params[0].name
                        for (var i = 0, l = params.length;i < l;i++) {
                            res += '<br/>' + params[i].seriesName + ' : ' + params[i].value + '个'
                        }
                        return res
                        // setTimeout(function () {
                        //     // 仅为了模拟异步回调
                        //     callback(ticket, res);
                        // }, 1000)
                        // return 'loading';
                    }
            },
            "grid": {
                "borderWidth": 0,
                "top": '15%',
                "bottom": '10%',
                textStyle: {
                    color: "#fff",
                    fontSize: fontSize
                }
            },
            "legend": {
                x: 'right',
                padding: [0, 56, 0, 0],   //可设定图例 [距上方距离，距右方距离，距下方距离，距左方距离]
                top: '0',
                textStyle: {
                    color: '#fff',
                    fontSize: fontSize,
                },
                "data": ['去年同期水平', '当月新增', '上月累计总额'],
                itemWidth: legend_itemWidth,
                itemHeight: legend_itemHeight,
            },
            "calculable": true,
            "xAxis": [{
                "type": "category",
                "axisLine": {
                    "show": true,
                    "lineStyle": {
                        color: 'rgba(44,177,255,0.5)'
                    }
                },
                "splitLine": {
                    "show": false
                },
                "axisTick": {
                    "show": false
                },
                "splitArea": {
                    "show": true,
                    "interval": 1,
                    "areaStyle": {
                        color: ['rgba(44,177,255,0.1)', 'rgba(44,177,255,0.04)'],
                    }
                },
                "axisLabel": {
                    "show": true,
                    "interval": 0,
                    "textStyle": {
                        color: '#fff',
                        fontSize: fontSize
                    },

                },
                "data": ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月',],
            }],
            "yAxis": [{
                "type": "value",
                "name": '项目数/个数',
                "nameTextStyle": {
                    color: '#fff',
                    fontSize: fontSize,
                    padding: 10

                },
                "splitLine": {
                    "show": false
                },
                "axisLine": {
                    "show": true,
                    "lineStyle": {
                        color: 'rgba(44,177,255,0.5)'
                    }
                },
                "axisTick": {
                    "show": false
                },
                "axisLabel": {
                    "show": true,
                    "interval": 0,
                    "textStyle": {
                        color: '#fff',
                        fontSize: fontSize,
                    },

                },
                "splitArea": {
                    "show": false
                },

            }],
            "series": [
                {
                    "name": "上月累计总额",
                    "type": "bar",
                    "stack": "总量",
                    "itemStyle": {
                        "normal": {
                            "color": new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    { offset: 0, color: 'rgba(44,177,255,1)' },
                                    { offset: 1, color: 'rgba(43,176,255,0)' }
                                ]
                            ),
                            "barBorderRadius": 0,
                            "label": {
                                "show": false,
                                "position": "top",
                                "textStyle": {
                                    "color": "#fff",
                                    "fontSize": fontSize
                                },
                                formatter: function (p) {
                                    return p.value > 0 ? (p.value) : ''
                                }
                            }
                        }
                    },
                    "data": this.state.lastMonthNumSum
                },
                {
                    "name": "当月新增",
                    "type": "bar",
                    "stack": "总量",
                    "barMaxWidth": 20,
                    "barGap": "10%",
                    "itemStyle": {
                        "normal": {
                            "color": "#F5AB6B",
                            "label": {
                                "show": true,
                                "textStyle": {
                                    "color": "#fff",
                                    "fontSize": fontSize
                                },
                                "position": "top",
                                formatter: function (p) {
                                    return p.value > 0 ? (p.value) : ''
                                }
                            }
                        }
                    },
                    "data": this.state.numData
                },
                {
                    "name": "去年同期水平",
                    "type": "line",
                    symbolSize: symbolSize,
                    // symbol: 'circle',
                    "itemStyle": {
                        "normal": {
                            "color": "#3E82F7",
                            "barBorderRadius": 0,
                            "label": {
                                "show": true,
                                "position": "top",
                                "textStyle": {
                                    "color": "#fff",
                                    "fontSize": fontSize
                                },
                                formatter: function (p) {
                                    return p.value > 0 ? (p.value) : ''
                                }
                            },
                            "lineStyle": {
                                "width": lineStyle    //设置线条粗细
                            },
                        }
                    },
                    "data": this.state.lastYearMomentNumData
                },
            ]
        }
        return option
    };

    handlePanelChange = (value) => {
        this.setState({
            time: null,
            isopen: false,
            year: null,
        }, () => {
            const year = value._d.getFullYear()
            this.setState({
                time: value,
                isopen: false,
                year: year,
            }, () => {
                //根据年份获取项目时间分布
                this.queryFromYear(this.state.year)
                //根据年份获取地域分布(项目数)
                this.getTownIndustryQueryAll(this.state.year)
                //根据年份获取地域分布(投资额)
                this.getTownIndustryQueryAll2(this.state.year)
            })
        })
    };

    //根据年份获取项目时间分布
    queryFromYear(year) {
        this.getClassAllQueryProject(this.state.year)
    }

    handleOpenChange = (status) => {
        if (status) {
            this.setState({ isopen: true })
        } else {
            this.setState({ isopen: false })
        }
    };
    clearValue = () => {
        this.setState({
            time: null,
            year: '',
        })
    }

    render() {
        return (
            <Layout>
                <Top />
                <Content className='projectDistribution'>
                    <div className="overview"><span>项目分布</span></div>
                    <div className='projectDistribution_content'>
                        <div className="area_distribution">
                            <div className="area_distribution_title">
                                <span>邛崃市各地区项目地域分布</span>
                            </div>
                            <div className="area_distribution_content">
                                <div className="item">
                                    <div className="item_title"><span>项目数</span></div>
                                    <div className="item_content">
                                        <ReactEcharts option={this.getOption1()} theme="Imooc"
                                            style={{ height: '21vw' }} />
                                    </div>
                                </div>
                                <div className="investment">
                                    <div className="investment_title"><span>投资额</span></div>
                                    <div className="investment_content">
                                        <ReactEcharts option={this.getOption2()} theme="Imooc"
                                            style={{ height: '21vw' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="industry_distribution">
                            <div className="industry_distribution_title">
                                <span>邛崃市项目时间分布</span>
                                <Link to='/insertProject'><span><Icon type="plus-circle" theme="twoTone" twoToneColor="#32C889" />新增项目</span></Link>
                            </div>

                            <div className="industry_distribution_content">
                                <div className="industry_distribution_content1">
                                    <div className="money_con">
                                        <div className="distribution_title">
                                            <div className="distribution_tit"><span>邛崃市项目投资额新增统计</span></div>
                                            <div className="year_select3">
                                                <DatePicker
                                                    value={this.state.time}
                                                    open={this.state.isopen}
                                                    mode="year"
                                                    placeholder='请选择年份'
                                                    format={"YYYY"}
                                                    onOpenChange={this.handleOpenChange}
                                                    onPanelChange={this.handlePanelChange}
                                                    onChange={this.clearValue}
                                                    className='year_input3'
                                                />
                                            </div>
                                        </div>
                                        <div className="distribution_content">
                                            <ReactEcharts option={this.getOption3()} theme="Imooc"
                                                style={{ height: '18vw' }} />
                                        </div>
                                    </div>
                                </div>

                                <div className="industry_distribution_content2">
                                    <div className="money_con">
                                        <div className="distribution_title">
                                            <div className="distribution_tit2"><span>邛崃市旅游项目数新增统计</span></div>
                                        </div>
                                        <div className="distribution_content">
                                            <ReactEcharts option={this.getOption4()} theme="Imooc"
                                                style={{ height: '18vw' }} />
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </Content>
            </Layout>
        )
    }
}
