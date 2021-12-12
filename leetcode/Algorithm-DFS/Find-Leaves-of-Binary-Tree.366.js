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


/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

class TreeNode {
    constructor(val, left, right) {
        this.val = (val===undefined ? 0 : val)
        this.left = (left===undefined ? null : left)
        this.right = (right===undefined ? null : right)
    }
}

    function findLeaves(root) {
        if(root== null) return new Array();

        let l = findLeaves(root.left);
        let r = findLeaves(root.right);

        let list = new Array();
        list.push(root.val);

        if(l == null && r == null){
            let res = new Array();
            res.push(list);
            return res;
        }else if(l == null || r == null){
            let res = l == null ? r : l;
            res.push(list);
            return res;
        }else{
            let lli = l.length > r.length ? merge(l,r): merge(r,l);
            lli.push(list);
            return lli;
        }

    }

    function merge (large, small){
        for(let i=0; i< small.length; i++){
            large[i].push(small[i]);
            // large.get(i).addAll(small.get(i));
        }
        return large;
    }

    // let test1 = new TreeNode(1, [2], [3]);
    // console.log(findLeaves(test1));


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

