public class LC_80_remove_duplicates_from_sorted_array_ii {

    //    https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii
    public static void main(String[] args) {
        int[] nums = new int[]{0, 0, 1, 1, 1, 1, 2, 3, 3};

        System.out.println(removeDuplicates(nums));
        //   Input: nums = [1,1,1,2,2,3]
        //   Output: 5, nums = [1,1,2,2,3,_]
    }

    public static int removeDuplicates(int[] nums) {
        if (nums.length == 0) {
            return 0;
        }
        // 快慢指针，维护 nums[0..slow] 为结果子数组
        int slow = 0, fast = 0;
        // 记录一个元素重复的次数
        int count = 0;
        while (fast < nums.length) {
            if (nums[fast] != nums[slow]) {
                // 此时，对于 nums[0..slow] 来说，nums[fast] 是一个新的元素，加进来
                slow++;
                nums[slow] = nums[fast];
            } else if (slow < fast && count < 2) {
                // 此时，对于 nums[0..slow] 来说，nums[fast] 重复次数小于 2，也加进来
                slow++;
                nums[slow] = nums[fast];
            }
            fast++;
            count++;
            if (fast < nums.length && nums[fast] != nums[fast - 1]) {
                // fast 遇到新的不同的元素时，重置 count
                count = 0;
            }
        }
        // 数组长度为索引 + 1
        return slow + 1;
    }
}
