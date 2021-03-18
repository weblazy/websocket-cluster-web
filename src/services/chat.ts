import store from '@/store';
import { request } from 'ice';

export default {
    // 简单场景
    async init(params) {
        let storage = window.localStorage
        return await request({
            url: 'http://' + window.location.hostname+':80/p1/web/chatInit',
            method:'post',
            headers: { token: storage.token },
            responseType:'json',
            data:params,
        });
    },
}  