import java.util.*;

class reverseVowelsClass {
    public String reverseVowels(String s) {
        if (s == null) return null;
        int i = 0, j = s.length() - 1;
        char[] result = new char[s.length()];
        while (i <= j) {
            char ci = s.charAt(i);
            char cj = s.charAt(j);
            if (!vowels.contains(ci)) {
                result[i] = ci;
                i++;
            } else if (!vowels.contains(cj)) {
                result[j] = cj;
                j--;
            } else {    // both are vowels, switch them
                result[i] = cj;
                result[j] = ci;
                i++;
                j--;
                
            }
        }
        return new String(result);
    }
    
    private final static HashSet<Character> vowels = 
        new HashSet<>(Arrays.asList('a','e','i','o','u','A','E','I','O','U'));
    
    
}