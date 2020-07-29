const Tree = require('../lib/Tree');
const expect = require('chai').expect;
const treeify = require('treeify');

describe('tree', () => {
    it('find, root', () => {
        let tree = new Tree();

        expect(tree.find('/') === tree.root).to.be.equal(true);
    });

    it('make & find', () => {
        let o = {
            'a/': {
                a1: null,
                a2: null,
                a3: null
            },
            'b/': {
                b1: null,
                b2: null,
                b3: null
            }
        };
        let tree = new Tree();
        tree.make('/a/a1');
        tree.make('/a/a2');
        tree.make('/a/a3');

        tree.make('/b');

        let b = tree.find('/b');
        expect(b).to.be.not.equal(null);

        tree.make('/b1', b);
        tree.make('/b2', b);
        tree.make('/b3', b);

        expect(tree.find('/a/a1')).to.be.not.equal(null);
        expect(tree.find('/b/b1')).to.be.not.equal(null);
        expect(tree.find('/c')).to.be.equal(null);

        expect(tree.toString()).to.be.equal('/\n' + treeify.asTree(o));
    });

    it('make, duplicate path throw error', () => {
        let tree = new Tree();

        tree.make('/a');
        expect(() => tree.make('/a')).to.be.throw();
    });

    it('findOrMake', () => {
        let tree = new Tree();

        let root = tree.findOrMake('/');
        root.attr = 'root';
        let nodeA = tree.findOrMake('/a');

        expect(tree.findOrMake('/a') === nodeA).to.be.equal(true);
    });

    it('mount', () => {
        let treeA = new Tree();
        treeA.make('/a/a1');
        treeA.make('/a/a2');

        let treeB = new Tree();
        treeB.make('/b/b1');
        treeB.make('/b/b2');
        expect(treeA.find('/b/b1')).to.be.equal(null);

        treeB.mount(treeA);
        expect(treeA.find('/b/b1')).to.be.not.equal(null);
        expect(treeB.toString()).to.be.equal(new Tree().toString());

        let tree = new Tree();
        tree.make('/a/a1');
        tree.make('/a/a2');
        tree.make('/b/b1');
        tree.make('/b/b2');
        expect(treeA.toString()).to.be.equal(tree.toString());
    });

    it('mount, target is root', () => {
        let treeA = new Tree();

        let treeB = new Tree();
        treeB.make('/a/b');
        treeB.make('/a/c');
        treeB.make('/x/y/z');

        treeB = treeB.mount(treeA, '/');
        expect(treeA.toString()).to.be.equal(treeB.toString());
    });

    it('find, omit first /', () => {
        let tree = new Tree();

        tree.make('a/b/c');
        expect(tree.find('a/b')).to.be.not.equal(null);
        expect(tree.findOrMake('a/b')).to.be.not.equal(null);
    });

    it('path', () => {
        let tree = new Tree();

        expect(tree.paths()).to.be.deep.equal(['/']);
        tree.make('/a/b');

        let nodeC = tree.findOrMake('/a/b/c');
        let nodes = tree.path('/a/b/c');

        expect(tree.find('/') === nodes[0]).to.be.equal(true);
        expect(tree.find('/a') === nodes[1]).to.be.equal(true);
        expect(tree.find('/a/b') === nodes[2]).to.be.equal(true);
        expect(nodeC === nodes[3]).to.be.equal(true);
    });

    it('paths', () => {
        let tree = new Tree();

        expect(tree.paths()).to.be.deep.equal(['/']);

        tree.make('/a/b/c');
        tree.make('/a/b/d');
        expect(tree.paths()).to.be.deep.equal(['/a/b/d', '/a/b/c']);
        expect(tree.paths(tree.find('/a/b'))).to.be.deep.equal(['b/d', 'b/c']);
    });

    it('exists', () => {
        let tree = new Tree();
        tree.make('/a/b/c');

        expect(tree.exists('/a')).to.be.equal(true);
        expect(tree.exists('/a/b')).to.be.equal(true);
        expect(tree.exists('/a/b/c')).to.be.equal(true);
        expect(tree.exists('/a/c')).to.be.equal(false);
    });
});