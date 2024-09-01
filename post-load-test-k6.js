import http from 'k6/http';
import { check, fail } from 'k6';
import { sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
    scenarios: {
        main: {
            executor: 'constant-arrival-rate',
            duration: __ENV.duration,
            rate: __ENV.tps,
            timeUnit: '1s',
            preAllocatedVUs: __ENV.tps * 15,
            maxVUs: __ENV.tps * 30
        }
    }
}

export default function(){
    const url = "https://localhost:7122/api/v1/sample"

    const params = {
        headers: {
            'Content-Type': 'application/json', // Certifique-se de definir o Content-Type correto
        },
    };

    const payload = JSON.stringify({
        "description": "test"
    });

    var response = http.post(url, payload, params);

    if (!check(response, {
        "[POST] is status created.": (r) => r.status === 200
    })){
        fail(response.status)
    }

    sleep(1)
}

export function handleSummary(data) {
    return {
      "post-result.html": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
}