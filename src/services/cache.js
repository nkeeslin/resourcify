'use strict';

function ResourcifyCache() {

  function Cache (options) {
    this.$cache = {};
    this.$options = options;
    this.$lists = {};
  }

  Cache.prototype.add = function (item) {
    // If cache contains item, update it
    // If cache doesn't contain item, add it
    // and reset query
    var key = this.getKey(item);
    var cache = this.$cache;
    for (var i = 0; i < key.length - 1; i++) {
      if (!cache[key[i]]) cache[key[i]] = {};
      cache = cache[key[i]];
    }

    if (!cache[key[key.length - 1]]) {
      angular.forEach(this.$lists, function (val) {
        val.invalidated = true;
      });
      return cache[key[key.length - 1]] = item;
    } else {
      return angular.extend(cache[key[key.length - 1]], item);
    }
  };

  Cache.prototype.getKey = function (obj) {
    var key = [];
    var keyConfig = angular.isArray(this.$options.key) ? this.$options.key : [this.$options.key];
    keyConfig.forEach(function (keyPiece) {
      key.push(obj[keyPiece]);
    });
    return key;
  };

  Cache.prototype.remove = function (key) {
    if (!angular.isArray(key)) {
      key = [key];
    }
    var cache = this.$cache;
    for (var i = 0; i < key.length - 1; i++) {
      cache = cache[key[i]];
    }
    delete cache[key[key.length - 1]];
  };

  Cache.prototype.clear = function () {
    this.$cache = {};
  };

  Cache.prototype.get = function (key) {
    if (!angular.isArray(key)) {
      key = [key];
    }
    var cache = this.$cache;
    for (var i = 0; i < key.length - 1; i++) {
      cache = cache[key[i]];
    }
    return cache[key[key.length - 1]];
  };

  Cache.prototype.getList = function (key) {
    return this.$lists[key] ? this.$lists[key].list : null;
  };

  Cache.prototype.addList = function (key, list) {
    if (!this.$lists[key]) {
      this.$lists[key] = {
        list: list
      };
    } else {
      // TODO Needs to merge values
      Array.prototype.push.apply(this.$lists[key].list, list);
    }
    return this.$lists[key].list;
  };

  return {
    createCache: function (options) {
      return new Cache(options);
    }
  };
}

angular.module('resourcify').factory('ResourcifyCache', ResourcifyCache);
