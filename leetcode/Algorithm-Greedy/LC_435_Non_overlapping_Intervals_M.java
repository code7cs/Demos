import java.util.*;

public class LC_435_Non_overlapping_Intervals_M {
    public int eraseOverlapIntervals(int[][] intervals) {
        if (intervals.length == 0) {
            return 0;
        }
        Arrays.sort(intervals, Comparator.comparingInt(o -> o[1]));
        int cnt = 1;
        int end = intervals[0][1];
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] < end) {
                continue;
            }
            end = intervals[i][1];
            cnt++;
        }
        return intervals.length - cnt;
    }
}

/*
  题目描述：计算让一组区间不重叠所需要移除的区间个数。

  先计算最多能组成的不重叠区间个数，然后用区间总个数减去不重叠区间的个数。

  在每次选择中，区间的结尾最为重要，选择的区间结尾越小，留给后面的区间的空间越大，那么后面能够选择的区间个数也就越大。

  按区间的结尾进行排序，每次选择结尾最小，并且和前一个区间不重叠的区间。
 */