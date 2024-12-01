import MobileDetect from 'mobile-detect'

// 检测设备类型
const md = new MobileDetect(window.navigator.userAgent)
const isMobile = !!md.mobile()

export default isMobile
