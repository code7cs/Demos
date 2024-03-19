import java.util.Arrays;

public class sort2Arrays {
    static int[] A = {0, 2, 5, 8, 9, 20};
    static int[] B = {1, 3, 4, 6, 7, 10, 30};

    static void merge(int m, int n) {
        int i = 0, j = 0;
        while (i < m) {
            if (A[i] > B[j]) {
                A[i] = A[i] + B[j];
                B[j] = A[i] - B[j];
                A[i] = A[i] - B[j];
            }
            i++;
            Arrays.sort(B);
        }

    }

    public static void main(String[] args) {
        merge(A.length, B.length);
        for (int a : A) {
            System.out.print(a);
        }
        System.out.println();
        for (int b : B) {
            System.out.print(b);
        }

    }
}
