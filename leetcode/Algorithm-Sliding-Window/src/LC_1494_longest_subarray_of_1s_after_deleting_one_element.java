public class LC_1494_longest_subarray_of_1s_after_deleting_one_element {

    // similar to LC_1004
    public int longestSubarray(int[] nums) {
        int left = 0;
        int right = 0;
        int count = 0;
        int ans = 0;
        while (right < nums.length) {
            if (nums[right] == 0) {
                count++;
            }

            while (count > 1) {
                if (nums[left] == 0) {
                    count--;
                }
                left++;
            }

            ans = Math.max(ans, right - left);
            right++;
        }
        return ans;
    }
}
