let sensitiveEmail = "unknown";
let sensitiveDeviceId = "unknown";
let sensitiveIp = "unknown";
let sensitive_http_method = "unknown";
let sensitive_request_id = "unknown";

/**
 * @typedef {Object} UserData
 * @property {string} email - The current user's email.
 * @property {string} device_id - The current user's device id.
 * @property {string} ip - The current user's ip address.
 */

type UserData = {
    email: string;
    device_id: string;
    ip: string;
};

/**
 * Setter function to hold the current user's email and device id just for logger usages.
 * @param {string} email
 * @param {string} device_id
 * @param {string} ip
 * @returns {void}
 */
let setSensitiveEmail = (email:string, device_id:string, ip:string):void => {
    sensitiveEmail = email;
    sensitiveDeviceId = device_id;
    sensitiveIp = ip;
};

/**
 * Getter function to fetch current user's session email and device id just for logger usages.
 * @returns {UserData}
 * @example
 * getSensitiveEmail(); // Returns { email: 'test@user.com', device_id: '7bda837f-7305-16bc-e0c1-8ce740151233', ip: '110.12.69.69' }
 */
let getSensitiveEmail = ():UserData => {
    return { email: sensitiveEmail, device_id: sensitiveDeviceId, ip: sensitiveIp };
};

/**
 * Setter function to hold the incoming HTTP method.
 * @param {string} http_method
 * @param {string} request_id
 */
let setHttpMethod = (http_method:string, request_id:string):void => {
    sensitive_http_method = http_method;
    sensitive_request_id = request_id;
};

/**
 * @typedef {Object} RequestedData
 * @property {string} http_method - Incoming HTTP method type.
 * @property {string} request_id - Unique id genereted for the incoming request.
 */
/**
 * Getter function to fetch incoming HTTP method and unique request id.
 * @returns {RequestedData}
 * @example
 * getSensitiveEmail(); // Returns { http_method: 'GET', request_id: '7bda837f-7305-16bc-e0c1-8ce740151233'}
 */
type RequestedData = {
    http_method: string;
    request_id: string;
};

let getHttpMethod = ():RequestedData => {
    return { http_method: sensitive_http_method, request_id: sensitive_request_id };
};

export { getSensitiveEmail, setSensitiveEmail, setHttpMethod, getHttpMethod };
