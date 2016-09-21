/**
 * 页面切换效果
 * 平移
 * @return {[type]} [description]
 */

import { config } from '../config/index'

let offsetCut
let offsetLeft
let offsetRight
let prevEffect
let currEffect
let nextEffect

const transitionDuration = Xut.style.transitionDuration
const transform = Xut.style.transform
const translateZ = Xut.style.translateZ

const xxtTrans = (offset) => {
    offset = config.virtualMode ? offset / 2 : offset;
    return 'translate(' + offset + 'px,0px)' + translateZ
}

const dydTransform = (distance) => {
    distance = config.virtualMode ? distance / 2 : distance;
    return transform + ':' + 'translate(' + distance + 'px,0px)' + translateZ
}


/**
 * 设置基本参数
 * @return {[type]} [description]
 */
const initOptions = () => {
    let calculateContainer = config.proportion.calculateContainer()
    offsetLeft = (-1 * calculateContainer.width)
    offsetRight = calculateContainer.width
    offsetCut = 0
    prevEffect = xxtTrans(offsetLeft)
    currEffect = xxtTrans(offsetCut)
    nextEffect = xxtTrans(offsetRight)
}


/**
 * 新的可视区页面
 * @param  {[type]}  distance [description]
 * @return {Boolean}          [description]
 */
const newViewPage = function(distance) {
    //calculateDistance中修改了对应的distance
    //这里给swipe捕获
    if (distance === 0 || Math.abs(distance) === Math.abs(config.overflowSize.left)) { //目标页面传递属性
        return true
    }
}


/**
 * 切换坐标
 * @param  {[type]} context  [description]
 * @param  {[type]} distance [description]
 * @param  {[type]} speed    [description]
 * @param  {[type]} element  [description]
 * @return {[type]}          [description]
 */
const toTranslate3d = (context, distance, speed, element) => {
    distance = config.virtualMode ? distance / 2 : distance;
    if (element = element || context.element || context.$contentProcess) {
        element.css(transform, 'translate(' + distance + 'px,0px)' + translateZ)
        if (config.flipMode) {
            //修正flipMode切换页面的处理
            //没有翻页效果
            if (newViewPage(distance)) {
                const cur = Xut.sceneController.containerObj('current')
                cur.vm.$globalEvent.setAnimComplete(element);
            }
        } else {
            element.css(transitionDuration, speed + "ms")
        }
    }
}


/**
 * 复位
 * @return {[type]} [description]
 */
const reset = (context) => {
    var element
    if (element = context.element || context.$contentProcess) {
        element.css(transitionDuration, '');
        element.css(transform, 'translate(0px,0px)' + translateZ);
    }
}


/**
 * 移动
 * @return {[type]} [description]
 */
const flipMove = (context, distance, speed, element) => {
    toTranslate3d(context, distance, speed, element)
}


/**
 * 移动反弹
 * @return {[type]} [description]
 */
const flipRebound = (context, distance, speed, element) => {
    toTranslate3d(context, distance, speed, element)
}


/**
 * 移动结束
 * @return {[type]} [description]
 */
const flipOver = (context, distance, speed, element) => {
    //过滤多个动画回调，保证指向始终是当前页面
    if (context.pageType === 'page') {
        if (newViewPage(distance)) { //目标页面传递属性
            context.element.attr('data-view', true)
        }
    }
    toTranslate3d(context, distance, speed, element)
}


/**
 * translation滑动接口
 * @type {Object}
 */
export const translation = {
    reset: reset,
    flipMove: flipMove,
    flipRebound: flipRebound,
    flipOver: flipOver
}


/**
 * 修正坐标
 * @return {[type]} [description]
 */
export function fix(element, translate3d) {
    translate3d = translate3d === 'prevEffect' ? prevEffect : nextEffect
    element.css(transform, translate3d)
}


/**
 * 创建起始坐标
 * isFlowType 如果是flow类型
 * @return {[type]}
 */
export function createTransform(currPageIndex, createPageIndex, isFlowType) {
    initOptions()
    var translate3d, direction, offset;
    if (createPageIndex < currPageIndex) {
        translate3d = prevEffect;
        offset = offsetLeft;
        direction = 'before';
    } else if (createPageIndex > currPageIndex) {
        translate3d = nextEffect;
        offset = offsetRight;
        direction = 'after';
    } else if (currPageIndex == createPageIndex) {
        translate3d = currEffect;
        offset = offsetCut;
        direction = 'original';
    }
    return [translate3d, direction, offset, dydTransform]
}
