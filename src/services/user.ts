import { request } from 'ice';

export default {
    // 简单场景
    async getUser(params) {
        return await request({
            url: 'http://localhost:9528/p1/web/login',
            method:'post',
            responseType:'json',
            data:params,
        });
    },
}