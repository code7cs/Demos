package Algorithm_TreeNode;

public class LC_1448_count_good_nodes_in_binary_tree {
    // https://leetcode.cn/problems/count-good-nodes-in-binary-tree/solutions/2403677/jian-ji-xie-fa-pythonjavacgojs-by-endles-gwxt
    //    Input: root = [3,1,4,3,null,1,5]
    //    Output: 4
    //    Explanation: Nodes in blue are good.
    //            Root Node (3) is always a good node.
    //    Node 4 -> (3,4) is the maximum value in the path starting from the root.
    //            Node 5 -> (3,4,5) is the maximum value in the path
    //    Node 3 -> (3,1,3) is the maximum value in the path.
    public int goodNodes(TreeNode root) {
        return dfs(root, root.val);
    }

    private int dfs(TreeNode root, int max) {
        if (root == null) {
            return 0;
        }

        int left = dfs(root.left, Math.max(max, root.val));
        int right = dfs(root.right, Math.max(max, root.val));
        return left + right + (max <= root.val ? 1 : 0);
    }
}
