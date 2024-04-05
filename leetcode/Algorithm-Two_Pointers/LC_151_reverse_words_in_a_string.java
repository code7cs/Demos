public class LC_151_reverse_words_in_a_string {
    public static void main(String[] args) {
        String a = reverseWords("the sky is blue");
        System.out.println(a);
    }

    public static String reverseWords(String s) {
        s = s.trim();
        StringBuilder res = new StringBuilder();

        int i = s.length() - 1;
        int j = i;

        while (i >= 0) {
            while (i >= 0 && s.charAt(i) != ' ') {
                i--;
            }
            res.append(s.substring(i +1, j +1) + " ");
            while (i >= 0 && s.charAt(i) == ' ') {
                i--;
            }
            j = i;
        }

        return res.toString().trim();
    }
}
