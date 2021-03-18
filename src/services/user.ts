import { request } from 'ice';

export default {
    // 简单场景
    async getUser(params) {
        return await request({
            url: 'http://' + window.location.hostname+':80/p1/web/login',
            method:'post',
            responseType:'json',
            data:params,
        });
    },
    async sendSmsCode(params) {
        return await request({
            url: 'http://' + window.location.hostname+':80/p1/web/sendSmsCode',
            method: 'post',
            responseType: 'json',
            data: params,
        });
    },
    async register(params) {
        return await request({
            url: 'http://' + window.location.hostname+':80/p1/web/register',
            method: 'post',
            responseType: 'json',
            data: params,
        });
    },
    async search(headers,params) {
        return await request({
            url: 'http://' + window.location.hostname+':80/p1/web/search',
            headers: headers,
            method: 'post',
            responseType: 'json',
            data: params,
        });
    },
    async addFriend(headers, params) {
        return await request({
            url: 'http://' + window.location.hostname+':80/p1/web/addFriend',
            headers: headers,
            method: 'post',
            responseType: 'json',
            data: params,
        });
    },
    async acceptAddFriend(headers, params) {
        return await request({
            url: 'http://' + window.location.hostname+':80/p1/web/manageAddFriend',
            headers: headers,
            method: 'post',
            responseType: 'json',
            data: params,
        });
    },
    async addGroup(headers, params) {
        return await request({
            url: 'http://' + window.location.hostname+':80/p1/web/joinGroup',
            headers: headers,
            method: 'post',
            responseType: 'json',
            data: params,
        });
    },
}