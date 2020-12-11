package BFS;
import java.util.*;

class Solution {
    public int shortestPathBinaryMatrix(int[][] grid) {
        if (grid == null || grid.length == 0) return -1;
        int m = grid.length;
        int n = grid[0].length;
        
        if (grid[0][0] == 1 || grid[m-1][n-1] == 1) return -1;
        
        Queue<int[]> q = new LinkedList<>();
        q.offer(new int[]{0, 0});
        
        boolean[][] visited = new boolean[m][n];
        visited[0][0] = true;
        
        int[][] dirs = {{1, -1}, {1, 0}, {1, 1}, {0, -1}, {0, 1}, {-1, -1}, {-1, 0}, {-1, 1}};
        int level = 0;
        
        while(!q.isEmpty()) {
            int size = q.size();
            level++;
            for (int i = 0; i < size; i++) {
                int[] curr = q.poll();
                int currX = curr[0];
                int currY = curr[1];
                if (currX == m - 1 && currY == n - 1) return level;
                
                for (int[] dir : dirs) {
                    int x = currX + dir[0];
                    int y = currY + dir[1];
                    
                    if (x < 0 || x > m - 1 || y < 0 || y > n - 1 || grid[x][y] == 1) {
                        continue;
                    }
                    // the cell contains 0
                    grid[x][y] = 1;
                    q.offer(new int[]{x, y});
                }
            }
        }
        
        return -1;
        
    }
}