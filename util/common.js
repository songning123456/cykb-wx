let common = {};
common.getSex = function (sex) {
    let result = '';
    switch (sex) {
        case 'male':
            result = '男频';
            break;
        case 'female':
            result = '女频';
            break;
        default:
            result = '未知';
            break;
    }
    return result;
};
common.getCover = function (url) {
    let result = '';
    if (url) {
        result = url;
    } else {
        let param = (Math.random() + '').slice(2, 3);
        result = 'https://ossweb-img.qq.com/images/lol/web201310/skin/big1000' + param + '.jpg';
    }
    return result;
};
common.getIntroduction = function(introduction) {
    let result = '';
    if (introduction) {
        result = introduction;
    } else {
        result = '暂无简介...';
    }
    return result;
};
common.sleep = function (milliSeconds) {
    let startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds) {
       // ...
    }
};

/**
 *
 * @param obj
 * @param func
 * @param wait 毫秒
 * @param arrParams
 * @returns {Function}
 */
common.debounce = function (obj, func, wait, arrParams) {
    let timeout = null;
    (function() {
        if(timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            if (arrParams) {
                func.apply(obj, arrParams);
            } else {
                func.apply(obj);
            }
        }, wait);
    })()
};
common.throttle = function (obj, func, delay, arrParams) {
    let timer = null;
    let startTime = Date.now();
    return function() {
        let curTime = Date.now();
        let remaining = delay - (curTime - startTime);
        clearTimeout(timer);
        if (remaining <= 0) {
            if (arrParams) {
                func.apply(obj, arrParams);
            } else {
                func.apply(obj);
            }
            startTime = Date.now();
        } else {
            timer = setTimeout(func, remaining);
        }
    }
}
export default common;
