
var should = require('should');
var MultiIndexList = require('../build/multi-index');
var _ = require('lodash');

var peopleList = [
    {
        firstName: 'Oscar',
        lastName: 'Grouch',
        id: 'grouchy',
        badgeId: '222-202',
        role: 'manager'
    },
    {
        firstName: 'Mr. Snuffle',
        lastName: 'Upagus',
        id: 'snuffles',
        badgeId: '333-737',
        role: 'sales'
    },
    {
        firstName: 'Big',
        lastName: 'Bird',
        id: 'bird',
        badgeId: '111-447',
        role: 'developer'
    },
    {
        firstName: 'Elmo',
        lastName: 'Monster',
        id: 'elmo',
        badgeId: '222-193',
        role: 'sales'
    },
    {
        firstName: 'Cookie',
        lastName: 'Monster',
        id: 'cookie',
        badgeId: '333-001',
        role: 'developer'
    }
];

describe('MultiIndexList', function() {
    
    describe('creation', function() {
        
        it('can be created with an array', function() {
            var people = new MultiIndexList(peopleList);

            people.should.be.an.instanceOf(MultiIndexList);
            people.getList().should.be.an.instanceOf(Array);
        });
        
        it('can be created empty and provided an array later', function() {
            var people = new MultiIndexList();
            people.setList(peopleList);
            var people2 = new MultiIndexList(peopleList);

            people.getList().should.be.eql(people2.getList());
        });
        
    });

    describe('reading', function() {
        
        var people;
        beforeEach(function() {
            people = new MultiIndexList(peopleList);
        });

        it('will return a copy of the current list', function() {
            var listCopy = people.getList();

            _.each(listCopy, function(person, i) {
                person.should.be.exactly(peopleList[i]);
            });
        });

        it('can index the list by unique keys', function() {
            people.indexBy('id', 'badgeId');
            var elmo = people.by('id').get('elmo');
            var cookie = people.by('badgeId').get('333-001');

            elmo.should.have.property('id', 'elmo');
            elmo.should.have.property('firstName', 'Elmo');
            cookie.should.have.property('id', 'cookie');
            cookie.should.have.property('badgeId', '333-001');
            cookie.should.have.property('firstName', 'Cookie');
            cookie.should.be.exactly(people.by('id').get('cookie'));
        });

        it('can group the list by non-unique keys', function() {
            people.groupBy('lastName', 'role');
            var sales = people.by('role').get('sales');

            sales.length.should.be.equal(2);
            sales[0].should.have.property('id', 'snuffles');
            sales[1].should.have.property('id', 'elmo');
        });

        it('can index & group at the same time', function() {
            people
                .indexBy('id', 'badgeId')
                .groupBy('lastName', 'role');

            var peopleById = people.by('id'),
                peopleByBadgeId = people.by('badgeId'),
                peopleByLastName = people.by('lastName'),
                peopleByRole = people.by('role');

            peopleById.get('grouchy').should.be.exactly(peopleByRole.get('manager')[0]);
            peopleByLastName.get('Monster')[0].should.be.exactly(peopleByBadgeId.get('222-193'));
        });
        
        it('will return the (list) index of a uniquely-indexed item', function() {
            people.indexBy('id', 'badgeId');

            people.listIndexBy('id')['grouchy'].should.be.equal(0);
            people.listIndexBy('id')['cookie'].should.be.equal(4);
        });

        it('will return the (list) indices of non-uniquely indexed groups of items', function() {
            people.groupBy('lastName', 'role');
            var devIndices = people.listIndexBy('role')['developer'];
            var curList = people.getList();
            var developers = _.map(devIndices, function(i) {
                return curList[i];
            });

            devIndices.length.should.be.equal(2);
            _.each(developers, function(dev) {
                dev.should.have.property('role', 'developer');
            });
            developers[0].should.have.property('id', 'bird');
            developers[1].should.have.property('id', 'cookie');
        })
        
    });


    describe('writing', function() {

        var people;
        beforeEach(function() {
            people = new MultiIndexList(peopleList)
                .indexBy('id', 'badgeId')
                .groupBy('lastName', 'role');
        });

        it('can update & reindex the entire list with setList', function() {
            var origList = people.getList();
            people.setList(origList.slice().reverse());
            var newList = people.getList();

            newList.length.should.be.equal(origList.length).and.be.equal(peopleList.length);
            newList[0].should.be.exactly(origList[origList.length - 1]);
            origList[0].should.be.exactly(newList[newList.length - 1]);
        });

        it('can update a uniquely-indexed item in the list by its index', function() {
            var origList = people.getList(),
                bird = people.by('id').get('bird'),
                newBird = _.extend(_.clone(bird), {role: 'manager', id: 'birdy'});

            people.by('id').update('bird', newBird);
            var newList = people.getList();

            newList.length.should.be.equal(origList.length);
            people.by('id').get('birdy').should.be.exactly(newBird);
        });
        
        
    });
});