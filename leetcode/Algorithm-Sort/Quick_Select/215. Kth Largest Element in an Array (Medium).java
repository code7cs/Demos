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
    class Solution {
        public int findKthLargest(int[] nums, int k) {
            k = nums.length - k;
            int l = 0, h = nums.length - 1;
            while (l < h) {
                int j = partition(nums, l, h);
                if (j == k) {
                    break;
                } else if (j < k) {
                    l = j + 1;
                } else {
                    h = j - 1;
                }
            }
            return nums[k];
        }
    
        // private int partition(int[] a, int l, int h) {
        //     int i = l, j = h + 1;
        //     while (true) {
        //         while (a[++i] < a[l] && i < h) ;
        //         while (a[--j] > a[l] && j > l) ;
        //         if (i >= j) {
        //             break;
        //         }
        //         swap(a, i, j);
        //     }
        //     swap(a, l, j);
        //     return j;
        // }
        
        private int partition(int[] nums, int lo, int hi) {
            int pivot = nums[hi];
            int i = lo;
            for (int j = lo; j < hi; j++) {
                if (nums[j] <= pivot) {
                    swap(nums, i, j);
                    i++;
                }
            }
            swap(nums, i, hi);
            return i;
        }
    
        private void swap(int[] a, int i, int j) {
            int t = a[i];
            a[i] = a[j];
            a[j] = t;
        }
    }
}
