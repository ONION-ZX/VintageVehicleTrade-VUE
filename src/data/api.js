window.api = api;

const APP_KEY = '66ec82ab54eb2bde854d7dba630906fa237f8ce742999a070d7497fa0e6bf1b0';
const BASE_API = 'http://mock.biaoyansu.com/api/1/';

function sign(app_key, timestamp) {
    return btoa(app_key + timestamp);
}

function api(url, params) {
    let timestamp = (new Date).getTime();
    let signature = sign(APP_KEY, timestamp);

    let opt = {
        headers: {
            'BIAO-MOCK-APP-KEY': APP_KEY,
            'BIAO-MOCK-TIMESTAMP': timestamp,
            'BIAO-MOCK-SIGNATURE': signature,
        },
    };

    url = BASE_API + url;
    return axios
        .post(url, params, opt)
        .then(r => {
            return r.data;
        });
};
