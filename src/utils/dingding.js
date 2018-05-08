// 封装钉钉二维码方法
export function DDLogin({ style = '', width, height, href = '', appid, redirect_uri }, hanndleMessage) {
  const goto = encodeURIComponent(`https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appid}&response_type=code&scope=snsapi_login&redirect_uri=${redirect_uri}`)
  style = encodeURIComponent(style)
  const url = `https://login.dingtalk.com/login/qrcode.htm?goto=${goto}&style=${style}&href=${href}`
  if (typeof window.addEventListener !== 'undefined') {
    window.addEventListener('message', hanndleMessage, false)
  } else if (typeof window.attachEvent !== 'undefined') {
    window.attachEvent('onmessage', hanndleMessage)
  }
  return url
}
