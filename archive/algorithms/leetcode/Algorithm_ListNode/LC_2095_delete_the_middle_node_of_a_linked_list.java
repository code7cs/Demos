package Algorithm_ListNode;

public class LC_2095_delete_the_middle_node_of_a_linked_list {
    // https://leetcode.cn/problems/delete-the-middle-node-of-a-linked-list/solutions/1147061/tu-jie-jing-dian-si-lu-zhi-kuai-man-zhi-6o21w

    public ListNode deleteMiddle(ListNode head) {
        ListNode header = new ListNode(0, head);
        ListNode p1 = header;
        ListNode p2 = header.next;

        while (p2 != null && p2.next != null) {
            p1 = p1.next;
            p2 = p2.next.next;
        }

        p1.next = p1.next.next;
        return header.next;
    }
}
