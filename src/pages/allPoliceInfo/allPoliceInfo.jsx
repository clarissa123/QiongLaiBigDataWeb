import React, { Component } from 'react'
import Top from '../../components/top/top'
import './allPoliceInfo.less';
import { Link } from 'react-router-dom';
import { Button, Layout, message, Pagination } from "antd"
import { getCallPoliceInfo, getCallThePoliceHint } from '../../api/emergencyCenter';

const { Content } = Layout;
export default class AllWarningInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //报警人信息
            callPoliceInfo: [],
            //分页信息
            uPage: [],
            currentPage: 1,      //默认第一页
        };
    }
    componentDidMount() {
        this.getPoliceInfo(this.state.currentPage);
    };
    getPoliceInfo = (page) => {
        getCallPoliceInfo({ currentPage: page }).then(res => {
            this.setState({
                callPoliceInfo: res.yk,    //报警人信息
                uPage: res.uPage,          //分页信息
            })
        });
    };

    changeStatus = (id) => {
        getCallThePoliceHint({ id: id }).then(res => {
            if (res === true) {
                message.success('修改状态成功');
                this.setState({
                    
                });
                this.getPoliceInfo(this.state.currentPage);
            }
        });
    }

    //分页
    changePage = (page, pageSize) => {
        this.setState({
            currentPage: page,
        }, function () {
            this.getPoliceInfo(this.state.currentPage);
        });
    };

    render() {
        return (
            <Layout>
                <Top />
                <Content className='allPoliceInfo'>
                    <div className='overview'>
                        <Link to='/emergencyCenter'><span>返回应急指挥</span></Link>
                    </div>
                    <div className='allPoliceInfo_content'>
                        <div className="allPoliceInfo_title">
                            <span>全部报警信息</span>
                        </div>
                        <div className="allPoliceInfo_table">
                            {
                                this.state.callPoliceInfo.length === 0 ? '暂无数据' :
                                    this.state.callPoliceInfo.map((val, key) => {
                                        return (
                                            <div className="item" key={val.id} >
                                                <div className='left'>
                                                    <div className="item_name">
                                                        <span>报警人昵称：</span>
                                                        <span>{val.nickname}</span>
                                                    </div>
                                                    <div className="item_phone">
                                                        <span>报警人电话：</span>
                                                        <span>{val.phone}</span>
                                                    </div>
                                                    <div className="item_time">
                                                        <span>报警时间：</span>
                                                        <span>{val.times}</span>
                                                    </div>
                                                    <div className="item_address">
                                                        <span>报警地址：</span>
                                                        <span>{val.townName}</span>
                                                    </div>
                                                </div>
                                                <div className='right'>
                                                    <div className='item_status'>
                                                        <span>状态：</span>
                                                        <span>{val.states}</span>
                                                    </div>
                                                    <div className="item_btn" style={{ display: val.states === '已处理' ? 'none' : 'inline-block' }}>
                                                        <Button className='handle' onClick={this.changeStatus.bind(this, val.id)}>已处理</Button>
                                                    </div>

                                                </div>
                                            </div>
                                        )
                                    })
                            }
                            <div className='pagination'>
                                <Pagination
                                    size="small"
                                    hideOnSinglePage={true}
                                    total={this.state.uPage.totalNumber}
                                    defaultPageSize={this.state.uPage.paging}
                                    onChange={this.changePage}
                                />
                            </div>
                        </div>
                    </div>
                </Content>
            </Layout>
        )

    };
}