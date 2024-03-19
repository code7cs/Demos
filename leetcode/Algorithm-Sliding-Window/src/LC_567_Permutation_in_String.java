import java.util.HashMap;

public class LC_567_Permutation_in_String {
    public static void main(String[] args) {
        System.out.println(checkInclusion("ab", "eiba"));
    }

    public static boolean checkInclusion(String s1, String s2) {
        HashMap<Character, Integer> source = new HashMap<>();
        HashMap<Character, Integer> window = new HashMap<>();

        for (int i = 0; i < s1.length(); i++) {
            char c = s1.charAt(i);
            source.put(c, source.getOrDefault(c, 0) + 1);
        }

        System.out.println(source);
        int left = 0, right = 0;
        int valid = 0;

        while (right < s2.length()) {
            char rc = s2.charAt(right);
            right++;
            if (source.containsKey(rc)) {
                window.put(rc, window.getOrDefault(rc, 0) + 1);
                if (window.get(rc).equals(source.get(rc))) {
                    valid++;
                }
            }

            while (right - left >= s1.length()) {
                if (valid == source.size()) {
                    return true;
                }

                char lc = s2.charAt(left);
                left++;
                if (source.containsKey(lc)) {
                    if (window.get(lc).equals(source.get(lc))) {
                        valid--;
                    }
                    window.put(lc, window.getOrDefault(lc, 0) - 1);
                }
            }
        }

        return false;
    }
}
