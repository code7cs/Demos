package Back_Tracking;
import java.util.*;

class RestoreIPAddresses {
    public List<String> restoreIpAddresses(String s) {
        List<String> result = new ArrayList<>();
        doRestore(result, "", s, 0);
        return result;
    }

    private void doRestore(List<String> result, String path, String s, int k) {
        if (s.isEmpty() || k == 4) {
            if (s.isEmpty() && k == 4)
                result.add(path.substring(1));
            return;
        }

        for (int i = 1; i <= (s.charAt(0) == '0' ? 1 : 3) && i <= s.length(); i++) { // Avoid leading 0
            String part = s.substring(0, i);
            if (Integer.valueOf(part) <= 255)
                doRestore(result, path + "." + part, s.substring(i), k + 1);
        }
    }
}
/*
Given "25525511135",
return ["255.255.11.135", "255.255.111.35"].

                                                                0
1 ===============                           2                        25                  255
2 ===============                   5       55      525
3 ===============    5         52   525
4 =============== 2 25 255     
*/ 