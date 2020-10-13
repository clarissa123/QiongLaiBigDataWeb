//应急中心 所有接口
import {get} from './index';

//邛崃景区区域信息
export const getAreaQueryAll = p => get('/VMS/areaQueryAll', p);

export const getScenicDetail = p => get('/VMS/scenicSpotQueryByName', p)

export const allVideo = p => get('/VMS/videoQueryAllByName', p)

export const videoByName = p => get('/VMS/videoQueryByName', p)

export const scenicVideo = p => get('/VMS/videoQueryAllByAreaName', p)