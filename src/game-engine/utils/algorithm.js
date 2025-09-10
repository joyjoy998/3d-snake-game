class ListNode {
  next = null;
  prev = null;

  constructor(data) {
    this.data = data;
  }

  linkTo(node) {
    this.next = node;
    node.prev = this;
  }
}

class LinkedList {
  constructor(head) {
    this.head = head;
    this.tail = head;
  }

  addNode(node) {
    this.tail.linkTo(node);
    this.tail = node;
  }
}

export { ListNode, LinkedList };
