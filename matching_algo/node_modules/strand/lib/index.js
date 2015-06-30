/**
 * Determines the longest common subsequence of characters
 * in two strings (divide & conquer approach)
 * 
 * @param  {String} x   first string
 * @param  {String} y   second string
 * @return {String}     string representing the match
 */
exports.subSequence = function (x, y) {
  var ret = {
    len: 0,
    sequence: ''
  }

  var xlen = x.length
    , ylen = y.length

  if (!xlen || !ylen)
    return ret

  // initialize our match matrix
  var sequences = []
  sequences[0] = [ { len: 0, val: null, prev: null } ]

  // initialize first row full of zeros
  for (var i = 1; i <= xlen; i++) {
    sequences[0].push({ len: 0, val: null, prev: null })
  }

  // initialize first column full of zeros
  for (var j = 1; j <= ylen; j++) {
    sequences[j] = [ { len: 0, val: null, prev: null } ]
  }

  for (var i = 1; i <= ylen; i++) {
    for (var j = 1; j <= xlen; j++) {
      if (y[i - 1] === x[j - 1]) {
        // character match
        var val = x[j - 1]
        var prevCell = sequences[i - 1][j - 1]
        var matchLen = prevCell.len + 1

        sequences[i][j] =  { len: matchLen, val: val, prev: prevCell }
      } else {
        // character mismatch
        // max sequence is longest of the cell above and the 
        // cell to the left
        var leftCell = sequences[i][j - 1]
        var upCell = sequences[i - 1][j]

        var greaterCell = leftCell.len > upCell.len ? leftCell : upCell

        sequences[i][j] = { len: greaterCell.len, val: null, prev: greaterCell }
      }
    }
  }

  // reconstruct the subsequence by tracing
  // backwards through the sequence matrix
  var currCell = sequences[ylen][xlen]

  ret.len = currCell.len

  while (currCell.prev) {
    if (currCell.val)
      ret.sequence = currCell.val + ret.sequence

    currCell = currCell.prev
  }

  return ret
}

/**
 * Determines the minimum Levenshtein (edit) distance between two strings
 * 
 * cost: 1 for deletions, insertions, or subsitutions
 *
 * @param  {String} x   first string
 * @param  {String} y   second string
 * @return {Number}     levenshtein distance
 */
exports.editDistance = function (x, y) {
  //our distance matrix
  var dist = []

  var xlen = x.length
    , ylen = y.length

  //if one word is empty, the distance is the length of the other word
  if (!xlen) return ylen
  if (!ylen) return xlen

  /*
      initialize our distance matrix (first row and column)
   */

  //generate the first column of the distance matrix
  //matrix[i][0] = i ; the cost of deleting i characters
  for (var i = 0; i <= xlen; i++) {
    dist[ i ] = [ i ]
  }

  //generate the first row of the distance matrix
  //matrix[0][j] = j ; the cost of deleting j characters
  for (var j = 0; j <= ylen; j++) {
    dist[ 0 ][ j ] = j
  }

  /*
      generate the rest of the distance matrix
      using the recurrence relation
   */ 
  
  //iterate thru string x (rows)
  for (var i = 1; i <= xlen; i++) {
    //iterate thru string y (columns)
    for (var j = 1; j <= ylen; j++) {

      var deletion = dist[i-1][j] + 1
      var insertion = dist[i][j-1] + 1

      //substitution cost is:
      // -> 0 if we have a character match in x[i-1] and y[j-1]
      // -> 1 if we don't
      var substitution = dist[i-1][j-1] + (x[i-1] === y[j-1] ? 0: 1)

      //levenshtein distance of this cell is
      //the minimum cost of the 3 operation choices
      dist[i][j] = Math.min(deletion, insertion, substitution)
    }
  }

  //levenshtein distance is last cell in the distance matrix
  return dist[xlen][ylen]
}