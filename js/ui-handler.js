// UI交互处理模块

// UI事件初始化
function initEventListeners(currentConfig, currentStyles, callbacks) {
  // 配置表单变化监听
  document.getElementById('duration').addEventListener('change', () => callbacks.updateConfig());
  document.getElementById('minDisplayTime').addEventListener('change', () => callbacks.updateConfig());
  document.getElementById('easing').addEventListener('change', () => callbacks.updateConfig());
  document.getElementById('cache').addEventListener('change', () => callbacks.updateConfig());
  document.getElementById('prefetch').addEventListener('change', () => callbacks.updateConfig());
  document.getElementById('timeout').addEventListener('change', () => callbacks.updateConfig());
  
  // 样式表单变化监听
  document.getElementById('overlayBackgroundText').addEventListener('input', () => callbacks.updateStyles());
  document.getElementById('overlayBackground').addEventListener('input', function() {
    document.getElementById('overlayBackgroundText').value = this.value;
    callbacks.updateStyles();
  });
  document.getElementById('overlayZIndex').addEventListener('change', () => callbacks.updateStyles());
  document.getElementById('loaderColorText').addEventListener('input', () => callbacks.updateStyles());
  document.getElementById('loaderColor').addEventListener('input', function() {
    document.getElementById('loaderColorText').value = this.value;
    callbacks.updateStyles();
  });
  document.getElementById('loaderSize').addEventListener('change', () => callbacks.updateStyles());
  document.getElementById('activeLinkColorText').addEventListener('input', () => callbacks.updateStyles());
  document.getElementById('activeLinkColor').addEventListener('input', function() {
    document.getElementById('activeLinkColorText').value = this.value;
    callbacks.updateStyles();
  });
  document.getElementById('activeLinkBold').addEventListener('change', () => callbacks.updateStyles());
  
  // 自定义加载指示器字段监听
  if (document.getElementById('customLoaderHTML')) {
    document.getElementById('customLoaderHTML').addEventListener('input', () => {
      currentStyles.loader.custom.html = document.getElementById('customLoaderHTML').value;
      callbacks.updateStyles();
    });
  }
  
  if (document.getElementById('customLoaderCSS')) {
    document.getElementById('customLoaderCSS').addEventListener('input', () => {
      currentStyles.loader.custom.css = document.getElementById('customLoaderCSS').value;
      callbacks.updateStyles();
    });
  }
  
  // 方向选择
  document.querySelectorAll('.direction-cell:not(.disabled)').forEach(cell => {
    cell.addEventListener('click', function() {
      const type = this.dataset.type;
      const direction = this.dataset.direction;
      
      // 移除同类型的所有活动状态
      document.querySelectorAll(`.direction-cell[data-type="${type}"]`).forEach(el => {
        el.classList.remove('active');
      });
      
      // 添加当前选中的活动状态
      this.classList.add('active');
      
      // 更新配置
      if (type === 'entrance') {
        currentConfig.transition.entranceDirection = direction;
      } else {
        currentConfig.transition.exitDirection = direction;
      }
      
      callbacks.updateConfigCode();
      callbacks.updateJsonCode();
      callbacks.updatePreviewOverlay();
    });
  });

  // 加载指示器类型选择
  const loaderOptions = document.querySelectorAll('.loader-option');
  loaderOptions.forEach(option => {
    option.addEventListener('click', function() {
      const type = this.dataset.type;
      
      // 移除所有活动状态
      loaderOptions.forEach(el => {
        el.classList.remove('active');
      });
      
      // 添加当前选中的活动状态
      this.classList.add('active');
      
      // 更新配置
      const previousType = currentStyles.loader.type;
      currentStyles.loader.type = type;
      
      // 如果从custom类型切换到其他类型，确保样式正确更新
      if (previousType === 'custom' && type !== 'custom') {
        // 清除任何可能存在的自定义样式表
        const customStyleId = 'custom-loader-overlay-style';
        const existingCustomStyle = document.getElementById(customStyleId);
        if (existingCustomStyle) {
          existingCustomStyle.textContent = '';
        }
      }
      
      // 显示/隐藏自定义加载器面板
      if (type === 'custom') {
        document.getElementById('customLoaderPanel')?.classList.add('active');
      } else {
        document.getElementById('customLoaderPanel')?.classList.remove('active');
      }
      
      callbacks.updateStylesCode();
      callbacks.updateJsonCode();
      callbacks.updatePreviewOverlay();
    });
  });
  
  // 标签页切换
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.dataset.tab;
      const tabGroup = this.parentElement;
      
      // 移除所有标签页的活动状态
      tabGroup.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
      });
      
      // 隐藏所有内容
      const tabContents = document.querySelectorAll(`.tab-content[data-tab]`);
      tabContents.forEach(content => {
        content.classList.remove('active');
      });
      
      // 激活当前标签页
      this.classList.add('active');
      
      // 显示对应内容
      const activeContent = document.querySelector(`.tab-content[data-tab="${tabName}"]`);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });
  
  // 测试动画按钮
  document.getElementById('testAnimation').addEventListener('click', () => callbacks.testAnimation());
  document.getElementById('testAnimation2').addEventListener('click', () => callbacks.testAnimation());
  
  // 复制配置按钮
  document.getElementById('copyConfig').addEventListener('click', function() {
    // 获取当前活动的标签页
    const activeTab = document.querySelector('.tab.active').dataset.tab;
    let configText;
    
    if (activeTab === 'config') {
      configText = document.getElementById('configCode').textContent;
    } else if (activeTab === 'styles') {
      configText = document.getElementById('stylesCode').textContent;
    } else if (activeTab === 'json') {
      configText = document.getElementById('jsonCode').textContent;
    }
    
    navigator.clipboard.writeText(configText).then(() => {
      callbacks.showToast('配置已复制到剪贴板');
    });
  });
  
  // 导出配置按钮
  document.getElementById('exportConfig').addEventListener('click', function() {
    const configJson = JSON.stringify({
      config: currentConfig,
      styles: currentStyles
    }, null, 2);
    
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smooth-transition-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    callbacks.showToast('配置已导出');
  });
  
  // 导出样式按钮
  document.getElementById('exportStyles').addEventListener('click', function() {
    const stylesText = callbacks.generateStylesCSS();
    
    const blob = new Blob([stylesText], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smooth-transition-styles.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    callbacks.showToast('样式已导出');
  });
  
  // 导出独立JS按钮
  document.getElementById('exportStandalone').addEventListener('click', function() {
    // 获取当前配置和样式
    const configData = {
      config: currentConfig,
      styles: currentStyles
    };
    
    // 读取smooth-transition-auto.js模板
    fetch('smooth-transition-auto.js')
      .then(response => response.text())
      .then(jsTemplate => {
        // 创建独立版本的JS
        const standaloneJS = callbacks.generateStandaloneJS(jsTemplate, configData);
  
        // 导出文件
        const blob = new Blob([standaloneJS], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'smooth-transition-auto.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        callbacks.showToast('独立JS已导出');
      })
      .catch(error => {
        console.error('导出独立JS失败:', error);
        callbacks.showToast('导出失败，请检查控制台');
      });
  });
}

// 初始化表单值
function initFormValues(config, styles) {
  document.getElementById('duration').value = config.transition.duration;
  document.getElementById('minDisplayTime').value = config.transition.minDisplayTime;
  document.getElementById('easing').value = config.transition.easing;
  document.getElementById('cache').value = config.cache.toString();
  document.getElementById('prefetch').value = config.prefetch.toString();
  document.getElementById('timeout').value = config.timeout;
  
  // 初始化样式表单值
  document.getElementById('overlayBackgroundText').value = styles.overlay.background;
  document.getElementById('overlayZIndex').value = styles.overlay.zIndex;
  
  // 初始化加载器类型选择
  // 先移除所有活动状态
  document.querySelectorAll('.loader-option').forEach(option => {
    option.classList.remove('active');
  });
  
  // 添加当前选中类型的活动状态
  const activeOption = document.querySelector(`.loader-option[data-type="${styles.loader.type}"]`);
  if (activeOption) {
    activeOption.classList.add('active');
  }
  
  document.getElementById('loaderColorText').value = styles.loader.color;
  document.getElementById('loaderSize').value = styles.loader.size;
  document.getElementById('activeLinkColorText').value = styles.links.activeColor;
  document.getElementById('activeLinkBold').value = styles.links.activeBold.toString();
  
  // 初始化自定义加载指示器字段
  if (document.getElementById('customLoaderHTML')) {
    document.getElementById('customLoaderHTML').value = styles.loader.custom?.html || '';
  }
  
  if (document.getElementById('customLoaderCSS')) {
    document.getElementById('customLoaderCSS').value = styles.loader.custom?.css || '';
  }
  
  // 更新颜色预览 - 设置背景色和data属性
  const overlayBgPreview = document.getElementById('overlayBackgroundPreview');
  overlayBgPreview.style.backgroundColor = styles.overlay.background;
  overlayBgPreview.dataset.bgColor = styles.overlay.background;
  
  const loaderColorPreview = document.getElementById('loaderColorPreview');
  loaderColorPreview.style.backgroundColor = styles.loader.color;
  loaderColorPreview.dataset.bgColor = styles.loader.color;
  
  const activeLinkColorPreview = document.getElementById('activeLinkColorPreview');
  activeLinkColorPreview.style.backgroundColor = styles.links.activeColor;
  activeLinkColorPreview.dataset.bgColor = styles.links.activeColor;
  
  // 显示/隐藏自定义加载器面板
  const customLoaderPanel = document.getElementById('customLoaderPanel');
  if (customLoaderPanel) {
    if (styles.loader.type === 'custom') {
      customLoaderPanel.classList.add('active');
    } else {
      customLoaderPanel.classList.remove('active');
    }
  }
}

// 更新预览遮罩层
function updatePreviewOverlay(config, styles) {
  const overlay = document.getElementById('previewOverlay');
  
  // 清除现有内容
  overlay.innerHTML = '';
  
  // 清除任何可能存在的自定义样式
  const customStyleId = 'custom-loader-overlay-style';
  const existingCustomStyle = document.getElementById(customStyleId);
  if (existingCustomStyle) {
    existingCustomStyle.textContent = '';
  }
  
  // 根据类型添加不同的加载指示器
  if (styles.loader.type === 'dots') {
    const loaderDots = document.createElement('div');
    loaderDots.className = 'loader-dots';
    
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.style.width = `${styles.loader.size}px`;
      dot.style.height = `${styles.loader.size}px`;
      dot.style.margin = `0 ${styles.loader.size / 2}px`;
      dot.style.backgroundColor = styles.loader.color;
      loaderDots.appendChild(dot);
    }
    
    overlay.appendChild(loaderDots);
  } else if (styles.loader.type === 'spinner') {
    const spinner = document.createElement('div');
    spinner.className = 'loader-spinner';
    spinner.style.width = `${styles.loader.size * 2}px`;
    spinner.style.height = `${styles.loader.size * 2}px`;
    
    // 设置spinner的after伪元素样式
    const styleId = 'spinner-style';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    
    // 获取旋转器自定义选项
    const thickness = styles.loader.spinner?.thickness || 3;
    const speed = styles.loader.spinner?.speed || 1.2;
    const spinnerStyle = styles.loader.spinner?.style || "half";
    
    // 根据样式生成不同的边框样式
    let borderStyle = '';
    if (spinnerStyle === 'full') {
      borderStyle = `${thickness}px solid ${styles.loader.color}`;
    } else if (spinnerStyle === 'half') {
      borderStyle = `${thickness}px solid transparent`;
      borderStyle += `; border-top-color: ${styles.loader.color}`;
      borderStyle += `; border-right-color: ${styles.loader.color}`;
    } else if (spinnerStyle === 'quarter') {
      borderStyle = `${thickness}px solid transparent`;
      borderStyle += `; border-top-color: ${styles.loader.color}`;
    }
    
    styleEl.textContent = `
      #previewOverlay .loader-spinner:after {
        border-radius: 50%;
        width: ${styles.loader.size * 1.5}px;
        height: ${styles.loader.size * 1.5}px;
        border: ${borderStyle};
        animation: spinner ${speed}s linear infinite;
      }
    `;
    
    overlay.appendChild(spinner);
  } else if (styles.loader.type === 'pulse') {
    const pulse = document.createElement('div');
    pulse.className = 'loader-pulse';
    pulse.style.width = `${styles.loader.size * 2}px`;
    pulse.style.height = `${styles.loader.size * 2}px`;
    pulse.style.backgroundColor = styles.loader.color;
    
    overlay.appendChild(pulse);
  } else if (styles.loader.type === 'custom') {
    if (styles.loader.custom && styles.loader.custom.html) {
      // 添加自定义HTML
      overlay.innerHTML = styles.loader.custom.html;
      
      // 添加自定义CSS到页面
      const styleId = 'custom-loader-overlay-style';
      let styleEl = document.getElementById(styleId);
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      
      styleEl.textContent = styles.loader.custom.css || '';
    } else {
      // 如果没有自定义内容，显示占位符
      const customPlaceholder = document.createElement('div');
      customPlaceholder.className = 'loader-custom-placeholder';
      customPlaceholder.textContent = '自定义指示器';
      overlay.appendChild(customPlaceholder);
    }
  } else if (styles.loader.type === 'none') {
    // 对于'none'类型，不添加任何加载指示器
    const noneElement = document.createElement('div');
    noneElement.className = 'loader-none';
    noneElement.textContent = '无';
    overlay.appendChild(noneElement);
  }
  
  // 确保预览遮罩层有正确的样式
  overlay.style.backgroundColor = styles.overlay.background;
  overlay.style.zIndex = styles.overlay.zIndex;
  
  // 设置过渡持续时间和缓动函数
  overlay.style.transition = `transform ${config.transition.duration}ms ${config.transition.easing}`;
  
  // 设置方向
  overlay.dataset.direction = config.transition.entranceDirection;
}

// 测试动画
function testAnimation(config) {
  const overlay = document.getElementById('previewOverlay');
  const currentState = overlay.dataset.animationState;
  
  if (currentState === 'none' || currentState === 'hidden') {
    // 显示遮罩层
    overlay.dataset.direction = config.transition.entranceDirection;
    overlay.dataset.animationState = 'hidden';
    
    // 强制重绘
    overlay.offsetHeight;
    
    // 开始入场动画
    overlay.dataset.animationState = 'visible';
    
    // 等待最小显示时间后隐藏
    setTimeout(() => {
      overlay.dataset.direction = config.transition.exitDirection;
      overlay.dataset.animationState = 'hidden';
      
      // 监听过渡结束事件，完全隐藏遮罩层
      const transitionEndHandler = function(e) {
        if (e.propertyName === 'transform') {
          overlay.dataset.animationState = 'none';
          overlay.removeEventListener('transitionend', transitionEndHandler);
        }
      };
      
      overlay.addEventListener('transitionend', transitionEndHandler);
    }, config.transition.minDisplayTime);
  } else {
    // 隐藏遮罩层
    overlay.dataset.direction = config.transition.exitDirection;
    overlay.dataset.animationState = 'hidden';
    
    // 监听过渡结束事件，完全隐藏遮罩层
    const transitionEndHandler = function(e) {
      if (e.propertyName === 'transform') {
        overlay.dataset.animationState = 'none';
        overlay.removeEventListener('transitionend', transitionEndHandler);
      }
    };
    
    overlay.addEventListener('transitionend', transitionEndHandler);
  }
}

// 显示提示消息
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

export {
  initEventListeners,
  initFormValues,
  updatePreviewOverlay,
  testAnimation,
  showToast
}; 