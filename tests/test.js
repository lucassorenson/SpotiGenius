const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert
const server = require('../server.js')
chai.use(chaiHttp)

test('Server Test', function(done) {
    chai.request(server)
    .get('/spotify-auth')
    .redirects(0)
    .end(function(err, res) {
        assert.equal(res.status, 302);
        assert.isTrue(res.redirect)
        done()
    })
})