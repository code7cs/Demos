package Algorithm_Stack;

import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

public class LC_735_asteroid_collision {
    public static void main(String[] args) {
        int[] asts = {5,10,-5};
        int[] ans = asteroidCollision(asts);
        System.out.println(Arrays.toString(ans)); // [5, 10]
    }
    public static int[] asteroidCollision(int[] asteroids) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (int ast : asteroids) {
            if (ast > 0) {
                stack.push(ast);
            } else {
                boolean alive = true;
                while (alive && !stack.isEmpty() && stack.peek() > 0) {
                    alive = stack.peek() < Math.abs(ast);
                    if (stack.peek() <= Math.abs(ast)) {
                        stack.pop();
                    }
                }

                if (alive) {
                    stack.push(ast);
                }
            }
        }

        int[] ans = new int[stack.size()];
        int i = 0;
        while (!stack.isEmpty()) {
            ans[i++] = stack.pollLast();
        }

        return ans;
    }
}
