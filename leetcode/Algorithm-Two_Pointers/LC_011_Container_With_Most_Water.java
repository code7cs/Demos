
class LC_011_Container_With_Most_Water {

    public static void main(String[] args) {
        System.out.println(maxArea(new int[]{1, 2}));
    }
    public static int maxArea(int[] height) {
        
        int left = 0, right = height.length - 1;
        int max = 0;
        
        while (left < right) {
            if (height[left] <= height[right]) {
                max = Math.max(max, (right - left) * height[left]);
                left++;
            } else {
                max = Math.max(max, (right - left) * height[right]);
                right--;
            }
        }
        
        return max;
    }
}