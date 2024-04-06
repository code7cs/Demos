public class LC_443_string_compression {
    /**
     * solution: https://leetcode.cn/problems/string-compression/solutions/16388/hua-dong-chuang-kou-fa-ya-suo-zi-fu-chuan-java-by-
     * @param args
     */
    public static void main(String[] args) {
        char[] charArray = {'a', 'a', 'b', 'b', 'c', 'c', 'c'};
        System.out.println(compress(charArray));
        // a2b2c3c
        // 6
    }
    public static int compress(char[] chars) {
        int left = 0, right = 0;
        int size = 0;

        while (right <= chars.length) {
            if (right == chars.length || chars[right] != chars[left]) {
                chars[size] = chars[left];
                size++;

                if (right - left > 1) {
                    for (char c : String.valueOf(right - left).toCharArray()) {
                        chars[size] = c;
                        size++;
                    }
                }
                left = right;
            }

            right++;
        }
        System.out.println(chars);
        return size;
    }
}
