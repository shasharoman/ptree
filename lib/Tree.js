const _ = require('lodash');
const treeify = require('treeify');

const Node = require('./Node');

module.exports = class Tree {
    constructor() {
        this.root = new Node();
    }

    static names(path) {
        if (!path) {
            return [];
        }

        return _.filter(path.split('/'), item => item !== '');
    }

    find(path, root = this.root, last = true) {
        if (!path) {
            return last ? null : [];
        }

        let match = (name, node) => node.name === name;
        let names = Tree.names(path);
        let nodes = [root];

        while (names.length > 0) {
            let name = names.shift();
            let found = _.find(_.last(nodes).children, item => match(name, item));
            nodes.push(found);

            if (_.isEmpty(found)) {
                break;
            }
        }

        let list = _.isEmpty(_.last(nodes)) ? [] : nodes;
        return last ? (_.last(list) || null) : list;
    }

    path(path, root = this.root) {
        return this.find(path, root, false);
    }

    paths(root = this.root) {
        let ends = [];
        let queue = [root];

        while (queue.length > 0) {
            let node = queue.pop();
            node.isEnd() && ends.push(node);

            _.each(node.children, item => {
                queue.push(item);
            });
        }

        return _.map(ends, item => {
            let chain = [item];
            while (chain[0].parent) {
                if (chain[0] === root) {
                    break;
                }

                chain.unshift(chain[0].parent);
            }

            return _.map(chain, 'name').join('/').replace(/\/+/g, '/');
        });
    }

    findOrMake(path, root = this.root) {
        if (this.exists(path, root)) {
            return this.find(path, root);
        }

        return this.make(path, root);
    }

    make(path, root = this.root) {
        if (this.exists(path, root)) {
            throw new Error(`path:${path} already existsed`);
        }

        let names = Tree.names(path);
        let parent = _.slice(names, 0, names.length - 1).join('/') || '/';

        if (!this.exists(parent, root)) {
            this.make(parent, root);
        }

        let node = new Node(_.last(names));
        this.find(parent, root).append(node);
        return node;
    }

    exists(path, root = this.root) {
        return !_.isEmpty(this.find(path, root));
    }

    mount(parent, path = '/') {
        let node = parent.findOrMake(path);
        node.append(this.root);
        this.root = new Node();
        return parent;
    }

    toString() {
        return '/\n' + treeify.asTree(_toObject(this.root)['/']);

        function _toObject(node) {
            let tmp = {};

            if (_.isEmpty(node.children)) {
                tmp[node.toString()] = null;
                return tmp;
            }

            tmp[node.toString()] = {};
            _.each(node.children, item => {
                tmp[node.toString()] = _.assign(tmp[node.toString()], _toObject(item));
            });

            return tmp;
        }
    }
};