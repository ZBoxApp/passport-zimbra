/**
 * Created by enahum on 10/26/15.
 */
/**
 * `BadRequestError` error.
 *
 * @api public
 */
function BadRequestError(message) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'BadRequestError';
    this.message = message || null;
};

/**
 * Inherit from `Error`.
 */
BadRequestError.prototype.__proto__ = Error.prototype;


/**
 * Expose `BadRequestError`.
 **/

module.exports = BadRequestError;