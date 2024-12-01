import request from '@/utils/request'

// 注册
export const userRegisterService = ({ username, password, captcha }) =>
  request.post('/user/register', { user_name: username, user_pwd: password, captcha: captcha }, { withCredentials: true })

// 登陆
export const userLoginService = ({ username, password }) => request.post('/user/login', { user_name: username, user_pwd: password })

// 获取验证码
export const getCaptcha = () => request.get('/captcha', { withCredentials: true })

// 重置密码
export const editPwd = ({ id, username, oldPwd, newPwd }) =>
  request.post('/user/editpwd', { id, username, oldPwd, newPwd }, { withCredentials: true })

// 修改个人信息
// field ===> 传入后台判断更新的字段
// data ===> 要更新的数据
export const editUserInfo = (uploadField, currentField) => request.post('/user/edituser', { field: uploadField, data: currentField })
