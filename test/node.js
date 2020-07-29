const Node = require('../lib/Node');
const expect = require('chai').expect;

describe('node', () => {
    it('isRoot', () => {
        let node = new Node();
        expect(node.isRoot()).to.equal(true);
    });

    it('append', () => {
        let root = new Node();
        let a = new Node('a');
        let b = new Node('b');
        root.append(a);
        root.append(b);

        expect(root.children).to.be.an.instanceof(Array);
        expect(root.children.length).to.be.equal(2);
        expect(root.children.indexOf(a)).to.equal(0);
        expect(root.children.indexOf(b)).to.equal(1);
        expect(a.parent === root).to.equal(true);
        expect(b.parent === root).to.equal(true);
        expect(root.includes(a)).to.equal(true);
        expect(root.includes(b)).to.equal(true);
    });

    it('append, root', () => {
        let node = new Node();
        let a = new Node('a');
        let b = new Node('b');
        node.append(a);
        node.append(b);

        let root = new Node();
        root.append(node);

        expect(root.children).to.be.an.instanceof(Array);
        expect(root.children.length).to.be.equal(2);
        expect(root.children.indexOf(a)).to.equal(0);
        expect(root.children.indexOf(b)).to.equal(1);
        expect(a.parent === root).to.equal(true);
        expect(b.parent === root).to.equal(true);
        expect(root.includes(a)).to.equal(true);
        expect(root.includes(b)).to.equal(true);
    });

    it('append, ignore self', () => {
        let node = new Node();

        node.append(node);
        expect(node.children.length).to.be.equal(0);
    });

    it('append, existsed throw error', () => {
        let node = new Node();

        let a = new Node('a');
        let b = a;

        node.append(a);
        expect(() => node.append(b)).to.throw();
    });

    it('append, conflict throw error', () => {
        let foo = new Node();
        let bar = new Node();

        let a = new Node('common');
        let b = new Node('common');

        foo.append(a);
        bar.append(b);

        expect(() => foo.append(bar)).to.throw();
    });

    it('attr', () => {
        let node = new Node();
        node.attr1 = 'attr1';
        expect(node.attr1).to.equal('attr1');
    });

    it('attr, array concat', () => {
        let foo = new Node();
        let bar = new Node();

        foo.items = [1];
        bar.items = [2];

        foo.append(bar);
        expect(foo.items).to.be.deep.equal([1, 2]);
    });

    it('attr, merge plain object', () => {
        let foo = new Node();
        let bar = new Node();

        foo.o = {
            attr1: 1,
            items: [1]
        };
        bar.o = {
            attr2: 2,
            items: [2]
        };
        foo.append(bar);

        expect(foo.o).to.be.deep.equal({
            attr1: 1,
            attr2: 2,
            items: [1, 2]
        });
    });

    it('append, conflict attr throw error', () => {
        let foo = new Node();
        let bar = new Node();

        foo.attr = 1;
        bar.attr = 2;

        expect(() => foo.append(bar)).to.throw();
    });

    it('append, conflict plain-object throw error', () => {
        let foo = new Node();
        let bar = new Node();

        foo.o = {
            attr: 1
        };
        bar.o = {
            attr: 2
        };

        expect(() => foo.append(bar)).to.throw();
    });
});