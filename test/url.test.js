const expect = require('chai').expect;
const Url = require('../models/url');

describe('Url', () => {
  it('should be invalid if longUrl is empty', (done) => {
    const u = new Url();

    u.validate((err) => {
      expect(err.errors.longUrl).to.exist;
      done();
    });
  });

  it('should be invalid if shortUrl is empty', (done) => {
    const u = new Url();

    u.validate((err) => {
      expect(err.errors.shortUrl).to.exist;
      done();
    });
  });
});
