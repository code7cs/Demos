package Algorithm_Prefix_Sum;

public class LC_724_find_pivot_index {
    public static void main(String[] args) {

    }
//    Input: nums = [1,7,3,6,5,6]
//    Output: 3
//    Explanation:
//    The pivot index is 3.
//    Left sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11
//    Right sum = nums[4] + nums[5] = 5 + 6 = 11

    public int pivotIndex(int[] nums) {
        int sumLeft = 0;
        int sumRight = 0;

        for (int i : nums) {
            sumRight += i;
        }

        for (int i = 0; i < nums.length; i++) {
            if (i > 0) {
                sumLeft += nums[i - 1];
            }
            sumRight -= nums[i];
            if (sumLeft == sumRight) {
                return i;
            }
        }

        return -1;
    }
}
