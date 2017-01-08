import { Component } from '@angular/core';

import { Skill } from '../Data/Skill';
import { SkillNode, NodeState } from '../Data/SkillNode';

@Component({
  selector: 'skill-node',      
  inputs: ["node", "selected"],
  templateUrl: '../Pages/SkillNode.html'
})
export class SkillNodeComponent {

}
