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

  clear() {
    let currentNode = this.head;
    while (currentNode) {
      const nextNode = currentNode.next;
      currentNode.next = null;
      currentNode.prev = null;
      currentNode.data = null;
      currentNode = nextNode;
    }
    this.head = null;
    this.tail = null;
  }
}

export { ListNode, LinkedList };
