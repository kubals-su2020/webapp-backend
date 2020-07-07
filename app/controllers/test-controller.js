var StatsD = require('node-statsd'),
client = new StatsD();

/**
 * test node server and sets the response.
 *
 * @param request
 * @param response
 */
exports.test = (request, response) => {
    const timer = new Date();
    // Increment counter by one.
    // console.log(sdc)
    client.increment('test.counter');
    client.timing('test.timer', timer);
    const result = (user) => {
        response.status(200);
        response.json("Test Ok!");
    // Calculates time diff of time between the variable and when the function was called
    
    };
    result();
};