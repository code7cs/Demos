class Solution {
    public void sortColors(int[] nums) {
        int zero = -1, one = 0, two = nums.length;
        while (one < two) {
            if (nums[one] == 0) {
                zero++;
                swap(nums, zero, one);
                one++;
            } else if (nums[one] == 2) {
                two--;
                swap(nums, two, one);
            } else {
                one++;
            }
        }
    }
    
    private void swap(int[] nums, int i, int j) {
        int t = nums[i];
        nums[i] = nums[j];
        nums[j] = t;
    }

}