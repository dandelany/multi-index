"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _ = require("lodash");

var MultiIndexList = (function () {
    function MultiIndexList(list) {
        _classCallCheck(this, MultiIndexList);

        this.list = list || [];
        this.maps = {};
        this.listIndexMaps = {};
    }

    _prototypeProperties(MultiIndexList, null, {
        getList: {
            value: function getList() {
                return this.list.slice();
            },
            writable: true,
            configurable: true
        },
        indexBy: {
            value: function indexBy() {
                for (var _len = arguments.length, indexKeys = Array(_len), _key = 0; _key < _len; _key++) {
                    indexKeys[_key] = arguments[_key];
                }

                this.indexKeys = indexKeys;
                this.reindex();
                return this;
            },
            writable: true,
            configurable: true
        },
        groupBy: {
            value: function groupBy() {
                for (var _len = arguments.length, groupKeys = Array(_len), _key = 0; _key < _len; _key++) {
                    groupKeys[_key] = arguments[_key];
                }

                this.groupKeys = groupKeys; // same as indexKeys, but expects multiple in list and returns array for each key
                this.regroup();
                return this;
            },
            writable: true,
            configurable: true
        },
        reindex: {
            value: function reindex() {
                var _this = this;

                _.each(this.indexKeys, function (indexKey) {
                    _this.maps[indexKey] = _.indexBy(_this.list, indexKey);
                    _this.listIndexMaps[indexKey] = _.object(_.map(_this.list, function (item, i) {
                        return [item[indexKey], i];
                    }));
                });
                //console.log(this.listIndexMaps);
                return this;
            },
            writable: true,
            configurable: true
        },
        regroup: {
            value: function regroup() {
                var _this = this;

                _.each(this.groupKeys, function (groupKey) {
                    _this.maps[groupKey] = _.groupBy(_this.list, groupKey);

                    var listIndexMap = {};
                    _.each(_this.list, function (item, i) {
                        var indices = listIndexMap[item[groupKey]] || [];
                        listIndexMap[item[groupKey]] = indices.concat([i]);
                    });
                    _this.listIndexMaps[groupKey] = listIndexMap;
                });
                //console.log(this.listIndexMaps);
                return this;
            },
            writable: true,
            configurable: true
        },
        refresh: {
            value: function refresh() {
                this.reindex().regroup();
            },
            writable: true,
            configurable: true
        },
        by: {
            value: function by(key) {
                var _this = this;

                if (!(key in this.maps)) throw key + "not a valid index or group, use indexBy or groupBy first";
                return {
                    get: function (keyValue) {
                        return _this.maps[key][keyValue];
                    },
                    update: function (keyValue, value) {
                        return _this.updateBy(key, keyValue, value);
                    },
                    remove: function (keyValue) {
                        return _this.removeBy(key, keyValue);
                    },
                    listIndex: function (keyValue) {
                        return _this.listIndexBy(key)[keyValue];
                    }
                };
            },
            writable: true,
            configurable: true
        },
        listIndexBy: {
            value: function listIndexBy(key) {
                // get the index of an item in the original list ie. list[listIndexBy('id')[myId]] == by('id')[myId]
                if (!(key in this.listIndexMaps)) throw key + "not a valid index or group, use indexBy or groupBy first";
                return this.listIndexMaps[key];
            },
            writable: true,
            configurable: true
        },
        updateBy: {
            value: function updateBy(key, keyValue, value) {
                // todo handle groups, this only works for indices
                this.list.splice(this.listIndexBy(key)[keyValue], 1, value);
                this.refresh();
            },
            writable: true,
            configurable: true
        },
        removeBy: {
            value: function removeBy(key, keyValue) {
                // todo handle groups, this only works for indices
                this.list.splice(this.listIndexBy(key)[keyValue], 1);
                this.refresh();
            },
            writable: true,
            configurable: true
        },
        setList: {
            value: function setList(list) {
                this.list = list;
                this.refresh();
            },
            writable: true,
            configurable: true
        }
    });

    return MultiIndexList;
})();

/*
 *
 * the idea:
 *
 *
 *
 * */
//var edgesList = [
//    {
//        id: 'edge1',
//        source: 'node1',
//        target: 'node2'
//    },
//    {
//        id: 'edge2',
//        source: 'node2',
//        target: 'node4'
//    },
//    {
//        id: 'edge3',
//        source: 'node3',
//        target: 'node1'
//    },
//    {
//        id: 'edge4',
//        source: 'node3',
//        target: 'node4'
//    }
//];
//
//var edges = new MultiIndexList(edgesList)
//    .indexBy('id')
//    .groupBy('source', 'target');
//
//var edge1 = edges.by('id').get('edge1'), // {id: 'edge1', ...}
//    edgesBySource = edges.by('source'),
//    withSource3 = edgesBySource.get('node3'); // [{id: 'edge3', ...}, {id: 'edge4', ...}]
//
//var edge5 = {id: 'edge5', source: 'node4', target: 'node1'};
//edges.setList(edges.list().push(edge5)); // it's either this or add array prototype methods to MultiIndexList
//
//edges.by('id').get('edge1');
//edges.by('id').update('edge1', {id: 'edge1', source: 'node1', target: 'node4'});
//edges.by('id').remove('edge4');

module.exports = MultiIndexList;
//# sourceMappingURL=multi-index.js.map