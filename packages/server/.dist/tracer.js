"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dd_trace_1 = require("dd-trace");
const axios_1 = require("axios");
if (process.env.NODE_ENV === 'production') {
    const mytracer = dd_trace_1.default.init({
        env: process.env['DD_ENV'],
        service: 'GraphQL',
    });
    mytracer.use('graphql');
    axios_1.default
        .get('http://169.254.169.254/latest/meta-data/local-ipv4')
        .then((resp) => {
        mytracer.setUrl(`http://${resp.data}:8126`);
    });
}
exports.default = dd_trace_1.default;
//# sourceMappingURL=tracer.js.map