'use strict'

class ListNode {
    constructor(data, previous, next) {
        this.data = data;
        this.previous = previous;
        this.next = next;
    }
}
class List {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    append(value) {
        if (this.size === 0) {
            this.head = new ListNode(value, null, null);
            this.tail = this.head;
        }
        else {
            this.tail.next = new ListNode(value, this.tail, null);
            this.tail = this.tail.next;
        }
        this.size++;
    }
    prepend(value) {
        if (this.size === 0) {
            this.head = new ListNode(value, null, null);
            this.tail = this.head;
        }
        else {
            this.head.previous = new ListNode(value, null, this.head);
            this.head = this.head.previous;
        }
        this.size++;
    }
    get(index) {
        if (index > (this.size - 1))
            return null;
        else {
            var counter = 0;
            var traveller = this.head;
            while (counter < index) {
                traveller = traveller.next;
                counter++;
            }
            return traveller.data;
        }
    }
    set(index, value) {
        if (index > (this.size - 1))
            return;
        else {
            var counter = 0;
            var traveller = this.head;
            while (counter < index) {
                traveller = traveller.next;
                counter++;
            }
            traveller.data = value;
        }
    }
    removeFirst() {
        if (this.size === 0) {
            return null;
        }
        else {
            var dataToReturn = this.head.data;
            if (this.size === 1) {
                this.head = null;
                this.tail = null;
            }
            else {
                this.head = this.head.next;
                this.head.previous = null;
            }
            this.size--;
            return dataToReturn;
        }
    }
    removeLast() {
        if (this.size === 0) {
            return null;
        }
        else {
            var dataToReturn = this.tail.data;
            if (this.size === 1) {
                this.head = null;
                this.tail = null;
            }
            else {
                this.tail = this.tail.previous;
                this.tail.next = null;
            }
            this.size--;
            return dataToReturn;
        }
    }
    size() {
        return this.size;
    }
    toString() {
        var listText = "";
        var traveller = this.head;
        while (traveller !== null) {
            listText += traveller.data + "->";
            traveller = traveller.next;
        }
        listText += "null";
        return listText;
    }
}