var userRepo = require('./../server/data/user');

describe('User Repo', function() {
    beforeEach('Flush Redis', function(done) {
        done();
    })

    describe('getUser returns a user from Redis', function() {
        it('User is not null', function(done) {
            var user = userRepo.getUser();
            console.log('***');
            console.log(user);
            user.done(null, function(err) {
                assert.equal(err, 'user is null');
            });
            // done();
        });
    });
});
