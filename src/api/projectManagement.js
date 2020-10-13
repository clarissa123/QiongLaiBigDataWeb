//项目总览 所有接口
import {get, post} from './index';

//修改年度预计投资额
export const predictMesUpdate = p => post('/PM/predictMesUpdate', p);

