import React, { Component } from 'react'
import Top from '../../components/top/top'
import { Layout, Button, Pagination, message, Modal, Icon, DatePicker } from 'antd'
import './projectList.less'
import { getProjectMesQueryAll, projectMesDelete } from '../../api/projectList'
import yellowTip from '../allWarningInfo/images/call_police_2.png'
import { Link } from 'react-router-dom'
import moment from 'moment'

const { Content } = Layout
//项目管理的路由组件
export default class ProjectList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPage: 1,      //默认第一页
            qy: [],               //区域
            hy: [],               //行业
            xmlb: [],             //项目列表
            townName: null,       //项目区域
            totalsYea: null,      //本年投资额
            totals: null,         //总投资
            classify: null,       //行业分类
            uPage: {},             //分页集合
            totalNumber: 1,       //总条数
            paging: 4,            //每页显示几条
            totalPage: 1,         //总页数
            clicktownName: null,    //被点击的镇名
            clickClassify: null,    //被点击的行业
            clickMoney: null,       //被点击的总投资额
            clickTotalsYea: null,       //被点击的本年投资额
            visible: false,       //删除弹框状态
            color: 'rgba(245,171,107,1)',//删除弹窗的颜色
            id: '',
            //年份选择器
            isopen: false,      //是否开启
            time: moment(new Date().getFullYear(), 'YYYY'),     //年份
            year: new Date().getFullYear(),
        }
    }

    componentDidMount() {
        this.getProjectMesQueryAll(this.state.year, null, null, null, null, this.state.currentPage, this.state.paging)
    }

    getProjectMesQueryAll = (yearParams, moneyParams, totalsYeaParams, classifyParams, townNameParams, currentPage, paging) => {
        getProjectMesQueryAll({
            year: yearParams,
            totals: moneyParams,
            totalsYea: totalsYeaParams,
            classify: classifyParams,
            townName: townNameParams,
            currentPage: currentPage,
            paging: paging,
        }).then(res => {
            console.log('res----------',res);
            this.setState({
                qy: res.qy,
                hy: res.hy,
                xmlb: res.xmlb,
                uPage: res.uPage,
                totalNumber: res.uPage.totalNumber,
                totalPage: res.uPage.totalPage,
                currentPage: res.uPage.currentPage,
            })
        })
    };
    showModal = (id, name) => {
        this.setState({
            visible: true,
            id: id,
            name: name,
        })
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        })
    };
    //根据镇名获取数据
    handleClickTownName = (params) => {
        this.setState({
            clicktownName: params,
            townName: params,
        }, function () {
            this.getProjectMesQueryAll(this.state.year, this.state.totals, this.state.totalsYea, this.state.classify, this.state.townName, this.state.currentPage, this.state.paging)
        })

    };
    //根据行业分类获取数据
    handleClickName = (params) => {
        this.setState({
            clickClassify: params,
            classify: params,
        }, function () {
            this.getProjectMesQueryAll(this.state.year, this.state.totals, this.state.totalsYea, this.state.classify, this.state.townName, this.state.currentPage, this.state.paging)
        })
    };
    //根据投资额获取数据（总投资）
    handleClickMoney = (params) => {
        this.setState({
            clickMoney: params,
            totals: params,
        }, function () {
            this.getProjectMesQueryAll(this.state.year, this.state.totals, this.state.totalsYea, this.state.classify, this.state.townName, this.state.currentPage, this.state.paging)
        })
    };
    //根据投资额获取数据（本年投资）
    handleClickMoneyThisYear = (params) => {
        this.setState({
            totalsYea: params,
            clickTotalsYea: params,
        }, function () {
            this.getProjectMesQueryAll(this.state.year, this.state.totals, this.state.totalsYea, this.state.classify, this.state.townName, this.state.currentPage, this.state.paging)
        })
    };
    //分页
    changePage1 = (page, pageSize) => {
        this.setState({
            currentPage: page,
        }, function () {
            this.getProjectMesQueryAll(this.state.year, this.state.totals, this.state.totalsYea, this.state.classify, this.state.townName, this.state.currentPage, this.state.paging)
        })
    };
    //删除数据
    deleteProject = (id) => {
        projectMesDelete({ id }).then(res => {
            if (res !== true) return message.error('删除失败')
            this.getProjectMesQueryAll(this.state.year, this.state.totals, this.state.totalsYea, this.state.classify, this.state.townName, this.state.currentPage, this.state.paging)
        })
        this.handleCancel()
    };
    // 年份选择器
    handlePanelChange = (value) => {
        const year = parseInt(JSON.stringify(value._d).slice(1, 5)) + 1
        this.setState({
            time: value,
            isopen: false,
            year: year,
            currentPage: 1,
        }, () => {
            //根据年份获取数据
            this.changePage1(this.state.currentPage)
            this.getProjectMesQueryAll(this.state.year, null, null, null, null, this.state.currentPage,this.state.paging)
        })
    };
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
            year: ''
        })
    };

    render() {
        return (
            <Layout>
                <Top />
                <Content className='projectList'>
                    <div className="overview"><span>项目列表</span></div>
                    <div className='projectList_content'>
                        <div className="advanced_screening_title">
                            <div className="year_select2">
                                <DatePicker
                                    value={this.state.time}
                                    open={this.state.isopen}
                                    mode="year"
                                    placeholder='请选择年份'
                                    format="YYYY"
                                    onOpenChange={this.handleOpenChange}
                                    onPanelChange={this.handlePanelChange}
                                    onChange={this.clearValue}
                                    className='year_input2'
                                />
                            </div>
                            <span class='tit'>高级筛选</span>
                            <Link to='/insertProject'><span className='add_btn'><Icon type="plus-circle" theme="twoTone" twoToneColor="#32C889" />新增项目</span></Link>
                        </div>
                        <div className="advanced_filter">
                            <div className="advanced_filter_container">
                                <div className="area">
                                    <span>区&emsp;&emsp;域</span>
                                    <span className={`all ${this.state.clicktownName === null ? 'activeCls' : ''}`}
                                        onClick={this.handleClickTownName.bind(this, null)}>全部</span>
                                    <div className='area_con'>
                                        {
                                            this.state.qy.length === 0 ? '暂无数据' :
                                                this.state.qy.map((val, key) => {
                                                    return (
                                                        <span key={val.id}
                                                            className={`${this.state.clicktownName === val.townName ? 'activeCls' : ''}`}
                                                            onClick={this.handleClickTownName.bind(this, val.townName)}>{val.townName}</span>
                                                    )
                                                })
                                        }
                                    </div>
                                </div>
                                <div className="distribution">
                                    <span>行业分布</span>
                                    <span className={`all ${this.state.clickClassify === null ? 'activeCls' : ''}`}
                                        onClick={this.handleClickName.bind(this, null)}>全部</span>
                                    <div className="distribution_con">
                                        {
                                            this.state.hy.length === 0 ? '暂无数据' :
                                                this.state.hy.map((val, key) => {
                                                    return (
                                                        <span key={val.id}
                                                            className={`${this.state.clickClassify === val.name ? 'activeCls' : ''}`}
                                                            onClick={this.handleClickName.bind(this, val.name)}>{val.name}</span>
                                                    )
                                                })
                                        }
                                    </div>
                                </div>
                                <div className="total_investment">
                                    <span>总&nbsp; 投&nbsp;资</span>
                                    <span className={`all ${this.state.clickMoney === null ? 'activeCls' : ''}`}
                                        onClick={this.handleClickMoney.bind(this, null)}>全部</span>
                                    <div className="total_investment_con">
                                        <span onClick={this.handleClickMoney.bind(this, 1)}
                                            className={`${this.state.clickMoney === 1 ? 'activeCls' : ''}`}>1亿元以下</span>
                                        <span onClick={this.handleClickMoney.bind(this, 2)}
                                            className={`${this.state.clickMoney === 2 ? 'activeCls' : ''}`}>1-2亿元</span>
                                        <span onClick={this.handleClickMoney.bind(this, 3)}
                                            className={`${this.state.clickMoney === 3 ? 'activeCls' : ''}`}>2-3亿元</span>
                                        <span onClick={this.handleClickMoney.bind(this, 4)}
                                            className={`${this.state.clickMoney === 4 ? 'activeCls' : ''}`}>3亿元</span>
                                    </div>
                                </div>
                                <div className="investment_this_year">
                                    <span>本年投资</span>
                                    <span className={`all ${this.state.clickTotalsYea === null ? 'activeCls' : ''}`}
                                        onClick={this.handleClickMoneyThisYear.bind(this, null)}>全部 </span>
                                    <div className="investment_this_year_con">
                                        <span onClick={this.handleClickMoneyThisYear.bind(this, 5)}
                                            className={`${this.state.clickTotalsYea === 5 ? 'activeCls' : ''}`}>1亿元以下</span>
                                        <span onClick={this.handleClickMoneyThisYear.bind(this, 6)}
                                            className={`${this.state.clickTotalsYea === 6 ? 'activeCls' : ''}`}>1-2亿元</span>
                                        <span onClick={this.handleClickMoneyThisYear.bind(this, 7)}
                                            className={`${this.state.clickTotalsYea === 7 ? 'activeCls' : ''}`}>2-3亿元</span>
                                        <span onClick={this.handleClickMoneyThisYear.bind(this, 8)}
                                            className={`${this.state.clickTotalsYea === 8 ? 'activeCls' : ''}`}>3亿元</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="advanced_screening_content">
                            <div className="advanced_screening_table">
                                {
                                    (this.state.xmlb.length === 0) ? '暂无数据' :
                                        this.state.xmlb.map((val, key) => {
                                            return (
                                                <div className="advanced_screening_table_box" key={val.id}>
                                                    <div className="name">
                                                        <span>{val.name}</span>
                                                    </div>
                                                    <div className="info">
                                                        <div className="townName"><span>项目区域：{val.townName}</span></div>
                                                        <div className="fundsSourec"><span>资金来源：{val.fundsSourec}</span></div>
                                                        <div className="planDate"><span>计划起止日期：{val.dates} ～ {val.datef}</span></div>
                                                        <div className="totals"><span>本月累计投资：{val.totals}</span></div>
                                                        <div className="classify"><span>行业分类：{val.classify}</span></div>
                                                    </div>
                                                    <div className="btn">
                                                        <Link to={`/projectDetails/${val.id}`}>
                                                            <Button className='details' type="link">查看详情</Button>
                                                        </Link>
                                                        <Link to={`/updateProject/${val.id}`}>
                                                            <Button className='edit' type="link">编辑</Button>
                                                        </Link>
                                                        <Button className='edit' type="link" onClick={
                                                            // this.deleteProject(val.id)
                                                            this.showModal.bind(this, val.id, val.name)
                                                        }>删除</Button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                }
                                <div className='pagination'>
                                    <Pagination
                                        size="small"
                                        current={this.state.currentPage}
                                        defaultCurrent={this.state.currentPage}
                                        hideOnSinglePage={true}
                                        total={parseInt(this.state.totalNumber)}
                                        defaultPageSize={parseInt(this.state.paging)}
                                        onChange={this.changePage1}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 提示是否删除弹窗 */}
                    <Modal
                        wrapClassName={'myModalDel'}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        width='43.46vw'
                    >
                        <div className="modal_title">
                            <span>项目删除</span>
                            <span></span>
                        </div>
                        <div className="modal_content">
                            <div className="warn_pic">
                                <img src={yellowTip} alt="" />
                                <span></span>
                            </div>
                            <div className='warn_con'
                                style={{ color: this.state.color }}>是否确认删除“{this.state.name}”?</div>
                            <Button className='myButton' style={{ backgroundColor: this.state.color }}
                                onClick={() => { this.deleteProject(this.state.id) }}>确定 </Button>
                            <Button className='myButton' style={{ backgroundColor: this.state.color }}
                                onClick={this.handleCancel}>取消 </Button>
                        </div>
                    </Modal>
                </Content>
            </Layout>
        )
    }
}
