require('babel/register');

var rx = require('rx');
var lwip = require('lwip');
var assert = require('chai').assert;
var expect = require('chai').expect;

var Card = require('../src/card');
var ImageHelpers = require('../src/image-helpers');

// NB: This will need to be updated if the set of card images changes.
var cardSize = {width: 250, height: 363};

// NB: We use this in place of imgur's `uploadFile` method, but we still need
// to match their API, which returns a {Promise}.
var mockUpload = function(outputFile) {
  return new Promise(function(resolve, reject) {
    resolve({
      data: { link: 'lol.not.real' }
    });
  });
};

describe('ImageHelpers', function() {
  describe('the createBoardImage method', function () {

    it("should be able to create images for the flop, turn, and river", function (done) {
      var nineClubs = new Card('9', 'Clubs');
      var fourSpades = new Card('4', 'Spades');
      var kingDiamonds = new Card('K', 'Diamonds');
      var aceHearts = new Card('A', 'Hearts');
      var sevenSpades = new Card('7', 'Spades');

      ImageHelpers.createBoardImage([nineClubs, fourSpades, kingDiamonds], mockUpload)
          .subscribe(function () {
            lwip.open('./output/flop.jpeg', function (err, img) {
              assert(img.width() === cardSize.width * 3);
              assert(img.height() === cardSize.height);
            });
          });

      ImageHelpers.createBoardImage([nineClubs, fourSpades, kingDiamonds, aceHearts], mockUpload)
          .subscribe(function () {
            lwip.open('./output/turn.jpeg', function (err, img) {
              assert(img.width() === cardSize.width * 4);
              assert(img.height() === cardSize.height);
            });
          });

      ImageHelpers.createBoardImage([nineClubs, fourSpades, kingDiamonds, aceHearts, sevenSpades], mockUpload)
          .subscribe(function () {
            lwip.open('./output/river.jpeg', function (err, img) {
              assert(img.width() === cardSize.width * 5);
              assert(img.height() === cardSize.height);
              done();
            });
          });
    });
  });

  describe('the createPrivateImage method', function () {

    it("should be able to create images for the users hand", function (done) {
      var jackClubs = new Card('J', 'Clubs');
      var twoHearts = new Card('2', 'Hearts');

      var aceDiamonds = new Card('A', 'Diamonds');
      var fiveSpades = new Card('5', 'Spades');

      ImageHelpers.createPrivateImage([jackClubs, twoHearts], mockUpload)
          .subscribe(function () {
            lwip.open('./output/yourHand.jpeg', function (err, img) {
              assert(img.width() === cardSize.width * 2);
              assert(img.height() === cardSize.height);
            });
          });

      ImageHelpers.createPrivateImage([aceDiamonds, fiveSpades], mockUpload)
          .subscribe(function () {
            lwip.open('./output/yourHand.jpeg', function (err, img) {
              assert(img.width() === cardSize.width * 2);
              assert(img.height() === cardSize.height);
              done();
            });
          });

    });


    it('throws when createPrivateImage is given array size not 2', function (done) {

      expect(function () {

        var twoHearts = new Card('2', 'Hearts');
        var aceDiamonds = new Card('A', 'Diamonds');
        var fiveSpades = new Card('5', 'Spades');

        ImageHelpers.createPrivateImage([aceDiamonds, fiveSpades, twoHearts], mockUpload)
            .subscribe(function () {
              lwip.open('./output/yourHand.jpeg', function (err, img) {
              //  assert(img.width() === 0);
            //    assert(err!==null);
              });
            });
      }).to.throw('Attempted to make private user hand image for 3 cards.');
      done();
    });

  });

});
