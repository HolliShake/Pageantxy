

/**
 * Decides whether to resolve or reject a promise based on the result type.
 * @param {Result} result The result to be resolved or rejected.
 * @returns {Promise} A promise that resolves or rejects based on the result type.
 **/
const action = result => Promise[(result.SUCCESS) ? 'resolve' : 'reject'](result.data)
export default action

