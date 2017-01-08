import { Skill } from './Skill';

  export enum NodeState{
    New = 1,
    Active = 2, 
    InActive = 3, 
    Unexplored = 4,
    Signal = 5
  }
  
  export class SkillNode{
    public skill:Skill;
    public parent:SkillNode;
    public next:SkillNode[];
    public state:NodeState;

    constructor(parent:SkillNode){ 
      this.parent = parent;
    }

    public static empty(parent:SkillNode):SkillNode { 
      var node = new SkillNode(parent);
      node.state = NodeState.New;
      return node;
    }

    public setNextEmpty(){
      this.next = [SkillNode.empty(this), SkillNode.empty(this)];
    }

    public isNextEmpty(){
      return (this.next == null || (this.next[0].state == NodeState.New && this.next[1].state == NodeState.New));
    }

    public removeChildren(){
      if(this.next != null){
        this.next.forEach(x => x.parent = null);
      }
      this.next = null;
    }

    public sibling():SkillNode{
      var parent = this.parent;
      return (parent.next[0] == this) ? parent.next[1] : parent.next[0];
    }

  }               

