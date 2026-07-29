import java.util.*;

public class gotIP {
    public static void main(String[] args) {
        String[] ss = {"10.0.1.45 - /d/in/", "10.0.1.45 -/a/fact", "10.3.54.123 -/fd/xyz"};
        HashMap<String, Integer> hm = new HashMap<>();

        for (String s : ss) {
            String firstWord = s.substring(0, s.indexOf(" "));
            if (!hm.containsKey(firstWord)) {
                hm.put(firstWord, 1);
            } else {
                hm.put(firstWord, hm.get(firstWord) + 1);
            }
        }
        Integer max = 0;
        String ans = "";
        for (Map.Entry me : hm.entrySet()) {
            if ((Integer) me.getValue() > max) {
                ans = me.getKey() + "";
                max = (Integer) me.getValue();
            }
        }

        System.out.println(ans);

        /////////////////////////

        Set<String> set = new HashSet<>();
        set.add("a");
        set.add("b");
        set.add("a");
        System.out.println(set);
        System.out.println(new ArrayList<>(set));
    }
}
