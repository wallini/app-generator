/**
 * 函数工具栏
 */

import Bar from './base/bar'
import { config } from '../config/index'

const isIOS = Xut.plat.isIOS

export default class fnBar extends Bar {

    constructor({
        pageMode,
        id,
        sceneNode,
        toolType,
        pageTotal,
        currentPage
    } = {}) {
        super()
        this.pageTips = null;
        this.currTip = null;
        this.tipsMode = 0;
        this.top = 0;
        this.Lock = false;
        this.delay = 50;
        this.hasTopBar = false;
        this.barStatus = true;

        //options
        this.pageMode = pageMode;
        this.id = id;
        this.$sceneNode = sceneNode;
        this.toolType = toolType;
        this.pageTotal = pageTotal;
        this.currentPage = currentPage;


        this.svgButton = Xut.config.settings.svgButton
        this._initTool();
    }


    /**
     * 创建工具栏
     * toolType:
     *      0   禁止工具栏
     *      1   系统工具栏   - 显示IOS系统工具栏
     *      2   场景工具栏   - 显示关闭按钮
     *      3   场景工具栏   - 显示返回按钮
     *      4   场景工具栏   - 显示顶部小圆点式标示
     *  pageMode:
     *      0禁止滑动
     *      1允许滑动无翻页按钮
     *      2 允许滑动带翻页按钮
     * @return {[type]} [description]
     */
    _initTool() {
        const $sceneNode = this.$sceneNode

        let type

        $sceneNode.hide();

        this.controlBar = []
        const svgButton = this.svgButton
            //配置工具栏
        while (type = this.toolType.shift()) {
            switch (type) {
                case 1:
                    this._createSystemBar();
                    break;
                case 2:
                    svgButton ? this._createCloseIcon() : this._createCloseIconFont();
                    break;
                case 3:
                    svgButton ? this._createBackIcon($sceneNode) : this._createBackIconFont($sceneNode);
                    break;
                case 4:
                    this._createPageTips();
                    break;
                default:
                    this.barStatus = false;
                    this.hasTopBar = false;
                    break;
            }
        }

        //创建翻页按钮
        if (this.pageMode === 2) {
            this.super_createArrows();
        }

        $sceneNode.show();
    }


    /**
     * 系统工具栏
     */
    _createSystemBar() {
        const id = this.id
        const height = this.super_barHeight
        let html = `<div class="xut-control-bar"
                         style="top:0;height:${this.super_iconHeight}px;padding-top:${height}px">
                    </div>`
        html = $(String.styleFormat(html))
        this.top = height;
        this.super_showSystemBar();
        this._createBackIcon(html)
        this._createTitle(html)
        this._createPageNum(html)
        this.controlBar = html;
        this.$sceneNode.append(html);
        this.hasTopBar = true;
    }

    /**
     * 页码小圆点
     */
    _createPageTips() {
        let chapters = this.pageTotal
        let height = this.super_iconHeight
        let html = ''

        //li内容
        let content = ''

        //如果只有一页则不显示小圆
        if (chapters < 2) {
            return html
        }

        //圆点尺寸
        const size = isIOS ? 7 : Math.max(8, Math.round(this.super_propHeight * 8))
        const width = 2.5 * size //圆点间距
        const tipsWidth = chapters * width //圆点总宽度
        const top = (height - size) / 2 //保持圆点垂直居中
        const left = (config.viewSize.width - tipsWidth) / 2 //保持圆点水平居中


        for (var i = 1; i <= chapters; i++) {
            content +=
                `<li class="xut-scenario-dark" 
                      style="float:left;width:${width}px;height:${height}px;" 
                      data-index="${i}">
                    <div class="xut-scenario-radius" 
                          style="width:${size}px;height:${size}px;margin:${top}px auto">
                    </div>
                </li>`
        }

        html = `<ul class="xut-scenario-tips"  
                    style="top:${this.top}px;left:${left}px;width:${tipsWidth}px;opacity:0.6">
                    ${content}
                </ul>`

        html = $(String.styleFormat(html))

        //点击跳转页面
        this.$tipsNode = html
        this.$tipsNode.on('click', e => {
            const target = e.target
            switch (target.className) {
                case 'xut-control-nav-hide':
                    this.hideTopBar();
                    break;
                case 'xut-scenario-dark':
                    if (this.pageMode) {
                        const index = target.getAttribute('data-index') || 1;
                        Xut.View.GotoSlide(Number(index));
                    }
                    break;
                default:
                    break;
            }
        })
        this.pageTips = html.children()
        this.tipsMode = 1;
        this.controlBar.push(html);
        this.$sceneNode.append(html);
    }

    /**
     * 更新页码指示
     * @return {[type]} [description]
     */
    updatePointer({
        parentIndex
    }) {
        switch (this.tipsMode) {
            case 1:
                if (this.prevTip) {
                    this.prevTip.className = 'xut-scenario-dark';
                }
                this.currTip = this.pageTips[parentIndex];
                this.currTip.className = 'xut-scenario-light';
                this.prevTip = this.currTip;
                break;
            case 2:
                this.currTip.html(parentIndex + 1);
                break;
            default:
                break;
        }
    }

    /**
     * svg版本：关闭按钮
     * @return {[type]} [description]
     */
    _createCloseIcon() {
        const height = this.super_iconHeight;
        let html =
            `<div class="si-icon xut-scenario-close" 
                  data-icon-name="close" 
                  style="top:${this.top}px;width:${height}px;height:${height}px">
            </div>`
        html = $(String.styleFormat(html))
        this.super_createSVGIcon($(html)[0], () => Xut.View.CloseScenario())
        this.controlBar.push(html);
        this.$sceneNode.append(html);
    }

    /**
     * svg版本：返回按钮
     * @return {[type]} [description]
     */
    _createBackIcon($sceneNode) {
        const height = this.super_iconHeight;
        let html =
            `<div class="si-icon xut-scenario-back" 
                  data-icon-name="back" 
                  style="top:${this.top}px;width:${height}px;height:${height}px">
            </div>`
        html = $(String.styleFormat(html))
        this.super_createSVGIcon(html[0], () => Xut.View.CloseScenario())
        this.controlBar.push(html);
        $sceneNode.append(html);
    }

    /**
     * font字体版本：关闭按钮
     * @return {[type]} [description]
     */
    _createCloseIconFont() {
        const height = this.super_iconHeight;
        let html = `<div class="si-icon xut-scenario-close icomoon icon-close" 
                  style="top:${this.top}px;width:${height}px;height:${height}px;line-height:${height}px;text-align:center;font-size:3vh;">
            </div>`;

        html = $(String.styleFormat(html))

        html.on("touchend mouseup", function() {
            Xut.View.CloseScenario()
        });

        this.controlBar.push(html);
        this.$sceneNode.append(html);
    }

    /**
     * font字体版本：返回按钮
     * @return {[type]} [description]
     */
    _createBackIconFont($sceneNode) {
        const height = this.super_iconHeight;
        let html =
            `<div class="si-icon xut-scenario-back icomoon icon-arrow-left" 
                  style="top:${this.top}px;width:${height}px;height:${height}px;line-height:${height}px;">
            </div>`
        html = $(String.styleFormat(html))

        html.on("touchend mouseup", function() {
            Xut.View.CloseScenario()
        });
        this.controlBar.push(html);
        $sceneNode.append(html);
    }

    /**
     * 创建页码数
     * @param  {[type]} $sceneNode [description]
     * @return {[type]}            [description]
     */
    _createPageNum($sceneNode) {
        var pageTotal = this.pageTotal,
            TOP = this.top,
            height = this.super_iconHeight,
            currentPage = this.currentPage,
            style, html;

        html =
            `<div class="xut-control-pageindex" 
                  style="position:absolute;
                         right:4px;
                         top:${height * 0.25 + TOP}px;
                         padding:0 0.25em;
                         height:${height * 0.5}px;
                         line-height:${height * 0.5}px;
                         border-radius:0.5em">
                <span class="currentPage">${currentPage}</span>/<span>${pageTotal}</span>
            </div>`
        html = $(String.styleFormat(html));
        this.tipsMode = 2;
        this.currTip = html.children().first();
        $sceneNode.append(html);
    }


    /**
     * 应用标题
     * @param  {[type]} $sceneNode [description]
     * @return {[type]}            [description]
     */
    _createTitle($sceneNode) {
        const html =
            `<div class="xut-control-title"
                  style="line-height:${this.super_iconHeight}px">
                ${this.appName}
            </div>`
        $sceneNode.append(String.styleFormat(html))
    }


    /**
     * 显示顶部工具栏
     * @return {[type]} [description]
     */
    showTopBar() {
        var that = this,
            delay = this.delay,
            controlBar = this.controlBar;
        if (this.barStatus) {
            this.Lock = false;
            return;
        }
        if (this.hasTopBar) {
            controlBar.css({
                'display': 'block',
                'opacity': 0
            });
            setTimeout(function() {
                controlBar.animate({
                    'opacity': 1
                }, delay, 'linear', function() {
                    that.__showSystemBar();
                    that.barStatus = true;
                    that.Lock = false;
                });
            });
        } else {
            controlBar.forEach(function(el) {
                el.show();
                that.Lock = false;
                that.barStatus = true;
            });
        }
    }

    /**
     * 隐藏顶部工具栏
     * @return {[type]} [description]
     */
    hideTopBar() {
        var that = this,
            delay = this.delay,
            controlBar = this.controlBar;

        if (!this.barStatus) {
            this.Lock = false;
            return;
        }
        if (this.hasTopBar) {
            controlBar.animate({
                'opacity': 0
            }, delay, 'linear', function() {
                that.controlBar.hide();
                that.__hideSystemBar();
                that.barStatus = false;
                that.Lock = false;
            });
        } else {
            controlBar.forEach(function(el) {
                el.hide(delay, function() {
                    that.Lock = false;
                    that.barStatus = false;
                });
            });
        }
    }


    destroy() {
        this.$sceneNode = null
        this.controlBar = null;
        this.pageTips = null;
        this.currTip = null;
        this.prevTip = null;

        //小图标点击事件
        if (this.$tipsNode) {
            this.$tipsNode.off()
            this.$tipsNode = null
        }

        //销毁超类
        this.super_destory()
    }

}
