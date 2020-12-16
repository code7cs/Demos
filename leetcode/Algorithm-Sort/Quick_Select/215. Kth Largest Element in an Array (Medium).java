import java.util.*;

/*
Input: [3,2,1,5,6,4] and k = 2
Output: 5
*/

class KthLargestElementinanArray {
    // 3 ways

    // 1. Arrays.sort(nums)
    // 时间复杂度 O(NlogN)，空间复杂度 O(1)
    public int findKthLargest(int[] nums, int k) {
        Arrays.sort(nums);
        return nums[nums.length - k];
    }

    // 2. Heap
    // 时间复杂度 O(NlogK)，空间复杂度 O(K)
    public int findKthLargest2(int[] nums, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<>(); // 小顶堆
        for (int val : nums) {
            pq.add(val);
            if (pq.size() > k) // 维护堆的大小为 K
                pq.poll();
        }
        return pq.peek();
    }

    // 3. Quick Select
}
