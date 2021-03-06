/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-26 10:14:30
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-02-15 21:52:10
 */
'use strict';
const response = require('../extend/response');
const JSessionIdUtil = require('../extend/session')

module.exports = () => {

  return async function checkMyDoctorSession(ctx, next) {
    const JSessionIdInfo = await JSessionIdUtil.getDBJSessionInfoByCookiesJSession(ctx)
    const isValidJSession = JSessionIdInfo && JSessionIdInfo.jSessionId
    if (!isValidJSession) {
      response.sendFail(ctx, '没有权限访问或权限已过期',410001)
      return
    } else {
      ctx.state.myDoctorSessionId = isValidJSession
      await next()
    }
  };
};