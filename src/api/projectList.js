//项目总览 所有接口
import {get, post} from './index';

//项目总览
export const getProjectMesQueryAll = p => get('/PM/projectMesQueryAll', p);

//根据id查询数据
// export const TownIndustryQueryAll = p => get('/PM/TownIndustryQueryAll', p);

//根据id删除项目
export const projectMesDelete = p => post('/PM/projectMesDelete', p);
