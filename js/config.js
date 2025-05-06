// 默认配置
const defaultConfig = {
  selectors: {
    links: ".nav-link",
    content: "#content",
    overlay: "#overlay"
  },
  transition: {
    type: "fade",
    duration: 500,
    easing: "ease",
    minDisplayTime: 800,
    entranceDirection: "bottom",
    exitDirection: "bottom"
  },
  cache: true,
  prefetch: false,
  timeout: 8000,
  debug: true
};

// 默认样式配置
const defaultStyles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.8)",
    zIndex: 1000
  },
  loader: {
    type: "dots",
    color: "#4a6cf7",
    size: 15,
    spinner: {
      thickness: 3,
      speed: 1.2,
      style: "half"
    },
    custom: {
      html: "",
      css: ""
    }
  },
  links: {
    activeColor: "#4a6cf7",
    activeBold: true
  }
};

// 更新配置代码显示
function generateConfigCode(config) {
  return `// SmoothTransition 配置
const transition = new SmoothTransition({
  selectors: {
    links: "${config.selectors.links}",
    content: "${config.selectors.content}",
    overlay: "${config.selectors.overlay}"
  },
  transition: {
    type: "${config.transition.type}",
    duration: ${config.transition.duration},
    easing: "${config.transition.easing}",
    minDisplayTime: ${config.transition.minDisplayTime},
    entranceDirection: "${config.transition.entranceDirection}",
    exitDirection: "${config.transition.exitDirection}"
  },
  cache: ${config.cache},
  prefetch: ${config.prefetch},
  timeout: ${config.timeout},
  debug: ${config.debug}
});

// 初始化无刷跳转
transition.init();`;
}

// 更新JSON代码显示
function generateJsonCode(config, styles) {
  const jsonData = {
    config: config,
    styles: styles
  };
  
  return JSON.stringify(jsonData, null, 2);
}

// 合并配置
function mergeConfig(target, source) {
  const result = { ...target };

  for (const key in source) {
    if (typeof source[key] === "object" && source[key] !== null && !Array.isArray(source[key])) {
      result[key] = mergeConfig(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}

export {
  defaultConfig,
  defaultStyles,
  generateConfigCode,
  generateJsonCode,
  mergeConfig
}; 