var _ = require('lodash');

class MultiIndexList {
    constructor(list) {
        this.list = list || [];
        this.maps = {};
        this.listIndexMaps = {};
    }
    getList() {
        return this.list.slice();
    }

    indexBy(...indexKeys) {
        this.indexKeys = indexKeys;
        this.reindex();
        return this;
    }
    groupBy(...groupKeys) {
        this.groupKeys = groupKeys; // same as indexKeys, but expects multiple in list and returns array for each key
        this.regroup();
        return this;
    }

    reindex() {
        _.each(this.indexKeys, indexKey => {
            this.maps[indexKey] = _.indexBy(this.list, indexKey);
            this.listIndexMaps[indexKey] = _.object(_.map(this.list, (item, i) => [item[indexKey], i]));
        });
        //console.log(this.listIndexMaps);
        return this;
    }
    regroup() {
        _.each(this.groupKeys, groupKey => {
            this.maps[groupKey] = _.groupBy(this.list, groupKey);

            var listIndexMap = {};
            _.each(this.list, (item, i) => {
                var indices = listIndexMap[item[groupKey]] || [];
                listIndexMap[item[groupKey]] = indices.concat([i]);
            });
            this.listIndexMaps[groupKey] = listIndexMap;
        });
        //console.log(this.listIndexMaps);
        return this;
    }
    refresh() { this.reindex().regroup(); }

    by(key) {
        if(!(key in this.maps)) throw key + "not a valid index or group, use indexBy or groupBy first";
        return {
            get: keyValue => this.maps[key][keyValue],
            update: (keyValue, value) => this.updateBy(key, keyValue, value),
            remove: keyValue => this.removeBy(key, keyValue),
            listIndex: keyValue => this.listIndexBy(key)[keyValue]
        };
    }
    listIndexBy(key) {
        // get the index of an item in the original list ie. list[listIndexBy('id')[myId]] == by('id')[myId]
        if(!(key in this.listIndexMaps)) throw key + "not a valid index or group, use indexBy or groupBy first";
        return this.listIndexMaps[key];
    }
    updateBy(key, keyValue, value) {
        // todo handle groups, this only works for indices
        this.list.splice(this.listIndexBy(key)[keyValue], 1, value);
        this.refresh();
    }
    removeBy(key, keyValue) {
        // todo handle groups, this only works for indices
        this.list.splice(this.listIndexBy(key)[keyValue], 1);
        this.refresh();
    }

    setList(list) {
        this.list = list;
        this.refresh();
    }
}

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