var KP = require('../src/kopy-js-client');
var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);


describe('KopyService', function() {

  describe('#login()', function () {

    it('should return error message when credentials are ok', function() {
      var promise = KP().signin({username: "test", password: "test"});
      return expect(promise).to.eventually.have.deep.property('data.user.token');
    });
    
    it('should return error message when credentials are wrong', function () {
      var promise = KP().signin({username: "test", password: "wrongPassword"});
      return expect(promise).to.eventually.be.rejected;
    });

  });
/*
  describe('#item()', function () {

    it('should save a new item', function () {
      var promise = KP().user(1).items({value: 'My first item'}).save();
      return expect(promise).to.eventually.equal("foo");
    });

    it('should get a specific item', function () {
      var promise = KP().user(1).items(1).get();
      return expect(promise).to.eventually.equal("foo");
    });

  });
*/
});


//KP().user(1).items({value: 'My first item'}).save().then(f).catch(f); //KO
//KP().user(1).items({a: 130774}).get().then(f).catch(f);
//KP().user(1).items.save(1, {id: 130782, value: 'reda ATE houmouss', used: true , faved: true});
//KP().user(1).items({item}).save()
//KP().items.delete({userId: 1, id: 130774}).then(f).catch(f);
//Error case
//KP().signup({username: 'login', password: 'password', email: 'login123@gmail.com'}).then(f).catch(f);
