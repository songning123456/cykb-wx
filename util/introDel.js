let introDel = {};

let delList = [
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~...'
];

introDel.getIntro = function (originIntro) {
    if (originIntro) {
        let result = originIntro;
        for (let item of delList) {
            if (result.includes(item)) {
                result = result.replace(new RegExp(item, 'g'), '');
            }
        }
        return result;
    } else {
        return '暂无简介...';
    }
};
export default introDel;