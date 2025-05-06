// 主应用模块
import { defaultConfig, defaultStyles, generateConfigCode, generateJsonCode, mergeConfig } from './config.js';
import { generateStylesCSS, generateLoaderCSS, createOverlayHTML, generateStandaloneJS } from './style-generator.js';
import { initEventListeners, initFormValues, updatePreviewOverlay as updatePreview, testAnimation, showToast } from './ui-handler.js';

// 当前配置
let currentConfig = { ...defaultConfig };
let currentStyles = { ...defaultStyles };

// 当页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 清除任何已保存的配置，防止加载旧配置
  localStorage.removeItem('smoothTransitionConfig');
  
  // 初始化表单值
  initFormValues(currentConfig, currentStyles);
  
  // 更新初始显示
  updateConfigCode();
  updateStylesCode();
  updateJsonCode();
  updatePreviewOverlay();
  
  // 初始化UI事件监听
  initEventListeners(currentConfig, currentStyles, {
    updateConfig,
    updateStyles,
    updateConfigCode,
    updateStylesCode,
    updateJsonCode,
    updatePreviewOverlay,
    testAnimation: () => testAnimation(currentConfig),
    showToast,
    generateStylesCSS: () => generateStylesCSS(currentConfig, currentStyles),
    generateStandaloneJS: (template, config) => generateStandaloneJS(template, config)
  });
});

// 更新配置
function updateConfig() {
  currentConfig.transition.duration = parseInt(document.getElementById('duration').value);
  currentConfig.transition.minDisplayTime = parseInt(document.getElementById('minDisplayTime').value);
  currentConfig.transition.easing = document.getElementById('easing').value;
  currentConfig.cache = document.getElementById('cache').value === 'true';
  currentConfig.prefetch = document.getElementById('prefetch').value === 'true';
  currentConfig.timeout = parseInt(document.getElementById('timeout').value);
  
  updateConfigCode();
  updateJsonCode();
  updatePreviewOverlay();
}

// 更新样式
function updateStyles() {
  currentStyles.overlay.background = document.getElementById('overlayBackgroundText').value;
  currentStyles.overlay.zIndex = parseInt(document.getElementById('overlayZIndex').value);
  
  const activeLoaderOption = document.querySelector('.loader-option.active');
  if (activeLoaderOption) {
    const newLoaderType = activeLoaderOption.dataset.type;
    const previousType = currentStyles.loader.type;
    
    // 更新加载器类型
    currentStyles.loader.type = newLoaderType;
    
    // 如果从自定义加载器切换到其他类型，确保清除自定义样式但保留设置
    if (previousType === 'custom' && newLoaderType !== 'custom') {
      // 清除任何自定义样式表，但保留自定义定义以备后用
      const customStyleId = 'custom-loader-overlay-style';
      const existingCustomStyle = document.getElementById(customStyleId);
      if (existingCustomStyle) {
        existingCustomStyle.textContent = '';
      }
    }
  }
  
  currentStyles.loader.color = document.getElementById('loaderColorText').value;
  currentStyles.loader.size = parseInt(document.getElementById('loaderSize').value);
  currentStyles.links.activeColor = document.getElementById('activeLinkColorText').value;
  currentStyles.links.activeBold = document.getElementById('activeLinkBold').value === 'true';
  
  // 获取自定义加载指示器内容
  if (currentStyles.loader.type === 'custom') {
    if (!currentStyles.loader.custom) {
      currentStyles.loader.custom = { html: '', css: '' };
    }
    
    const customHtmlEl = document.getElementById('customLoaderHTML');
    const customCssEl = document.getElementById('customLoaderCSS');
    
    if (customHtmlEl) {
      currentStyles.loader.custom.html = customHtmlEl.value;
    }
    
    if (customCssEl) {
      currentStyles.loader.custom.css = customCssEl.value;
    }
  }
  
  // 更新颜色预览 - 设置背景色和data属性
  const overlayBgPreview = document.getElementById('overlayBackgroundPreview');
  overlayBgPreview.style.backgroundColor = currentStyles.overlay.background;
  overlayBgPreview.dataset.bgColor = currentStyles.overlay.background;
  
  const loaderColorPreview = document.getElementById('loaderColorPreview');
  loaderColorPreview.style.backgroundColor = currentStyles.loader.color;
  loaderColorPreview.dataset.bgColor = currentStyles.loader.color;
  
  const activeLinkColorPreview = document.getElementById('activeLinkColorPreview');
  activeLinkColorPreview.style.backgroundColor = currentStyles.links.activeColor;
  activeLinkColorPreview.dataset.bgColor = currentStyles.links.activeColor;
  
  updateStylesCode();
  updateJsonCode();
  updatePreviewOverlay();
}

// 更新配置代码显示
function updateConfigCode() {
  const configCode = generateConfigCode(currentConfig);
  document.getElementById('configCode').textContent = configCode;
}

// 更新样式代码显示
function updateStylesCode() {
  const stylesCode = generateStylesCSS(currentConfig, currentStyles);
  document.getElementById('stylesCode').textContent = stylesCode;
}

// 更新JSON代码显示
function updateJsonCode() {
  const jsonCode = generateJsonCode(currentConfig, currentStyles);
  document.getElementById('jsonCode').textContent = jsonCode;
}

// 更新预览遮罩层
function updatePreviewOverlay() {
  updatePreview(currentConfig, currentStyles);
} 