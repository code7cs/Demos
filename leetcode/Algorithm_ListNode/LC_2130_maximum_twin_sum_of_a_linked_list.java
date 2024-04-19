package Algorithm_ListNode;

public class LC_2130_maximum_twin_sum_of_a_linked_list {
    public int pairSum(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        // reverse
        ListNode pre = null;
        while (slow != null) {
            ListNode temp = slow.next;
            slow.next = pre;
            pre = slow;
            slow = temp;
        }

        int res = 0;
        ListNode x = head;
        ListNode y = pre;

        while (y != null) {
            res = Math.max(res, x.val + y.val);
            x = x.next;
            y = y.next;
        }

        return res;
    }
}
