/**
 * test node server and sets the response.
 *
 * @param request
 * @param response
 */
exports.test = (request, response) => {
    const result = (user) => {
        response.status(200);
        response.json("Test Ok!");
    };
    result();
};