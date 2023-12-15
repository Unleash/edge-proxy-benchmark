import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";


export let options = {
    stages: [
        { duration: '10s', target: 10 },  // Ramp-up to 10 users
        { duration: '1m', target: 10 },  // Stay at 10 users
        { duration: '10s', target: 50 },  // Ramp-up to 50 users
        { duration: '1m', target: 50 },  // Stay at 50 users
        { duration: '20s', target: 200 }, // Ramp-up to 200 users
        { duration: '1m', target: 200 }, // Stay at 200 users
        { duration: '20s', target: 0 },   // Ramp-down to 0 users
    ],
};

const EDGE_BASE_URL = 'http://unleash-edge:3063';
const PROXY_BASE_URL = 'http://unleash-proxy:3000';

export default function () {
    let responses = http.batch([
        ['GET', `${EDGE_BASE_URL}/api/frontend`, null, { tags: { name: 'EdgeFrontend' }, group: 'Edge', headers: { 'Authorization': '*:development.531d0f514a4c480d6508512c2bc69ce8b595e1cf3a00d18978edac6a' } }],
        ['GET', `${PROXY_BASE_URL}/proxy`, null, { tags: { name: 'ProxyClientFeatures' }, group: 'Proxy', headers: {'Authorization': 'proxybenchmark' } }],
    ]);

    check(responses[0], { 'Edge Client Features status was 200': (r) => r.status === 200 });
    check(responses[1], { 'Proxy Client Features status was 200': (r) => r.status === 200 });
}

export function handleSummary(data) {
    return {
        "/k6data/summary.html": htmlReport(data),
    }
}
