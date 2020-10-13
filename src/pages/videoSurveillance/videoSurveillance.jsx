import React, { Component } from 'react'
import './videoSurveillance.less'
import { Layout, Menu, Dropdown, Modal, Pagination, Spin, Select } from 'antd'
import Top from '../../components/top/top'
import { getAreaQueryAll, getScenicDetail, allVideo, videoByName, scenicVideo } from '../../api/videoSurveillance'

import 'video.js/dist/video-js.min.css'
import videojs from 'video.js'

const { Option } = Select
const { Content } = Layout
let Swiper = window.Swiper
const menu = (
    <Menu className='video_menu'>
        <Menu.Item>
            <a href="http://www.alipay.com/">
                <span>景点一</span>
            </a>
        </Menu.Item>
        <Menu.Item>
            <a href="http://www.taobao.com/">
                <span>景点二</span>
            </a>
        </Menu.Item>
        <Menu.Item>
            <a href="http://www.tmall.com/">
                <span>景点三</span>
            </a>
        </Menu.Item>
        <Menu.Item>
            <a href="http://www.tmall.com/">
                <span>景点四</span>
            </a>
        </Menu.Item>
    </Menu>
)

//视频监控的路由组件
export default class VideoSurveillance extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            scenic_spot: [],    //景区列表
            //景点分页
            currentPage: 1, //当前页码
            scenicList: [],
            areaName: '',
            scenicSpotName: '',
            tableDate: [],
            videoValue: '',
            videoName: '',
            totalNumber: undefined,
            paging: undefined,
            videoId: 0,
            videoList: [],
            videos: [],
            current: 1,
            showPoint: 'none',
            name1: '雪亮工程',
        }
    }
    componentWillMount() {
        // window.location.reload()
        // this.props.history.push("/videoSurveillance")
        // if (this.swiper) { // 销毁swiper
        //     this.swiper.destroy()
        // }
    }

    componentDidMount(videoValue) {
        var time = (new Date()).getTime()
        this.setState({
            videoId: time
        })
        // this.state.videoId = time;
        getAreaQueryAll().then(res => {
            this.setState({
                scenic_spot: res.qyxx,
            })
            const areaName = res.qyxx[0].areaName
            this.setState({
                areaName
            })
            const obj = {
                areaName,
                currentPage: this.state.currentPage
            }
            scenicVideo(obj).then(res => {
                this.setState({
                    tableDate: res.video,
                    totalNumber: res.uPage.totalNumber,
                    paging: res.uPage.paging
                })
                this.autoPlayVideo(res.video)
            })
        })
    };
    componentWillUnmount() {
        this.state.videoList.map((item) => {
            item.dispose()
        })
        //     if (this.swiper) { // 销毁swiper
        //         this.swiper.destroy()
        //     }
    }
    componentDidUpdate() {
        // console.log('in')
        // console.log(this.state.tableDate)
        // var myVideos
        // // console.log(document.querySelector('#video187'))
        // this.state.tableDate.forEach(item => {
        //     // console.log(item.videoValue)
        //     myVideos = videojs("video" + item.id, {
        //         bigPlayButton: true,
        //         textTrackDisplay: false,
        //         posterImage: false,
        //         errorDisplay: false
        //     })
        //     // console.log(myVideos)
        //     myVideos.src({
        //         // src: 'https://cdn.letv-cdn.com/2018/12/05/JOCeEEUuoteFrjCg/playlist.m3u8',
        //         src: item.videoValue,
        //         type: 'application/x-mpegURL'
        //     })
        //     myVideos.play()
        //     if (item.videoValue) {
        //         // if (/\.m3u8$/.test(src)) {
        //         //     _this.setState({
        //         //         videoValue: src
        //         //     })
        //         //     myVideo.src({
        //         //         src: 'https://cdn.letv-cdn.com/2018/12/05/JOCeEEUuoteFrjCg/playlist.m3u8',
        //         //         type: 'application/x-mpegURL'
        //         //     })
        //         // } else {
        //         //     myVideo.src(src)
        //         // }
        //         myVideos.src({
        //             // src: 'https://cdn.letv-cdn.com/2018/12/05/JOCeEEUuoteFrjCg/playlist.m3u8',
        //             src: item.videoValue,
        //             type: 'application/x-mpegURL'
        //         })
        //         myVideos.load()
        //         myVideos.play()
        //     }
        // })

        // if (this.swiper) {
        //     this.swiper.slideTo(0, 0)
        //     this.swiper.destroy()
        //     this.swiper = null;
        // }
        // this.swiper = new Swiper(this.refs.lun, {
        //     loop: true,
        //     pagination: {
        //         el: '.swiper-pagination',
        //         clickable: true,
        //     },
        // });

        // this.handleSwiper();
    };

    //swiper滑动
    // handleSwiper() {
    //     var swiper = new Swiper('.swiper-container', {
    //         // spaceBetween: 20,
    //         autoHeight: true,
    //         autoWidth: true,
    //         watchOverflow: true,//当没有足够的slide切换时，例如只有1个slide（非loop），swiper会失效且隐藏导航。
    //         slidesPerView: 'auto',
    //         freeMode: true,//默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合
    //         grabCursor: true,//设置为true时，鼠标覆盖Swiper时指针会变成手掌形状，拖动时指针会变成抓手形状
    //         nextButton: '.swiper-button-next',//绑定下一页的控制按钮
    //         prevButton: '.swiper-button-prev',//绑定上一页的控制按钮
    //         fade: {
    //             crossFade: true,
    //         },
    //         // loop : true,//让Swiper看起来是循环的。
    //         // effect : 'slide',//切换效果：默认为“位移切换”。
    //         // autoplay: {//启动自动切换，具体选项如下：
    //         //     delay: 3000,//自动切换的时间间隔，单位ms
    //         //     stopOnLastSlide: false,//如果设置为true，当切换到最后一个slide时停止自动切换。（loop模式下无效）。
    //         //     disableOnInteraction: false,//用户操作swiper之后，是否禁止autoplay。默认为true：停止。
    //         // },
    //         // pagination: {   // 如果需要分页器，类名要和 HTML 中的相对应
    //         //     el: '.swiper-pagination',//自动隐藏
    //         //     clickable: true,
    //         // },
    //         navigation: {
    //             nextEl: '.swiper-button-next',
    //             prevEl: '.swiper-button-prev',
    //         },
    //         onTransitionEnd: function (swiper) {
    //             if (swiper.activeIndex === 0) {
    //                 swiper.container[0].style.width = '90%';
    //                 swiper.container[0].style.marginLeft = '0';
    //             }
    //             else {
    //                 swiper.container[0].style.width = '78%';
    //                 swiper.container[0].style.marginLeft = '11.5vw';
    //             }
    //         },
    //     })
    // }

    // 视频自动播放
    autoPlayVideo(lists) {
        // console.log(this.state.tableDate)
        // if(this.state.tableDate != '') {
        // this.state.tableDate.forEach(item => {
        lists.forEach(item => {
            // var id = this.state.videoId + item.id
            var myVideos = videojs("video" + item.id, {
                bigPlayButton: true,
                textTrackDisplay: false,
                posterImage: false,
                errorDisplay: false
            })

            // console.log(myVideos)
            myVideos.src({
                src: item.videoValue,
                // src: 'https://cdn.letv-cdn.com/2018/12/05/JOCeEEUuoteFrjCg/playlist.m3u8',
                type: 'application/x-mpegURL'
            })
            myVideos.play().catch(error => {
            })
            this.state.videoList.push(myVideos)
            if (item.videoValue) {
                myVideos.src({
                    src: item.videoValue,
                    // src: 'https://cdn.letv-cdn.com/2018/12/05/JOCeEEUuoteFrjCg/playlist.m3u8',
                    type: 'application/x-mpegURL'
                })
                myVideos.load()
                myVideos.play().catch(error => {
                })
            }
        })

        // }
    }
    //获取菜单名称
    getScenicSpot = () => {
        let tempArr = []
        getAreaQueryAll().then(res => {
            // console.log(res.qyxx[0].areaName)
            // console.log(res);
            this.setState({
                scenic_spot: res.qyxx,
            })
            const areaName = res.qyxx[0].areaName
            // getScenicDetail({areaName: res.qyxx[0].areaName}).then(res => {
            //     console.log(res)
            //     // console.log(res.jdxx[0].scenicSpotName)
            //     this.setState({
            //        areaName,
            //        scenicSpotName: res.jdxx[0].scenicSpotName
            //     })
            //     const obj = {
            //         areaName,
            //         currentPage: this.state.currentPage,
            //         scenicSpotName: res.jdxx[0].scenicSpotName
            //     }
            //     console.log(obj)
            //     this.getVideoByName(obj)
            // })
            this.setState({
                areaName
            })
            const obj = {
                areaName,
                currentPage: this.state.currentPage
            }
            this.getScenicVideo(obj)
            // const obj = {
            //     areaName: '平乐古镇',
            //     currentPage: this.state.currentPage,
            //     scenicSpotName: '平乐-兴乐桥'
            // }
            // this.setState({
            //     areaName: '平乐古镇',
            //     scenicSpotName: '平乐-兴乐桥'
            // })
            // this.getVideoByName(obj)
        })
    };

    itemClickHandler = name => {
        this.setState({
            areaName: name,
            scenicSpotName: ''
        })
        const obj = {
            areaName: name,
            currentPage: this.state.currentPage
        }
        this.getScenicVideo(obj)
        this.getScenicDetail({ areaName: name })
    };
    itemClickHandler = name => {
        if (name === '雪亮工程' || name === '酒店' || name === '餐饮') {
            this.setState({
                showPoint: 'none',
            })
        }
        this.setState({
            areaName: name,
            scenicSpotName: '',
        })
        const obj = {
            areaName: name,
            currentPage: this.state.currentPage
        }
        this.getScenicVideo(obj)
        this.getScenicDetail({ areaName: name })
    };
    // 获取景区里面所有视频
    getScenicVideo = obj => {
        scenicVideo(obj).then(res => {
            this.setState({
                tableDate: res.video,
                totalNumber: res.uPage.totalNumber,
                paging: res.uPage.paging
            })
            this.autoPlayVideo(res.video)
        })
    };

    getScenicDetail = name => {
        getScenicDetail(name).then(res => {
            this.setState({
                scenicList: res.jdxx
            })
            // this.autoPlayVideo()
        })

    };

    getAllVideo() {
        // console.log(this.state.scenicSpotName)
    };
    getVideoByName(obj) {
        videoByName(obj).then(res => {
            this.setState({
                tableDate: res.video,
                totalNumber: res.uPage.totalNumber,
                paging: res.uPage.paging
            })
            this.autoPlayVideo(res.video)
        })
    };

    showModal = () => {
        this.setState({
            visible: true,
        })
    };

    showTotal(total) {
        return `Total ${total} items`
    };

    handleCancel = e => {
        // console.log(e);
        this.setState({
            visible: false,
        })
        // this.state.videos.map((item) => {
        //     item.dispose()
        // })
    };

    handleChange = val => {
        this.setState({
            scenicSpotName: val,
            currentPage: 1
        })
        const obj = {
            areaName: this.state.areaName,
            currentPage: this.state.currentPage,
            scenicSpotName: val
        }
        this.getVideoByName(obj)
    };

    videoClickHandler = (src, name) => {
        this.showModal()
        const _this = this
        setTimeout(function () {
            var myVideo = videojs('myVideo', {
                bigPlayButton: true,
                textTrackDisplay: false,
                posterImage: false,
                errorDisplay: false
            })
            myVideo.src({
                // src: 'https://cdn.letv-cdn.com/2018/12/05/JOCeEEUuoteFrjCg/playlist.m3u8',
                src,
                type: 'application/x-mpegURL'
            })
            myVideo.play()
            // _this.state.videos.push(myVideo)
            if (src) {
                _this.setState({
                    // videoValue: src,
                    videoName: name
                })
                // if (/\.m3u8$/.test(src)) {
                //     _this.setState({
                //         videoValue: src
                //     })
                //     myVideo.src({
                //         src: 'https://cdn.letv-cdn.com/2018/12/05/JOCeEEUuoteFrjCg/playlist.m3u8',
                //         type: 'application/x-mpegURL'
                //     })
                // } else {
                //     myVideo.src(src)
                // }
                myVideo.src({
                    // src: 'https://cdn.letv-cdn.com/2018/12/05/JOCeEEUuoteFrjCg/playlist.m3u8',
                    src,
                    type: 'application/x-mpegURL'
                })
                myVideo.load()
                myVideo.play()
            }
        }, 10)
    };
    // 分页
    paginationChange = (page) => {
        this.setState({
            current: page,
        })
        if (this.state.scenicSpotName != '') {
            const obj = {
                areaName: this.state.areaName,
                currentPage: page,
                scenicSpotName: this.state.scenicSpotName
            }
            this.getVideoByName(obj)
        } else {
            const obj = {
                areaName: this.state.areaName,
                currentPage: page,
            }
            this.getScenicVideo(obj)
        }

    };
    showPoint = () => {
        this.setState({
            showPoint: this.state.showPoint == 'none' ? 'block' : 'none'
        })
    }

    handleLoadError = () => {
        console.error("加载基础AX控件失败")
    }

    // //初始化
    // Init = () => {
    //     if (document.getElementById('MonitorClient').Init()) {
    //         alert("初始化成功!");
    // 		/* 		ShowDeviceTree 如果需要用到音视频呼叫，则设置参数为2.
    // 				=1:设备树
    // 				=2 用户树。
    // 				=0 不显示 */
    //         //MonitorClient.ShowDeviceTree(2);
    //         document.getElementById('MonitorClient').SetVWL("1", "2");
    //     }
    //     else {
    //         alert("初始化失败!");
    //     }
    // }

    // //登录
    // Login = () => {
    //     var sAddress = "111.4.121.223";
    //     var sUser = "xtwh1";
    //     var sPass = "xtwh1";
    //     document.getElementById('MonitorClient').Login(sAddress, sUser, sPass, "9901");
    // }

    // //打开监控视频
    // OpenVideo = () => {
    //     //sId = "0.0.0.通道ID", 通道ID可通过webservice接口获取。详见HCVSM设备目录查询接口使用说明V6.doc
    //     var sId = prompt("请输入通道参数", "0.0.0.13");
    //     document.getElementById('MonitorClient').OpenChannel2(sId);
    // }

    // //反初始化
    // UnInit = () => {
    //     document.getElementById('MonitorClient').Release();
    // }

    // start = () => {
    //     this.UnInit();
    //     this.Init();
    //     this.Login();
    // }

    // //关闭监控视频
    // CloseVideo = (dId, cId) => {
    //     document.getElementById('MonitorClient').CloseSelectedVideo();
    // }

    // //云台控制
    // SendDVRPTZ = (nPTZCommand, nPTZParam) => {
    //     document.getElementById('MonitorClient').DoPTZCommand(nPTZCommand, nPTZParam);
    // }

    // Chat = (iDvrId) => {
    //     document.getElementById('MonitorClient').DoDVRTalk(iDvrId);
    // }

    // GetVWL = () => {
    //     //获取布局格式，返回值："布局类型,每边数量"，调用setVWL即可设置布局。
    //     var vwl = document.getElementById('MonitorClient').GetVWL();
    //     alert(vwl);
    // }

    // GetWindowUserChannel = () => {
    //     //获取布局窗口数量。
    //     var number = document.getElementById('MonitorClient').GetWindowNubmer();
    //     for (var i = 0; i < number; i++) {
    //         //channelInfo = “通道类型,ID,通道号”，如果通道类型为9，则ID为监控通道ID。取该ID调用OpenChannel(long channelid);即可
    //         var channelInfo = document.getElementById('MonitorClient').GetWindowUserChannel(i);
    //         alert(channelInfo);
    //     }
    // }

    // isDeviceOnline = () => {
    //     var sId = prompt("请输入设备ID", "");
    //     alert(document.getElementById('MonitorClient').IsDeviceOnline(sId));
    // }

    render() {
        // setTimeout(() => {
        //     this.start();
        // }, 0);
        return (
            <Layout>
                <Top />
                <Content className='videoSurveillance'>
                    <div className="container">
                        <div className="videoSurVeilance_title">
                            <span>邛崃市-全部景区视频监控</span>
                        </div>
                        <div className="videoSurVeilance_content">
                            <div className="videoSurVeilance_content_container">
                                <div className="scenicSpotList">
                                    <div className="left">
                                        <span className="item" onClick={this.showPoint.bind(this)}>景区及旅游度假区</span>
                                        <span className="item" onClick={() => { this.itemClickHandler('雪亮工程') }}>雪亮工程</span>
                                        <span className="item" onClick={() => { this.itemClickHandler('酒店') }}>酒店</span>
                                        <span className="item" onClick={() => { this.itemClickHandler('餐饮') }}>餐饮</span>
                                    </div>
                                    <div className="middle" style={{ display: this.state.showPoint }}>
                                        <span><div className="border">景区及旅游度假区</div></span>
                                        <ul>
                                            {
                                                this.state.scenic_spot.length === 0 ? '暂无数据' :
                                                    this.state.scenic_spot.map((val, key) => {
                                                        return (

                                                            <li onClick={() => { this.itemClickHandler(val.areaName) }} key={key}>
                                                                <div className="border">{val.areaName}</div>
                                                            </li>

                                                        )
                                                    }
                                                    )
                                            }
                                        </ul>
                                    </div>
                                    {/* <div className="tabScroll">
                                        <div className='swiper-father'>
                                            <div className="swiper-container">
                                                <div className="swiper-wrapper">
                                                    {
                                                        this.state.scenic_spot.length === 0 ? '暂无数据' :
                                                            this.state.scenic_spot.map((val, i) => {
                                                                return (
                                                                    <div className="swiper-slide">
                                                                        <Select
                                                                            className="item"
                                                                            defaultValue={val.areaName}
                                                                            onChange={this.handleChange}
                                                                            onFocus={() => this.itemClickHandler(val.areaName)}
                                                                            key={i}
                                                                            notFoundContent=''
                                                                        >
                                                                            {
                                                                                this.state.scenicList.map((item) => {
                                                                                    return (
                                                                                        <Option value={item.scenicSpotName} key={item.id}><span>{item.scenicSpotName}</span></Option>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </Select>
                                                                    </div>
                                                                )
                                                            }
                                                            )
                                                    }
                                                </div>
                                            </div> */}
                                    {/* <div class="swiper-button-next"></div>
                                            <div class="swiper-button-prev"></div> */}
                                    {/* </div>
                                    </div> */}
                                    {/* <div className="item"><span>左滑查看更多</span></div> */}
                                </div>
                                <div className="videoSurVeilance">
                                    {
                                        (this.state.tableDate.length === 0) ? null :
                                            this.state.tableDate.map((val, key) => {
                                                return (

                                                    <div className="videoSurVeilance_box" onClick={() => {
                                                        this.videoClickHandler(val.videoValue, val.videoName)
                                                    }}
                                                        // onLoad={() => {
                                                        //     this.onload(val.videoValue)
                                                        // }}
                                                        key={key}>
                                                        <div className="videoSurVeilance_img">
                                                            <video
                                                                controls
                                                                width="100%"
                                                                height="100%"
                                                                id={'video' + val.id}
                                                                className="video-js vjs-default-skin vjs-big-play-centered videos"
                                                                crossOrigin="anonymous"
                                                                preload="auto"
                                                                data-setup='{}'
                                                                muted
                                                            >
                                                                <source
                                                                    src={this.state.videoValue}
                                                                    type="application/x-mpegURL"
                                                                />
                                                            </video>
                                                        </div>
                                                        <div className="videoName"><span>{val.videoName}</span></div>
                                                    </div>
                                                )
                                            })
                                    }
                                    <div className='pagination'>
                                        <Pagination size="small"
                                            total={this.state.totalNumber}
                                            onChange={this.paginationChange}
                                            defaultPageSize={this.state.paging}
                                            current={this.state.current}
                                        />
                                    </div>
                                </div>

                                {/* <object classid="clsid:7450CD7E-1CF7-4E18-ABC2-E9CD63157798" id="MonitorClient" width="553" height="430"></object>
                                <div>
                                    <input type="button" value="打开视频" name="btnOpenVideo" onClick={this.OpenVideo} />
                                    <input type="button" value="关闭视频" name="btnCloseVideo" onClick={this.CloseVideo} />
                                </div> */}

                                <Modal
                                    wrapClassName={'myModal'}
                                    title="Basic Modal"
                                    visible={this.state.visible}
                                    onOk={this.handleOk}
                                    onCancel={this.handleCancel}
                                    width='66.66vw'
                                >
                                    <div className="modal_title">
                                        <span>{this.state.videoName}</span>
                                        <span></span>
                                    </div>
                                    <div className="modal_content">
                                        <video
                                            controls
                                            width="100%"
                                            height="100%"
                                            id="myVideo"
                                            className="video-js vjs-default-skin vjs-big-play-centered"
                                            crossOrigin="anonymous"
                                            preload="auto"
                                            data-setup='{}'
                                            muted
                                        >
                                            <source
                                                src={this.state.videoValue}
                                                type="application/x-mpegURL" />
                                        </video>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </Content>
            </Layout >
        )
    }
}
