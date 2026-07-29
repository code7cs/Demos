package Algorithm_Binary_Search;

class LC_744_Find_Smallest_Letter_Greater_Than_Target_Easy {

//        Input: letters = ["c","f","j"], target = "a"
//        Output: "c"
//        Explanation: The smallest character that is lexicographically greater than 'a' in letters is 'c'.

    public static void main(String[] args) {
        char res = nextGreatestLetter(new char[]{'c','f','j'}, 'a');
        System.out.println(res);
    }
    public static char nextGreatestLetter(char[] letters, char target) {
        int n = letters.length;
        int l = 0, h = n - 1;
        while (l <= h) {
            int mid = l + (h - l) / 2;
            if (letters[mid] <= target) {
                l = mid + 1;
            } else {
                h = mid - 1;
            }
        }
        return l < n ? letters[l] : letters[0];
    }
}
