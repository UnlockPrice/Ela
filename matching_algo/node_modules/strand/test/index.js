var assert  = require('assert'),
    strand = require('../lib/index')

describe('editDistance', function () {
    it('between `intention` and `execution` is 5', function (done) {
      var x = 'execution'
      var y = 'intention'

      assert.equal(5, strand.editDistance(x,y))

      done()
    })

    it('between `kitten` and `sitten` is 2', function (done) {
      var x = 'kitten'
      var y = 'sitten'

      assert.equal(1, strand.editDistance(x,y))

      done()
    })

    it('between `kitten` and `sitting` is 3', function (done) {
      var x = 'kitten'
      var y = 'sitting'

      assert.equal(3, strand.editDistance(x,y))

      done()
    })
})

describe('longest common subsequence (lcs)', function () {
    it('of `execution` and `intention` is `etion`', function (done) {
        var x = 'execution'
        var y = 'intention'

        var match = strand.subSequence(x,y)

        assert.equal('etion', match.sequence)
        assert.equal(5, match.len)

        done()
    })
    it('of `agcat` and `gac` is `ga`', function (done) {
        var x = 'agcat'
        var y = 'gac'

        var match = strand.subSequence(x,y)

        assert('ga' === match.sequence)
        assert.equal(2, match.len)

        done()
    })

})