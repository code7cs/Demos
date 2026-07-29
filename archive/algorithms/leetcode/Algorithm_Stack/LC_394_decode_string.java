package Algorithm_Stack;

import java.util.LinkedList;

public class LC_394_decode_string {
    public static void main(String[] args) {
        // https://leetcode.cn/problems/decode-string/solutions/19447/decode-string-fu-zhu-zhan-fa-di-gui-fa-by-jyd
        String s = "2[abc]3[cd]ef";
        System.out.println(decodeString(s)); // abcabccdcdcdef
    }

    public static String decodeString(String s) {
        StringBuilder res = new StringBuilder();
        int multi = 0;
        LinkedList<Integer> stack_multi = new LinkedList<>();
        LinkedList<String> stack_res = new LinkedList<>();
        for (Character c : s.toCharArray()) {
            if (c == '[') {
                stack_multi.addLast(multi);
                multi = 0;

                stack_res.addLast(res.toString());
                res = new StringBuilder();
            } else if (c == ']') {
                StringBuilder temp = new StringBuilder();
                int cur_multi = stack_multi.removeLast();
                for (int i = 0; i < cur_multi; i++) {
                    temp.append(res);
                }
                res = new StringBuilder(stack_res.removeLast() + temp);
            } else if (c >= '0' && c <= '9') {
                multi = multi * 10 + Integer.parseInt(c + "");
            } else {
                res.append(c);
            }
        }

        return res.toString();
    }
}
