import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent }  from './Components/AppComponent';
import { SkillNodeComponent }  from './Components/SkillNodeComponent';
import { SkillComponent }  from './Components/SkillComponent';
import { TooltipDirective }  from './Directive/TooltipDirective';
import { VerticalAlignDirective }  from './Directive/VerticalAlignDirective';

import { DataService }  from './Service/DataService';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, SkillNodeComponent, SkillComponent, TooltipDirective, VerticalAlignDirective ],
  providers:    [ DataService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
