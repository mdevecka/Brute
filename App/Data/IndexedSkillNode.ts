import { SkillNode, NodeState } from './SkillNode';
import { allSkills } from './Skills'

  export class IndexedSkillNode{
    public id:number;
    public skillIndex:number;
    public state:NodeState;
    public next:number[];

    public static convertFromSkillNodeTree(root:SkillNode):IndexedSkillNode[]{
      var maxID = 0;
      var nodes:IndexedSkillNode[] = [];
      var fillNodes = (node:SkillNode) => {
        if (node.state == 1)
          return null;
        var inode = new IndexedSkillNode();
        inode.id = ++maxID;
        inode.skillIndex = allSkills.indexOf(node.skill);
        inode.state = node.state;
        inode.next = null;
        nodes.push(inode);
        if (node.next != null){
          var child1 = fillNodes(node.next[0]);
          var child2 = fillNodes(node.next[1]);
          inode.next = [ (child1 == null) ? 0 : child1.id, (child2 == null) ? 0 : child2.id ];
        }
        return inode;
      }
      fillNodes(root);
      return nodes;
    }

    public static convertToSkillNodeTree(nodes:IndexedSkillNode[]):SkillNode{
      var resolveNode = (id, parent:SkillNode) => {
        if(id == 0) {
          var node = new SkillNode(parent)
          node.state = NodeState.New;
          node.skill = null;
          node.next = null;
          return node;
        }
        var inode = first(nodes, x => x.id == id);
        var node = new SkillNode(parent);
        node.state = inode.state;
        node.skill = allSkills[inode.skillIndex];
        node.next = [ resolveNode(inode.next[0], node), resolveNode(inode.next[1], node) ];
        return node;
      }
      var irootID = first(nodes, x => !x.state).id;
      var root = resolveNode(irootID, null); 
      return root;
    }

  }

