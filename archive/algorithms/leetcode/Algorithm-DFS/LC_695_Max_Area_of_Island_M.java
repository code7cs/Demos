
public class LC_695_Max_Area_of_Island_M {
    private int I, J;
    private int[][] g;
    private boolean[][] visited;

    public int maxAreaOfIsland(int[][] grid) {
        g = grid;
        I = g.length;
        J = g[0].length;
        visited = new boolean[I][J];
        int maxArea = 0;
        for (int i = 0; i < I; i++)
            for (int j = 0; j < J; j++)
                if (!visited[i][j] && g[i][j] == 1)
                    maxArea = Math.max(maxArea, dfs(i, j));
        return maxArea;
    }

    private int dfs(int i, int j) {
        if (i < 0 || i >= I || j < 0 || j >= J || visited[i][j] || g[i][j] == 0)
            return 0;

        visited[i][j] = true;

        return dfs(i - 1, j) + dfs(i + 1, j) + dfs(i, j - 1) + dfs(i, j + 1) + 1;
    }
}