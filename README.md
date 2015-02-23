# multi-index
#### by dandelany

### Introduction

The motivation behind this tiny module is simple: Often I have a list of objects which I index and/or group by several
keys into maps for quick lookups, for example:

```javascript
var usersList = [
    { id:'1', uid: 'A', name: 'Dan', role: 'sales', floor: 2 },
    { id:'2', uid: 'B', name: 'Sara', role: 'sales', floor: 3 },
    { id:'3', uid: 'C', name: 'Pat', role: 'manager', floor: 3 },
];

var usersById = _.indexBy(usersList, 'id');
var usersByRole = _.groupBy(usersList, 'role');

usersById['1'].name.should.be.equal('dan')
usersByRole['developer'][0].name.should.be.equal('dan')
```

This works, but becomes tedious due to the need to refresh the index maps whenever the list changes. Enter MultiIndexList:
a minimal data structure with a list at its core, but which provides index and group maps for quick lookups, updates
and removals in the list. With MultiIndexList you can do:

```javascript
var users = new MultiIndexList(userList)
    .indexBy('id', 'uid')
    .groupBy('role', 'floor');

var pat = users.by('id').get('3');
var sara = users.by('uid').get('B');
var sales = users.by('role').get('sales');
var floor3 = users.by('floor').get(3);

pat.name.should.be.equal('Pat');
sara.name.should.be.equal('Sara');
sales.length.should.be.equal(2);
sales[0].name.should.be.equal('Dan');
floor3.length.should.be.equal(2);
floor3[0].should.be.exactly(usersList[1]);
```