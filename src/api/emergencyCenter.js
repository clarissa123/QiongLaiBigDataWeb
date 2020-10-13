//应急中心 所有接口
import {
    get,
    post
} from './index';

//区域监控视频信息
export const getProjectQueryAll = p => get('/VMS/videoQueryAllByName', p);

//获取地区负责人联络方式
export const getPrincipalQueryAll = p => get('/EC/principalQueryAll', p);

//发送短信
export const getSendCode = p => get('/EC/SendCode', p);

//请求报警人信息
export const getCallPoliceInfo = p => get('/EC/callThePoliceHint', p);

//更改报警状态
export const getCallThePoliceHint = p => get('/EC/callThePoliceUpdate', p);

//获取地质预警信息
export const getEarlyWarningQueryAllTo = p => get('/EC/earlyWarningQueryAllTo',p);

//获取申诉记录信息
export const getAppealRecordQueryAll = p => get('/EC/AppealRecordQueryAll',p);

//新增申诉记录信息
export const getAppealRecordAdd = p => post('/EC/AppealRecordAdd', p);

//修改申诉记录信息
export const getAppealRecordUpdate = p => get('/EC/AppealRecordUpdate', p);
