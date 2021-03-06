/**
 * 跳转首页
 * @return {[type]} [description]
 */
export function goHomePage() {
    if (window.DUKUCONFIG) {
        Xut.Application.Suspend({
            dispose: function() {
                Xut.Application.DropApp() //退出应用
            },
            processed: function() {
                Xut.Application.DropApp() //退出应用
            }
        });
        return;
    }
    //动作处理
    //如果有动作则关闭，否则直接跳转
    Xut.Application.Suspend({
        dispose: function(promptMessage) {
            //停止热点动作
            // promptMessage('关闭所有动作，再按一次将跳至首页！')
        },
        processed: function() {
            Xut.View.GotoSlide(1)
        }
    })
}

/**
 * 创建主页按钮
 * @param  {[type]} bar [description]
 * @return {[type]}     [description]
 */
export function createHomeIcon(height) {
    return `<div class="xut-control-backhome"
                 style="float:left;text-indent:0.25em;height:${height}px;line-height:${height}px;color:#007aff">
                主页
            </div>`
}

/**
 * 创建目录按钮
 * @param  {[type]} bar [description]
 * @return {[type]}     [description]
 */
export function createDirIcon(height) {
    return `<div class="xut-control-navbar"
                 style="float:left;margin-left:4px;width:${height}px;height:${height}px;background-size:cover">
            </div>`
}



/**
 * 应用标题
 * @param  {[type]} bar [description]
 * @return {[type]}     [description]
 */
export function createTitle(height, appName) {
    return `<div class="xut-control-title"
                 style="z-index:-99;width:100%;position:absolute;line-height:${height}px;pointer-events:none">
                ${appName}
            </div>`
}

/**
 * 创建页码数
 * @param  {[type]} bar [description]
 * @return {[type]}     [description]
 */
export function createPageNumber(height, currentPage, pageTotal) {
    const marginTop = height * 0.25
    const iconH = height * 0.5
    return `<div class="xut-control-pageIndex"
                 style="float:right;
                        margin:${marginTop}px 4px;
                        padding:0 0.25em;
                        height:${iconH}px;
                        line-height:${iconH}px;
                        border-radius:0.5em">
                  <span class="control-current-page">${currentPage}</span>/<span>${pageTotal}</span>
            </div>`
}

/**
 * 工具栏隐藏按钮
 * @param  {[type]} bar [description]
 * @return {[type]}     [description]
 */
export function createHideToolbar(height) {
    return `<div class="xut-control-hidebar"
                 style="float:right;width:${height}px;height:${height}px;background-size:cover">
            </div>`
}

/**
 * 关闭子文档按钮
 * @param  {[type]} bar [description]
 * @return {[type]}     [description]
 */
export function createCloseIcon(height) {
    return `<div class="si-icon"
                 data-icon-name="close"
                 style="float:right;margin-right:4px;width:${height}px;height:${height}px">
            </div>`

    // this.super_createSVGIcon(html[0],
    //     function() {
    //         if (window.SUbDOCCONTEXT) {
    //             window.SUbDOCCONTEXT.Xut.publish('subdoc:dropApp');
    //         } else {
    //             Xut.publish('magazine:dropApp');
    //         }
    //     }
    // );
}


/**
 * 关闭子文档按钮(font字体版本)
 * @param  {[type]} height [description]
 * @return {[type]}        [description]
 */
export function createCloseIconFont(height) {
    return `<div class="si-icon icomoon icon-close"
                 data-icon-name="close"
                 style="float:right;margin-right:4px;width:${height}px;height:${height}px">
            </div>`

}
