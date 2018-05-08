export default function Rem() {
  const docEl = document.documentElement
  let oSize = docEl.clientWidth / 7.5
  if (oSize > 150) {
    // oSize = 100; // 限制rem值 750 / 7.5 =100
    oSize = 150
  }
  docEl.style.fontSize = oSize + 'px'
}
