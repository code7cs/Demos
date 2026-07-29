public class LC_1456_Maximum_Number_of_Vowels_in_a_Substring_of_Given_Length {

    public static void main(String[] args) {
        int res = maxVowels("abciiidef", 3);
        System.out.println(res);
    }
    public static int maxVowels(String s, int k) {
        int n = s.length();
        int count = 0;
        for (int i = 0; i < k; i++) {
            count += isVowel(s.charAt(i));
        }
        int res = count;
        for (int i = k; i < n; i++) {
            count += isVowel(s.charAt(i)) - isVowel(s.charAt(i - k));
            res = Math.max(res, count);
        }

        return res;
    }

    public static int isVowel(char ch) {
        return ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u' ? 1 : 0;
    }

}
