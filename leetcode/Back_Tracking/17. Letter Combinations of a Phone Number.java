package Back_Tracking;

import java.util.*;

class Solution {

    private static final String[] keys = { "", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz" };

    public List<String> letterCombinations(String digits) {
        List<String> result = new ArrayList<>();
        if (digits == null || digits.length() == 0) {
            return result;
        }
        doCombination(digits, "", 0, result);
        return result;
    }

    private void doCombination(String digits, String curr, int index, List<String> result) {
        if (index == digits.length()) {
            result.add(curr);
            return;
        }
        String letters = keys[digits.charAt(index) - '0'];
        for (int i = 0; i < letters.length(); i++) {
            doCombination(digits, curr + letters.charAt(i), index + 1, result);
        }
    }
}