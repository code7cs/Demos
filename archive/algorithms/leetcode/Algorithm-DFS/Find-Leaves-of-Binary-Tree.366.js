/**
2021.12.11

https://tenderleo.gitbooks.io/leetcode-solutions-/content/GoogleMedium/366.html

Given a binary tree, collect a tree's nodes as if you were doing this: Collect and remove all leaves, repeat until the tree is empty.

Example: Given binary tree

          1
         / \
        2   3
       / \     
      4   5
Returns [4, 5, 3], [2], [1].

 */

// res 是一个二维数组.
// 思路: recursion, 找到每个节点的 height, null 的 height 是 -1, 最开始的子叶子节点的 height 是 0.
// 相同的 height插入res的同一个index 的那个子数组里.

// 代码

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var findLeaves = function(root) {
    if (root === null) return null;
    let res = [];
    level(root, res);
    return res;
};

function level(root, res) {
    if (root == null) return -1;
    let height = Math.max(level(root.left, res), level(root.right, res)) + 1;
    if (height >= res.length) {
        res.push([]);
    }
    res[height].push(root.val);

    return height;
}

    /**
     * Java Solution
     * 
     * 
     * public class Solution {
    List<List<Integer>> res = new ArrayList<>();
    public List<List<Integer>> findLeaves(TreeNode root) {

        find(root);
        return res;
    }

    private int find(TreeNode root){
        if(root == null) return -1;

        int depth = Math.max(find(root.left), find(root.right)) +1;
        if(depth >= res.size()){
            res.add(new ArrayList<>());
        }

        res.get(depth).add(root.val);
        return depth;
    }
}

     */

