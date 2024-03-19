import java.util.*;

class AssignCookies {
    public int findContentChildren(int[] g, int[] s) {
        if (g == null || s == null)
            return 0;
        Arrays.sort(g);
        Arrays.sort(s);
        int gi = 0, si = 0;
        while (gi < g.length && si < s.length) {
            if (g[gi] <= s[si]) {
                gi++;
            }
            si++;
        }
        return gi;
    }
}
// Description:
// Assume you are an awesome parent and want to give your children some cookies.
// But, you should give each child at most one cookie.

// Each child i has a greed factor g[i], which is the minimum size of a cookie
// that the child will be content with; and each cookie j has a size s[j]. If
// s[j] >= g[i], we can assign the cookie j to the child i, and the child i will
// be content. Your goal is to maximize the number of your content children and
// output the maximum number.

// Hint: 
// 1. first, sort g[] and s[], 
// 2. second, for each gi, find the minimum si in s[], make s[si] >= g[gi], so that child will be content,
// (because child want at least gi, you give it si should be greater or equal to gi)
// if s[si] >= g[gi], move to next child, and move to next cookies
// if not, only move to next cookie, until s[si]>= g[gi].
// so, in the end, the number of children is g[i].