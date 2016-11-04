var _ = require('underscore');

/* Man-handle the results ex. ['a', '1', 'b', '2', 'c', '3'] into something more JSON-like
*    [  { username: 'foxtrot.dobbs', score: '22.00' },
*       { username: 'whiskey.dobbs', score: '7.67' },
*       { username: 'tango.dobbs', score: '0.33' } ]
*/
var transformZsetResults = function(res, convertScoreToFloat) {
    if (res === null) {
        throw new Error('Cannot transform null results');
    }

    var lists = _.groupBy(res, function(a,b) {
        return Math.floor(b / 2);
    });

    // I don't really feel like doing a complicated bool parse for this test proj
    convertScoreToFloat = convertScoreToFloat === null ? false : convertScoreToFloat;

    var leaderboard = [];
    _.map(lists, function(row) {
        var score = convertScoreToFloat ? parseFloat(row[1]) : parseInt(row[1]);
        leaderboard.push({username: row[0], score: score});
    });

    return leaderboard;
};

module.exports = {
    transformZsetResults: transformZsetResults
};
