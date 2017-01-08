export enum SkillType{
  Stat = 1,
  Ability = 2,
  Weapon = 3,
  Pet = 4
}
  
export interface Skill{
  name: string;
  src?: string;
  text?: string;
  color?: string;
  type: SkillType;
}

