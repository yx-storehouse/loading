/**
 * SmoothTransition - 无刷新页面跳转模块
 * 版本: 1.0.0
 * 作者: v0
 *
 * 一个轻量级的页面过渡解决方案，支持自定义过渡效果、页面缓存和导航钩子。
 */

class SmoothTransition {
  /**
   * 创建一个无刷跳转实例
   * @param {Object} options - 配置选项
   */
  constructor(options = {}) {
    // 默认配置
    this.config = {
      // 选择器配置
      selectors: {
        links: "a[data-smooth]", // 默认拦截带有 data-smooth 属性的链接
        content: "#content", // 内容容器选择器
        overlay: "#overlay", // 过渡动画遮罩层选择器
      },

      // 过渡动画设置
      transition: {
        type: "fade", // 过渡类型: fade, slide, zoom
        duration: 500, // 过渡持续时间(毫秒)
        easing: "ease", // 过渡缓动函数
        minDisplayTime: 0, // 遮罩至少显示时间(毫秒)，即使内容已加载完成
        entranceDirection: "bottom", // 入场方向: top, bottom, left, right
        exitDirection: "bottom", // 退场方向: top, bottom, left, right
      },

      // 功能设置
      cache: true, // 是否缓存页面内容
      prefetch: false, // 是否预加载链接
      timeout: 8000, // 请求超时时间(毫秒)

      // 导航钩子
      beforeEach: null, // 导航前钩子
      afterEach: null, // 导航后钩子
      onError: null, // 错误处理钩子

      // 调试设置
      debug: false, // 是否启用调试模式

      ...options,
    }

    // 缓存对象
    this.pageCache = {}

    // 当前页面URL
    this.currentUrl = window.location.pathname

    // DOM元素引用
    this.contentEl = null
    this.overlayEl = null

    // 标记是否正在导航中
    this.isNavigating = false

    // 动画状态
    this.animationState = "hidden"

    // 内容加载完成的时间戳
    this.contentLoadedTime = 0

    // 导航开始的时间戳
    this.navigationStartTime = 0

    // 待处理的导航
    this.pendingNavigation = null

    // 遮罩层显示完成的标志
    this.overlayShown = false
  }

  /**
   * 调试日志
   * @private
   */
  _log(...args) {
    if (this.config.debug) {
      console.log("[SmoothTransition]", ...args)
    }
  }

  /**
   * 初始化无刷跳转
   * @returns {SmoothTransition} 当前实例，用于链式调用
   */
  init() {
    this._log("初始化无刷跳转...")

    // 获取DOM元素
    this.contentEl = document.querySelector(this.config.selectors.content)
    this.overlayEl = document.querySelector(this.config.selectors.overlay)

    if (!this.contentEl) {
      console.error(`无法找到内容元素: ${this.config.selectors.content}`)
      return this
    }

    if (!this.overlayEl) {
      console.error(`无法找到遮罩层元素: ${this.config.selectors.overlay}`)
      return this
    }

    // 应用过渡持续时间到遮罩层
    this._applyTransitionDuration()

    this._log("找到所需DOM元素")

    // 拦截导航链接点击
    this._setupLinkInterception()

    // 监听浏览器前进/后退按钮
    this._setupPopStateListener()

    // 预加载链接（如果启用）
    if (this.config.prefetch) {
      this._setupPrefetching()
    }

    // 监听遮罩层过渡结束事件
    this._setupTransitionEndListener()

    // 触发初始化完成事件
    this._triggerEvent("st:initialized", {})

    this._log("无刷跳转初始化完成")

    return this
  }

  /**
   * 应用过渡持续时间到遮罩层
   * @private
   */
  _applyTransitionDuration() {
    if (this.overlayEl) {
      // 设置入场动画持续时间
      this.overlayEl.style.setProperty("--entrance-duration", `${this.config.transition.duration}ms`)
      // 设置退场动画持续时间
      this.overlayEl.style.setProperty("--exit-duration", `${this.config.transition.duration}ms`)
      // 设置过渡缓动函数
      this.overlayEl.style.setProperty("--transition-easing", this.config.transition.easing)

      this._log(`应用过渡持续时间: ${this.config.transition.duration}ms`)
    }
  }

  /**
   * 设置链接拦截
   * @private
   */
  _setupLinkInterception() {
    const links = document.querySelectorAll(this.config.selectors.links)
    this._log(`找到 ${links.length} 个导航链接`)

    links.forEach((link) => {
      // 移除现有的事件监听器（如果有）
      const newLink = link.cloneNode(true)
      link.parentNode.replaceChild(newLink, link)

      newLink.addEventListener("click", (e) => {
        // 获取链接目标URL
        const href = newLink.getAttribute("href")

        // 检查是否是外部链接或锚点链接
        if (this._isExternalLink(href) || this._isAnchorLink(href)) {
          this._log(`不拦截外部链接或锚点链接: ${href}`)
          return // 不拦截外部链接或锚点链接
        }

        e.preventDefault()
        this._log(`拦截链接点击，准备导航到: ${href}`)
        this.navigate(href)
      })
    })
  }

  /**
   * 设置浏览器历史监听
   * @private
   */
  _setupPopStateListener() {
    window.addEventListener("popstate", (e) => {
      const url = window.location.pathname
      this._log(`检测到浏览器历史变化，导航到: ${url}`)
      this.navigate(url, { updateHistory: false })
    })
  }

  /**
   * 设置过渡结束事件监听
   * @private
   */
  _setupTransitionEndListener() {
    if (this.overlayEl) {
      this.overlayEl.addEventListener("transitionend", (e) => {
        // 只处理transform属性的过渡结束事件
        if (e.propertyName === "transform") {
          if (this.animationState === "hiding") {
            // 退场动画完成
            this.animationState = "hidden"
            this.overlayShown = false
            this._log("遮罩层退场动画完成")

            // 完全隐藏遮罩层
            this.overlayEl.setAttribute("data-animation-state", "none")
            this._log("遮罩层已完全隐藏")

            this._triggerEvent("st:overlayHidden", {})

            // 重置导航状态
            this.isNavigating = false

            // 重要：重置方向属性为入场方向，为下一次入场做准备
            this.overlayEl.setAttribute("data-direction", this.config.transition.entranceDirection)
            this._log(`重置遮罩层方向为入场方向: ${this.config.transition.entranceDirection}`)
          } else if (this.animationState === "showing") {
            // 入场动画完成
            this.animationState = "visible"
            this.overlayShown = true
            this._log("遮罩层入场动画完成")
            this._triggerEvent("st:overlayShown", {})

            // 如果有待处理的导航，继续执行
            if (this.pendingNavigation) {
              const { url, options, resolve, reject } = this.pendingNavigation
              this._log("继续执行待处理的导航")
              this._continueNavigation(url, options, resolve, reject)
              this.pendingNavigation = null
            }
          }
        }
      })
    }
  }

  /**
   * 设置链接预加载
   * @private
   */
  _setupPrefetching() {
    const links = document.querySelectorAll(this.config.selectors.links)

    links.forEach((link) => {
      const href = link.getAttribute("href")

      // 检查是否是外部链接或锚点链接
      if (this._isExternalLink(href) || this._isAnchorLink(href)) {
        return // 不预加载外部链接或锚点链接
      }

      // 创建预加载观察器
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 链接进入视口，开始预加载
            this._prefetchUrl(href)
            // 停止观察
            observer.unobserve(link)
          }
        })
      })

      // 开始观察链接
      observer.observe(link)
    })
  }

  /**
   * 预加载URL
   * @param {string} url - 要预加载的URL
   * @private
   */
  _prefetchUrl(url) {
    // 如果已经缓存，不需要预加载
    if (this.pageCache[url]) {
      return
    }

    this._log(`预加载页面: ${url}`)

    // 使用fetch API预加载页面
    fetch(url, {
      method: "GET",
      credentials: "same-origin",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((response) => response.text())
      .then((html) => {
        // 提取内容
        const content = this._extractContent(html)

        // 缓存页面内容
        this.pageCache[url] = content
        this._log(`页面预加载完成: ${url}`)
      })
      .catch((error) => {
        console.error(`预加载页面失败: ${url}`, error)
      })
  }

  /**
   * 导航到指定URL
   * @param {string} url - 目标URL
   * @param {Object} options - 导航选项
   * @returns {Promise} 导航完成的Promise
   */
  navigate(url, options = { updateHistory: true }) {
    return new Promise((resolve, reject) => {
      // 如果是当前页面或正在导航中，不执行导航
      if (url === this.currentUrl || this.isNavigating) {
        this._log(`跳过导航: ${url === this.currentUrl ? "当前页面" : "正在导航中"}`)
        return resolve(false)
      }

      this._log(`开始导航: ${this.currentUrl} -> ${url}`)
      this.isNavigating = true

      // 记录导航开始时间
      this.navigationStartTime = Date.now()

      // 执行导航前钩子
      if (typeof this.config.beforeEach === "function") {
        const next = (proceed = true) => {
          if (proceed) {
            this._performNavigation(url, options, resolve, reject)
          } else {
            this.isNavigating = false
            resolve(false)
          }
        }

        this.config.beforeEach(url, this.currentUrl, next)
      } else {
        this._performNavigation(url, options, resolve, reject)
      }
    })
  }

  /**
   * 执行导航
   * @param {string} url - 目标URL
   * @param {Object} options - 导航选项
   * @param {Function} resolve - Promise resolve函数
   * @param {Function} reject - Promise reject函数
   * @private
   */
  _performNavigation(url, options, resolve, reject) {
    // 触发导航前事件
    const beforeEvent = this._triggerEvent("st:beforeNavigate", {
      from: this.currentUrl,
      to: url,
    })

    // 如果事件被取消，停止导航
    if (beforeEvent.defaultPrevented) {
      this._log("导航被取消")
      this.isNavigating = false
      return resolve(false)
    }

    // 显示过渡动画 - 入场动画
    this._showOverlay()

    // 存储待处理的导航，等待遮罩层完全显示后再继续
    this.pendingNavigation = { url, options, resolve, reject }
  }

  /**
   * 继续执行导航（在遮罩层完全显示后）
   * @param {string} url - 目标URL
   * @param {Object} options - 导航选项
   * @param {Function} resolve - Promise resolve函数
   * @param {Function} reject - Promise reject函数
   * @private
   */
  _continueNavigation(url, options, resolve, reject) {
    this._log(`遮罩层已完全显示，继续导航到: ${url}`)

    // 更新浏览器历史（如果需要）
    if (options.updateHistory) {
      history.pushState(null, null, url)
      this._log(`更新浏览器历史: ${url}`)
    }

    // 加载页面内容
    this._loadContent(url)
      .then(() => {
        // 记录内容加载完成时间
        this.contentLoadedTime = Date.now()
        resolve(true)
      })
      .catch((error) => {
        this._handleError(error, url)
        reject(error)
      })
  }

  /**
   * 加载页面内容
   * @param {string} url - 页面URL
   * @returns {Promise} 加载完成的Promise
   * @private
   */
  _loadContent(url) {
    return new Promise((resolve, reject) => {
      this._log(`加载页面内容: ${url}`)

      // 检查缓存
      if (this.config.cache && this.pageCache[url]) {
        this._log(`使用缓存内容: ${url}`)
        this._updateContent(this.pageCache[url], url)
        return resolve()
      }

      // 设置超时
      const timeoutId = setTimeout(() => {
        reject(new Error("请求超时"))
      }, this.config.timeout)

      // 获取页面内容
      this._log(`获取页面内容: ${url}`)

      // 添加随机参数以避免浏览器缓存
      const fetchUrl = url + (url.includes("?") ? "&" : "?") + "_=" + Date.now()

      fetch(fetchUrl, {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        cache: "no-store", // 禁用浏览器缓存
      })
        .then((response) => {
          clearTimeout(timeoutId)

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          return response.text()
        })
        .then((html) => {
          this._log(`页面内容获取成功: ${url}`)

          // 提取内容
          const content = this._extractContent(html)

          // 缓存页面内容
          if (this.config.cache) {
            this.pageCache[url] = content
            this._log(`缓存页面内容: ${url}`)
          }

          // 更新页面内容
          this._updateContent(content, url)
          resolve()
        })
        .catch((error) => {
          clearTimeout(timeoutId)
          console.error(`获取页面内容失败: ${url}`, error)
          reject(error)
        })
    })
  }

  /**
   * 从HTML中提取内容
   * @param {string} html - 完整的HTML
   * @returns {Object} 提取的内容
   * @private
   */
  _extractContent(html) {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")

      // 查找内容元素
      const contentEl = doc.querySelector(this.config.selectors.content)

      if (!contentEl) {
        console.error(`在目标页面中找不到内容元素: ${this.config.selectors.content}`)
        return {
          title: doc.title,
          content: '<div class="error">页面内容加载失败</div>',
          bodyClasses: doc.body.className,
        }
      }

      return {
        title: doc.title,
        content: contentEl.innerHTML,
        bodyClasses: doc.body.className,
      }
    } catch (error) {
      console.error("提取内容时出错:", error)
      return {
        title: "错误",
        content: '<div class="error">解析页面内容时出错</div>',
        bodyClasses: "",
      }
    }
  }

  /**
   * 更新页面内容
   * @param {Object} content - 页面内容
   * @param {string} url - 页面URL
   * @private
   */
  _updateContent(content, url) {
    this._log(`更新页面内容: ${url}`)

    // 更新页面标题
    document.title = content.title

    // 更新内容
    if (this.contentEl) {
      // 保存内容元素的引用
      const contentEl = this.contentEl

      // 更新内容
      contentEl.innerHTML = content.content

      // 重新获取内容元素（因为innerHTML可能会破坏引用）
      this.contentEl = document.querySelector(this.config.selectors.content)

      // 如果找不到内容元素，恢复之前的引用
      if (!this.contentEl) {
        console.error(`更新内容后找不到内容元素: ${this.config.selectors.content}`)
        this.contentEl = contentEl
      }
    } else {
      console.error("内容元素不存在，无法更新内容")
    }

    // 更新当前URL
    const oldUrl = this.currentUrl
    this.currentUrl = url

    // 更新活动链接状态
    this._updateActiveLinks()

    // 重新设置链接拦截
    this._setupLinkInterception()

    // 计算内容加载后经过的时间
    const elapsedTime = Date.now() - this.navigationStartTime

    // 计算还需要等待的时间，确保遮罩至少显示配置的最小显示时间
    const minDisplayTime = this.config.transition.minDisplayTime || 0
    const remainingTime = Math.max(0, minDisplayTime - elapsedTime)

    this._log(`内容已加载，经过 ${elapsedTime}ms，还需等待 ${remainingTime}ms 后隐藏遮罩层`)

    // 等待一段时间后隐藏遮罩层，确保遮罩至少显示最小显示时间
    setTimeout(() => {
      // 隐藏遮罩层 - 退场动画
      this._hideOverlay()

      // 触发内容加载完成事件
      this._triggerEvent("st:contentLoaded", { url })

      // 触发导航完成事件
      this._triggerEvent("st:afterNavigate", {
        from: oldUrl,
        to: url,
        cached: this.pageCache[url] !== undefined,
      })

      // 执行导航后钩子
      if (typeof this.config.afterEach === "function") {
        this.config.afterEach(url, oldUrl)
      }

      this._log(`导航完成: ${oldUrl} -> ${url}`)
    }, remainingTime)
  }

  /**
   * 更新活动链接状态
   * @private
   */
  _updateActiveLinks() {
    document.querySelectorAll(this.config.selectors.links).forEach((link) => {
      const href = link.getAttribute("href")

      if (href === this.currentUrl) {
        link.classList.add("active")
      } else {
        link.classList.remove("active")
      }
    })
  }

  /**
   * 处理错误
   * @param {Error} error - 错误对象
   * @param {string} url - 页面URL
   * @private
   */
  _handleError(error, url) {
    console.error(`加载页面失败: ${url}`, error)

    // 隐藏遮罩层
    this._hideOverlay()

    // 重置导航状态
    this.isNavigating = false
    this.pendingNavigation = null

    // 触发错误事件
    this._triggerEvent("st:error", {
      error,
      url,
    })

    // 执行错误处理钩子（如果有）
    if (typeof this.config.onError === "function") {
      this.config.onError(error, url, this.currentUrl)
    }
  }

  /**
   * 显示遮罩层 - 入场动画
   * @private
   */
  _showOverlay() {
    // 确保遮罩层存在
    if (!this.overlayEl) {
      console.error("遮罩层元素不存在")
      return
    }

    // 设置动画状态为"正在显示"
    this.animationState = "showing"
    this.overlayShown = false

    // 设置入场方向
    this.overlayEl.setAttribute("data-direction", this.config.transition.entranceDirection)

    // 恢复指针事件
    this.overlayEl.style.pointerEvents = "all"

    // 确保遮罩层可见（从完全隐藏状态恢复）
    this.overlayEl.setAttribute("data-animation-state", "hidden")

    // 强制重绘，确保状态变化生效
    this.overlayEl.offsetHeight

    // 更新数据属性以触发CSS过渡
    this.overlayEl.setAttribute("data-animation-state", "visible")

    // 触发事件
    this._triggerEvent("st:overlayShowing", {})
  }

  /**
   * 隐藏遮罩层 - 退场动画
   * @private
   */
  _hideOverlay() {
    // 确保遮罩层存在
    if (!this.overlayEl) {
      console.error("遮罩层元素不存在")
      return
    }

    // 设置动画状态为"正在隐藏"
    this.animationState = "hiding"

    // 设置退场方向
    this.overlayEl.setAttribute("data-direction", this.config.transition.exitDirection)

    // 立即禁用指针事件，防止遮罩层在退场过程中影响用户交互
    this.overlayEl.style.pointerEvents = "none"

    // 更新数据属性以触发CSS过渡
    this.overlayEl.setAttribute("data-animation-state", "hidden")

    // 触发事件
    this._triggerEvent("st:overlayHiding", {})
  }

  /**
   * 触发自定义事件
   * @param {string} name - 事件名称
   * @param {Object} detail - 事件详情
   * @returns {CustomEvent} 触发的事件
   * @private
   */
  _triggerEvent(name, detail) {
    const event = new CustomEvent(name, {
      bubbles: true,
      cancelable: true,
      detail,
    })

    document.dispatchEvent(event)
    return event
  }

  /**
   * 检查是否是外部链接
   * @param {string} url - 链接URL
   * @returns {boolean} 是否是外部链接
   * @private
   */
  _isExternalLink(url) {
    if (!url) return false
    return url.startsWith("http") || url.startsWith("//")
  }

  /**
   * 检查是否是锚点链接
   * @param {string} url - 链接URL
   * @returns {boolean} 是否是锚点链接
   * @private
   */
  _isAnchorLink(url) {
    if (!url) return false
    return url.startsWith("#")
  }

  /**
   * 更新配置
   * @param {Object} newConfig - 新配置
   * @returns {SmoothTransition} 当前实例，用于链式调用
   */
  updateConfig(newConfig) {
    // 深度合并配置
    if (newConfig.transition) {
      this.config.transition = {
        ...this.config.transition,
        ...newConfig.transition,
      }
    }

    if (newConfig.selectors) {
      this.config.selectors = {
        ...this.config.selectors,
        ...newConfig.selectors,
      }
    }

    // 合并其他顶级配置
    this.config = {
      ...this.config,
      ...newConfig,
    }

    // 如果已经初始化，则应用新的过渡持续时间
    if (this.overlayEl) {
      this._applyTransitionDuration()
    }

    return this
  }

  /**
   * 清除缓存
   * @returns {SmoothTransition} 当前实例，用于链式调用
   */
  clearCache() {
    this._log("清除页面缓存")
    this.pageCache = {}

    return this
  }

  /**
   * 销毁实例
   */
  destroy() {
    // 移除事件监听器
    document.querySelectorAll(this.config.selectors.links).forEach((link) => {
      link.replaceWith(link.cloneNode(true))
    })

    window.removeEventListener("popstate", this._setupPopStateListener)

    // 清除缓存
    this.clearCache()

    // 触发销毁事件
    this._triggerEvent("st:destroyed", {})

    this._log("无刷跳转已销毁")
  }
}

// 导出 SmoothTransition 类
export default SmoothTransition
