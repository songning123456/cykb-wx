let request = {};
let host = 'https://wx.sonin.cn/cykb';

request.post = function (url, params) {
    return new Promise((resolve, reject) => {
        uni.request({
            url: host + url,
            method: 'POST',
            data: params,
            success: response => {
                resolve(response.data);
            },
            fail: response => {
                reject(response.data);
            }
        });
    });
};
request.get = function (url, params) {
    return new Promise((resolve, reject) => {
        request.getFunc = uni.request({
            url: host + url,
            method: 'GET',
            data: params,
            success: response => {
                resolve(response.data);
            },
            fail: response => {
                reject(response.data);
            }
        });
    });
};
export default request;
