'use strict'

class ListQueue {
    constructor() {
        this.list = new List();
        this.size = 0;
    }
    add(value) {
        this.list.append(value);
        this.size = this.list.size;
    };
    remove() {
        if (this.list.size === 0)
            return "EMPTY";
        else {
            var dataToReturn = this.list.removeFirst();
            this.size = this.list.size;
            return dataToReturn;
        }
    };
    peek() {
        if (this.list.size === 0)
            return "EMPTY";
        else
            return this.list.get(0);
    };
    toString() {
        return this.list.toString();
    }
    getIterator() {
        return new ListQueueIterator(this.list);
    }
}

class ListQueueIterator {
    constructor(list) {
        this.currentNode = list.tail;
        this.hasNext = function() {
            return this.currentNode != null;
        }
        this.next = function() {
            var data = this.currentNode.data;
            this.currentNode = this.currentNode.previous;
            return data;
        }
    }
}