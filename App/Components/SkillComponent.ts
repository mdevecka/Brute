import { Component } from '@angular/core';

import { Skill } from '../Data/Skill';
import { SkillNode, NodeState } from '../Data/SkillNode';

@Component({
  selector: 'skill',      
  inputs: ["skillType"],
  templateUrl: '../Pages/Skill.html'
})
export class SkillComponent {

}
