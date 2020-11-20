// Java program to find number of subarrays
// with sum exactly equal to k.

import java.util.HashMap;
import java.util.Map;

public class findSubString {

    // Function to find number of subarrays
    // with sum exactly equal to k.
    static int findSubarraySum(int arr[], int n, int sum) {
        // HashMap to store number of subarrays
        // starting from index zero having
        // particular value of sum.
        HashMap<Integer, Integer> prevSum = new HashMap<>();

        int res = 0;

        // Sum of elements so far.
        int currsum = 0;

        for (int i = 0; i < n; i++) {

            currsum += arr[i];

            if (currsum == sum)
                res++;

            if (prevSum.containsKey(currsum - sum))
                res += prevSum.get(currsum - sum);

            Integer count = prevSum.get(currsum);
            if (count == null) {
                prevSum.put(currsum, 1);
            } else
                prevSum.put(currsum, count + 1);
        }

        return res;
    }

    public static void main(String[] args) {

        int arr[] = {10, 2, -2, -20, 10};
        int sum = -10;
        int n = arr.length;
        System.out.println(findSubarraySum(arr, n, sum));
    }
}
