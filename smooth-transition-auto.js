
/**
 * SmoothTransition Standalone - 独立版无刷新页面跳转
 * 版本: 1.0.0
 * 作者: v0
 * 
 * 此文件包含嵌入式配置，无需外部配置文件
 */

// 嵌入式配置
const embeddedConfig = {
  "config": {
    "selectors": {
      "links": ".nav-link",
      "content": "#content",
      "overlay": "#overlay"
    },
    "transition": {
      "type": "fade",
      "duration": 500,
      "easing": "ease",
      "minDisplayTime": 800,
      "entranceDirection": "bottom",
      "exitDirection": "bottom"
    },
    "cache": true,
    "prefetch": false,
    "timeout": 8000,
    "debug": true
  },
  "styles": {
    "overlay": {
      "background": "rgba(0, 0, 0, 0.8)",
      "zIndex": 1000
    },
    "loader": {
      "type": "custom",
      "color": "#4a6cf7",
      "size": 15,
      "spinner": {
        "thickness": 3,
        "speed": 1.2,
        "style": "half"
      },
      "custom": {
        "html": "<div class=\"sk-circle\">\n\t<div class=\"sk-circle1 sk-child\"></div>\n\t<div class=\"sk-circle2 sk-child\"></div>\n\t<div class=\"sk-circle3 sk-child\"></div>\n\t<div class=\"sk-circle4 sk-child\"></div>\n\t<div class=\"sk-circle5 sk-child\"></div>\n\t<div class=\"sk-circle6 sk-child\"></div>\n\t<div class=\"sk-circle7 sk-child\"></div>\n\t<div class=\"sk-circle8 sk-child\"></div>\n\t<div class=\"sk-circle9 sk-child\"></div>\n\t<div class=\"sk-circle10 sk-child\"></div>\n\t<div class=\"sk-circle11 sk-child\"></div>\n\t<div class=\"sk-circle12 sk-child\"></div>\n</div>",
        "css": ".sk-circle {\n\tdisplay: inline-block;\n\twidth: 40px;\n\theight: 40px;\n\tposition: relative;\n}\n.sk-circle .sk-child {\n\twidth: 100%;\n\theight: 100%;\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n}\n.sk-circle .sk-child:before {\n\tcontent: '';\n\tdisplay: block;\n\tmargin: 0 auto;\n\twidth: 15%;\n\theight: 15%;\n\tbackground-color: #61E8EA;\n\tborder-radius: 100%;\n\t-webkit-animation: sk-circleBounceDelay 1.2s infinite ease-in-out both;\n\tanimation: sk-circleBounceDelay 1.2s infinite ease-in-out both;\n}\n.sk-circle .sk-circle2 {\n\t-webkit-transform: rotate(30deg);\n\t-ms-transform: rotate(30deg);\n\ttransform: rotate(30deg);\n}\n.sk-circle .sk-circle3 {\n\t-webkit-transform: rotate(60deg);\n\t-ms-transform: rotate(60deg);\n\ttransform: rotate(60deg);\n}\n.sk-circle .sk-circle4 {\n\t-webkit-transform: rotate(90deg);\n\t-ms-transform: rotate(90deg);\n\ttransform: rotate(90deg);\n}\n.sk-circle .sk-circle5 {\n\t-webkit-transform: rotate(120deg);\n\t-ms-transform: rotate(120deg);\n\ttransform: rotate(120deg);\n}\n.sk-circle .sk-circle6 {\n\t-webkit-transform: rotate(150deg);\n\t-ms-transform: rotate(150deg);\n\ttransform: rotate(150deg);\n}\n.sk-circle .sk-circle7 {\n\t-webkit-transform: rotate(180deg);\n\t-ms-transform: rotate(180deg);\n\ttransform: rotate(180deg);\n}\n.sk-circle .sk-circle8 {\n\t-webkit-transform: rotate(210deg);\n\t-ms-transform: rotate(210deg);\n\ttransform: rotate(210deg);\n}\n.sk-circle .sk-circle9 {\n\t-webkit-transform: rotate(240deg);\n\t-ms-transform: rotate(240deg);\n\ttransform: rotate(240deg);\n}\n.sk-circle .sk-circle10 {\n\t-webkit-transform: rotate(270deg);\n\t-ms-transform: rotate(270deg);\n\ttransform: rotate(270deg);\n}\n.sk-circle .sk-circle11 {\n\t-webkit-transform: rotate(300deg);\n\t-ms-transform: rotate(300deg);\n\ttransform: rotate(300deg);\n}\n.sk-circle .sk-circle12 {\n\t-webkit-transform: rotate(330deg);\n\t-ms-transform: rotate(330deg);\n\ttransform: rotate(330deg);\n}\n.sk-circle .sk-circle2:before {\n\t-webkit-animation-delay: -1.1s;\n\tanimation-delay: -1.1s;\n}\n.sk-circle .sk-circle3:before {\n\t-webkit-animation-delay: -1s;\n\tanimation-delay: -1s;\n}\n.sk-circle .sk-circle4:before {\n\t-webkit-animation-delay: -0.9s;\n\tanimation-delay: -0.9s;\n}\n.sk-circle .sk-circle5:before {\n\t-webkit-animation-delay: -0.8s;\n\tanimation-delay: -0.8s;\n}\n.sk-circle .sk-circle6:before {\n\t-webkit-animation-delay: -0.7s;\n\tanimation-delay: -0.7s;\n}\n.sk-circle .sk-circle7:before {\n\t-webkit-animation-delay: -0.6s;\n\tanimation-delay: -0.6s;\n}\n.sk-circle .sk-circle8:before {\n\t-webkit-animation-delay: -0.5s;\n\tanimation-delay: -0.5s;\n}\n.sk-circle .sk-circle9:before {\n\t-webkit-animation-delay: -0.4s;\n\tanimation-delay: -0.4s;\n}\n.sk-circle .sk-circle10:before {\n\t-webkit-animation-delay: -0.3s;\n\tanimation-delay: -0.3s;\n}\n.sk-circle .sk-circle11:before {\n\t-webkit-animation-delay: -0.2s;\n\tanimation-delay: -0.2s;\n}\n.sk-circle .sk-circle12:before {\n\t-webkit-animation-delay: -0.1s;\n\tanimation-delay: -0.1s;\n}\n@-webkit-keyframes sk-circleBounceDelay {\n\t0%,80%,100% {\n\t\t-webkit-transform: scale(0);\n\t\ttransform: scale(0);\n\t}\n\t40% {\n\t\t-webkit-transform: scale(1);\n\t\ttransform: scale(1);\n\t}\n}\n@keyframes sk-circleBounceDelay {\n\t0%,80%,100% {\n\t\t-webkit-transform: scale(0);\n\t\ttransform: scale(0);\n\t}\n\t40% {\n\t\t-webkit-transform: scale(1);\n\t\ttransform: scale(1);\n\t}\n}"
      }
    },
    "links": {
      "activeColor": "#4a6cf7",
      "activeBold": true
    }
  }
};

// 默认配置 - 将被嵌入式配置覆盖
const defaultConfig = {
  selectors: {
    links: ".nav-link",
    content: "#content",
    overlay: "#overlay",
  },
  transition: {
    type: "fade",
    duration: 500,
    easing: "ease",
    minDisplayTime: 800,
    entranceDirection: "bottom",
    exitDirection: "bottom",
  },
  cache: true,
  prefetch: false,
  timeout: 8000,
  debug: true,
}

// 默认样式配置 - 将被嵌入式配置覆盖
const defaultStyles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.8)",
    zIndex: 1000,
  },
  loader: {
    type: "dots",
    color: "#4a6cf7",
    size: 15,
  },
  links: {
    activeColor: "#4a6cf7",
    activeBold: true,
  },
}

// 调试日志函数
function log(message, data = null, force = true) {
  const timestamp = new Date().toISOString().split("T")[1].split(".")[0]
  if (defaultConfig.debug || force) {
    if (data) {
      console.log(`[SmoothTransition ${timestamp}] ${message}`, data)
    } else {
      console.log(`[SmoothTransition ${timestamp}] ${message}`)
    }
  }
}

// 错误日志函数
function logError(message, error = null) {
  const timestamp = new Date().toISOString().split("T")[1].split(".")[0]
  if (error) {
    console.error(`[SmoothTransition ERROR ${timestamp}] ${message}`, error)
  } else {
    console.error(`[SmoothTransition ERROR ${timestamp}] ${message}`)
  }
}

// 生成CSS样式
function generateStylesCSS(config, styles) {
  log("生成CSS样式", { config, styles })

  const css = `/* SmoothTransition 自定义过渡动画样式 */
/* 过渡动画遮罩层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${styles.overlay.background};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${styles.overlay.zIndex};
  pointer-events: all;

  /* 使用CSS变量来控制过渡持续时间和缓动函数 */
  --entrance-duration: ${config.transition.duration}ms;
  --exit-duration: ${config.transition.duration}ms;
  --transition-easing: ${config.transition.easing};

  /* 默认从底部进入 */
  transform: translateY(100%);

  /* 入场动画 */
  transition: transform var(--entrance-duration) var(--transition-easing);
}

/* 不同方向的初始位置 */
.overlay[data-direction="top"] {
  transform: translateY(-100%);
}

.overlay[data-direction="bottom"] {
  transform: translateY(100%);
}

.overlay[data-direction="left"] {
  transform: translateX(-100%);
}

.overlay[data-direction="right"] {
  transform: translateX(100%);
}

/* 显示状态 */
.overlay[data-animation-state="visible"] {
  transform: translate(0, 0);
}

/* 隐藏状态 - 使用不同的动画曲线 */
.overlay[data-animation-state="hidden"] {
  transition: transform var(--exit-duration) cubic-bezier(0.4, 0, 1, 1);
  pointer-events: none; /* 退场时立即禁用指针事件 */
}

/* 完全隐藏状态 - 在动画完成后应用 */
.overlay[data-animation-state="none"] {
  display: none;
}

/* 加载指示器样式 */
${generateLoaderCSS(styles)}

/* 活动链接样式 */
.nav-link.active {
  ${styles.links.activeBold ? "font-weight: bold;" : ""}
  color: ${styles.links.activeColor};
}`

  log("生成的完整CSS:", css)
  return css
}

// 生成加载指示器CSS
function generateLoaderCSS(styles) {
  log("生成加载指示器CSS", styles.loader)
  if (styles.loader.type === "none") {
    return "/* 无加载指示器 */"
  }

  if (styles.loader.type === "dots") {
    return `.loader-dots {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader-dots > div {
  width: ${styles.loader.size}px;
  height: ${styles.loader.size}px;
  margin: 0 ${styles.loader.size / 2}px;
  background-color: ${styles.loader.color};
  border-radius: 50%;
  display: inline-block;
  animation: dots 1.4s infinite ease-in-out both;
}

.loader-dots > div:nth-child(1) {
  animation-delay: -0.32s;
}

.loader-dots > div:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes dots {
  0%, 80%, 100% { 
    transform: scale(0);
  } 
  40% { 
    transform: scale(1.0);
  }
}`
  }

  if (styles.loader.type === "spinner") {
    return `.loader-spinner {
  display: inline-block;
  width: ${styles.loader.size * 2}px;
  height: ${styles.loader.size * 2}px;
}

.loader-spinner:after {
  content: " ";
  display: block;
  width: ${styles.loader.size * 1.5}px;
  height: ${styles.loader.size * 1.5}px;
  border-radius: 50%;
  border: ${styles.loader.size / 5}px solid ${styles.loader.color};
  border-color: ${styles.loader.color} transparent ${styles.loader.color} transparent;
  animation: spinner 1.2s linear infinite;
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}`
  }

  if (styles.loader.type === "pulse") {
    return `.loader-pulse {
  width: ${styles.loader.size * 2}px;
  height: ${styles.loader.size * 2}px;
  border-radius: 50%;
  background-color: ${styles.loader.color};
  animation: pulse 1.2s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

@keyframes pulse {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}`
  }
  
  if (styles.loader.type === "custom" && styles.loader.custom?.css) {
    return styles.loader.custom.css;
  }

  return ""
}

// 合并配置
function mergeConfig(target, source) {
  log("合并配置", { target, source })
  const result = { ...target }

  for (const key in source) {
    if (typeof source[key] === "object" && source[key] !== null && !Array.isArray(source[key])) {
      result[key] = mergeConfig(result[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }

  log("合并配置结果", result)
  return result
}

// 创建遮罩层HTML
function createOverlayHTML(styles) {
  log("创建遮罩层HTML", styles)
  let loaderHTML = ""

  if (styles.loader.type === "dots") {
    loaderHTML = `
      <div class="loader-dots">
        <div></div>
        <div></div>
        <div></div>
      </div>
    `
  } else if (styles.loader.type === "spinner") {
    loaderHTML = `<div class="loader-spinner"></div>`
  } else if (styles.loader.type === "pulse") {
    loaderHTML = `<div class="loader-pulse"></div>`
  } else if (styles.loader.type === "custom" && styles.loader.custom?.html) {
    loaderHTML = styles.loader.custom.html;
  }

  const overlayHTML = `<div id="overlay" class="overlay" data-animation-state="none" data-direction="bottom">
    ${loaderHTML}
  </div>`

  log("生成的遮罩层HTML", overlayHTML)
  return overlayHTML
}

// 自动初始化
document.addEventListener("DOMContentLoaded", () => {
  log("DOM内容加载完成，开始初始化SmoothTransition")

  // 检查是否已经存在样式
  const styleExists = document.getElementById("smooth-transition-styles") !== null
  log("样式元素是否存在:", styleExists)

  // 使用嵌入式配置
  let userConfig = embeddedConfig.config || defaultConfig
  let userStyles = embeddedConfig.styles || defaultStyles

  log("使用嵌入式配置:", { userConfig, userStyles })
  
  // 初始化过渡效果
  initializeTransition(userConfig, userStyles, styleExists)
})

// 初始化过渡效果
function initializeTransition(config, styles, styleExists) {
  log("开始初始化过渡效果", { config, styles, styleExists })

  // 如果不存在CSS，则添加
  if (!styleExists) {
    log("样式元素不存在，准备添加过渡动画样式")
    try {
      const styleEl = document.createElement("style")
      styleEl.id = "smooth-transition-styles"
      const cssContent = generateStylesCSS(config, styles)
      styleEl.textContent = cssContent
      log("生成的CSS样式长度:", cssContent.length)
      document.head.appendChild(styleEl)
      log("样式元素已添加到文档头部")

      // 验证样式是否成功添加
      const addedStyle = document.getElementById("smooth-transition-styles")
      if (addedStyle) {
        log("样式元素添加成功，内容长度:", addedStyle.textContent.length)
      } else {
        logError("样式元素添加失败，未找到添加后的元素")
      }
    } catch (e) {
      logError("添加样式时出错", e)
    }
  } else {
    log("样式元素已存在，跳过添加")
    const existingStyle = document.getElementById("smooth-transition-styles")
    log("现有样式元素内容长度:", existingStyle ? existingStyle.textContent.length : "未找到")
  }

  // 检查是否已经存在遮罩层
  const overlaySelector = config.selectors.overlay
  log("遮罩层选择器:", overlaySelector)
  const overlayEl = document.querySelector(overlaySelector)
  log("找到的遮罩层元素:", overlayEl)
  const overlayExists = overlayEl !== null
  log("遮罩层是否存在:", overlayExists)

  // 如果不存在遮罩层，则添加
  if (!overlayExists) {
    log("遮罩层不存在，准备添加")
    try {
      const overlayHTML = createOverlayHTML(styles)
      document.body.insertAdjacentHTML("beforeend", overlayHTML)
      log("遮罩层HTML已添加到文档末尾")

      // 检查添加后是否存在
      const addedOverlay = document.querySelector(overlaySelector)
      if (addedOverlay) {
        log("遮罩层添加成功:", addedOverlay)
        log("遮罩层属性:", {
          animationState: addedOverlay.getAttribute("data-animation-state"),
          direction: addedOverlay.getAttribute("data-direction"),
          className: addedOverlay.className,
        })
      } else {
        logError("遮罩层添加后仍然找不到，请检查选择器:", overlaySelector)
      }
    } catch (e) {
      logError("添加遮罩层时出错", e)
    }
  } else {
    log("遮罩层已存在，检查其属性")
    log("遮罩层当前状态:", {
      animationState: overlayEl.getAttribute("data-animation-state"),
      direction: overlayEl.getAttribute("data-direction"),
      className: overlayEl.className,
      style: overlayEl.style.cssText,
    })

    // 检查计算样式
    try {
      const computedStyle = window.getComputedStyle(overlayEl)
      log("遮罩层计算样式:", {
        display: computedStyle.display,
        position: computedStyle.position,
        transform: computedStyle.transform,
        transition: computedStyle.transition,
        background: computedStyle.background,
        zIndex: computedStyle.zIndex,
      })
    } catch (e) {
      logError("获取计算样式失败", e)
    }
  }

  // 导入SmoothTransition类并初始化
  log("开始导入SmoothTransition模块")
  import("./smooth-transition.js")
    .then((module) => {
      log("SmoothTransition模块导入成功")
      const SmoothTransition = module.default

      // 创建无刷跳转实例
      log("创建SmoothTransition实例，配置:", config)
      const transition = new SmoothTransition(config)

      // 初始化无刷跳转
      log("初始化SmoothTransition实例")
      transition.init()

      // 添加全局引用以便调试
      window.smoothTransition = transition
      log("SmoothTransition实例已添加到全局window对象")

      log("SmoothTransition自动初始化完成")
    })
    .catch((error) => {
      logError("初始化失败", error)
    })
}

// 导出默认配置和样式，以便其他模块使用
export const defaultTransitionConfig = defaultConfig
export const defaultTransitionStyles = defaultStyles
export const generateTransitionCSS = generateStylesCSS
