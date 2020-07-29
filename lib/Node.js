const _ = require('lodash');

module.exports = class Node {
    constructor(name = '/') {
        this.name = name;

        this.parent = null;
        this.children = [];
    }

    append(node) {
        if (!node || node === this) {
            return;
        }
        if (node.isRoot()) {
            return this.take(node);
        }

        if (this.includes(node)) {
            throw new Error('node exists in children');
        }

        if (node.parent) {
            _.pull(node.parent.children, node);
        }
        this.children.push(node);
        node.parent = this;
    }

    take(node) {
        if (!node || node === this) {
            return;
        }

        if (!node.isRoot()) {
            throw new Error('can only take root node');
        }
        if (_.some(node.children, item => this.includes(item))) {
            throw new Error('children conflict');
        }

        _.each(_.omit(node, [
            'name',
            'parent',
            'children'
        ]), (value, key) => {
            this[key] = this.merge(this[key], value, key);
        });

        while (!_.isEmpty(node.children)) {
            this.append(node.children.shift());
        }
    }

    merge(selfVal, val, key) {
        if (_.isUndefined(selfVal)) {
            return val;
        }
        if (_.isArray(selfVal)) {
            return selfVal.concat(val);
        }
        if (_.isPlainObject(selfVal) && _.isPlainObject(val)) {
            return Object.assign(selfVal, _.mapValues(val, (value, key) => this.merge(selfVal[key], value, key)));
        }

        throw new Error(`attr:${key} conflict, don't known how to merge`);
    }

    includes(node) {
        return !_.isEmpty(_.find(this.children, item => item.equal(node)));
    }

    equal(node) {
        return this === node || this.name === node.name;
    }

    isRoot() {
        return !this.parent && this.name === '/';
    }

    isEnd() {
        return this.children.length === 0;
    }

    toString() {
        let suffix = !this.isRoot() && this.children.length ? '/' : '';

        return `${this.name}${suffix}`;
    }
};