//项目分布 所有接口
import {get} from './index';

//各地区区域分布(项目数)
export const ClassAllQueryProject = p => get('/PM/countQueryAllProject', p);

//各地区区域分布(投资额)
export const ClassAllQueryProjectOr = p => get('/PM/countQueryAllProjectOr', p);

//项目行业分布
export const TownIndustryQueryAll = p => get('/PM/classAllQueryProject', p);
