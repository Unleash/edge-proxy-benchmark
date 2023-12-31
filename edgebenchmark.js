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

export default function () {
    let r = http.get(`${EDGE_BASE_URL}/api/frontend`, { tags: { name: 'EdgeFrontend' }, group: 'Edge', headers: { 'Authorization': '*:development.fcafb6fc390a0954a226b30830f996c0d531393c831feafdafdf38e6' } });
    check(r, { 'Edge Client Features status was 200': (r) => r.status === 200 });
}

export function handleSummary(data) {
  return {
    '/k6data/edge_benchmark.html': htmlReport(data)
  }
}
