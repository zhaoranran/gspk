const baseUrl = 'https://free.liaoningdoupo.com';

module.exports = {
  fileUrl: 'https://free.liaoningdoupo.com',
  service: {
    appId: 'wx93f5346ce47f3cd6',
    getOpenId: `${baseUrl}/hqbi/user/getopenid`, // 根据code查询openid
    loginUrl: `${baseUrl}/hqbi/user/openid`, // 根据微信ID查询用户信息
    deptList: `${baseUrl}/hqbi/dept/all`, // 查询部门信息、get方法
    saveUser: `${baseUrl}/hqbi/user`, // 添加用户信息、post提交
    userSign: `${baseUrl}/hqbi/user/usersign`, // 用户签到、post方法
    userAll: `${baseUrl}/hqbi/user/all`, // 查询用户排行榜、get方法
    userScore: `${baseUrl}/hqbi/user/score`, // 更新用户积分、post方法
    findQue: `${baseUrl}/hqbi/que/find`, // 随机抽取一定条数题、get方法
    queUser: `${baseUrl}/hqbi/queuser`, // 用户答题记录、post方法
    wsUrl: `wss://dati.beyond-itservice.com:8080/answer-api/websocket`,
    roomSave: `${baseUrl}/hqbi/room`, // 添加房间、post方法
    userOnline: `${baseUrl}/hqbi/user/online`, // 查询在线用户
    dailyCount: `${baseUrl}/hqbi/user/daily`, // 获取答题次数
    dailyUse: `${baseUrl}/hqbi/user/daily/use`, // 使用答题次数
    
  },
};