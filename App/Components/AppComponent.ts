import { Component, HostListener } from '@angular/core';

import { AppModel, DialogType } from '../Model/AppModel';
import { Skill } from '../Data/Skill';
import { SkillNode, NodeState } from '../Data/SkillNode';
import { allSkills } from '../Data/Skills'
import { SaveData } from '../Data/SaveData';
import { IndexedSkillNode } from '../Data/IndexedSkillNode';
import { DataService }  from '../Service/DataService';

import { showMessageBox, showConfirmDialog } from '../AppUtils';

@Component({
  selector: 'app',      
  templateUrl: '../Pages/App.html'
})
export class AppComponent {

  model:AppModel;

  constructor(private dataService:DataService){
    var rootNode:SkillNode = new SkillNode(null);
    rootNode.setNextEmpty();
    this.model = { 
      modified: false,
      name: "Hercules",
      saveFiles: [],
      selectedFilename: "",
      rootNode: rootNode,
      displayNodes: [],
      selectedNode: null,
      selectedElement: null,
      showOverlay: false,
      showSavefileDialog: false,
      savefileDialogType: null
    };
    this.updateDisplayNodes();
    window["root"] = () => this.model.rootNode;
  }

  @HostListener("window:click", ["$event"])
  windowClick(event) {
    this.hideSkillPanel();
    this.hideContextMenu();
  }

  public cycle(n:number) { var arr=[];for(var i=0;i<n;i++) arr.push(i);return arr; }

  public allSkills():Skill[]{
    return allSkills;
  }

  public updateDisplayNodes(){
    var nodes = this.model.displayNodes;
    nodes.length = 0;
    var node = this.model.rootNode;
    while(node != null && node.next != null){
      nodes.push(node);
      var activeNextNode = (node.next[0].state == NodeState.Active) ? node.next[0] 
                         : (node.next[1].state == NodeState.Active) ? node.next[1]
                         : null;
      node = activeNextNode;
    }
  }

  private adjustPosition(source:JQuery,target:JQuery){
    if(target != null){
      var pos = target.offset();
      pos.left -= (source.outerWidth() - target.outerWidth()) / 2;
      pos.top += target.height();
      source.css(pos);
    }
  }

  private showSkillPanel(elem:JQuery, node:SkillNode){
    this.model.selectedElement = elem;
    this.model.selectedNode = node;
    var panel = $("#SkillPanel");
    //this.AdjustPosition(panel, elem);
    panel.css({ position: "fixed", top: 280, left: "50%", marginLeft: -panel.width()/2 });
    panel.stop().fadeIn(250);
  }

  private hideSkillPanel(speed = 250){
    this.model.selectedElement = null;
    this.model.selectedNode = null;
    var panel = $("#SkillPanel");
    panel.stop().fadeOut(speed);
  }

  private showContextMenu(elem:JQuery, node:SkillNode){
    this.model.selectedElement = elem;
    this.model.selectedNode = node;
    $("#Tooltip").hide();
    var panel = $("#ContextMenu");
    this.adjustPosition(panel, elem);
    panel.stop().fadeIn(250);
  }

  private hideContextMenu(speed = 250){
    this.model.selectedElement = null;
    this.model.selectedNode = null;
    var panel = $("#ContextMenu");
    panel.stop().fadeOut(speed);
  }

  public clickAction(e:JQueryEventObject, node:SkillNode){
    var target = $(e.currentTarget);
    if(node.state == NodeState.New){
      if(this.model.selectedNode != node){
        this.hideContextMenu();
        this.showSkillPanel(target, node);
      } else {
        this.hideSkillPanel();
      }
    } else {
      if(this.model.selectedNode != node){
        this.hideSkillPanel();
        this.showContextMenu(target, node);
      } else {
        this.hideContextMenu();
      }
    }
  }

  public selectSkillAction(skill:Skill){
    var node = this.model.selectedNode;
    node.skill = skill;
    if(node.state == NodeState.New){
      var sibling = node.sibling();
      node.state = (sibling.state != NodeState.Active) ? NodeState.Active : NodeState.InActive;
    }
    if(node.next == null){
      node.setNextEmpty();
    }
    this.model.modified = true;
    this.updateDisplayNodes();
    this.hideSkillPanel(0);
  }

  public enableNodeAction(){
    var node = this.model.selectedNode;
    node.state = NodeState.Active;
    var sibling = node.sibling();
    if(sibling.state == NodeState.Active){
      sibling.state = NodeState.InActive;
    }
    this.model.modified = true;
    this.updateDisplayNodes();
    this.hideContextMenu();
  }

  public disableNodeAction(){
    this.model.selectedNode.state = NodeState.InActive;
    this.model.modified = true;
    this.updateDisplayNodes();
    this.hideContextMenu();
  }

  public changeNodeAction(){
    var elem = this.model.selectedElement;
    var node = this.model.selectedNode;
    this.hideContextMenu();
    this.showSkillPanel(elem, node);
  }

  public swapNodeAction(){
    var node = this.model.selectedNode;
    var sibling = node.sibling();
    var parent = node.parent;
    if(parent.next[0] == node){
      node.parent.next[0] = sibling;
      node.parent.next[1] = node;
    } else {
      node.parent.next[0] = node;
      node.parent.next[1] = sibling;
    }
    this.model.modified = true;
    this.updateDisplayNodes();
    this.hideContextMenu();
  }

  public removeNodeAction(){
    var node = this.model.selectedNode;
    node.state = NodeState.New;
    node.removeChildren();
    node.skill = null;
    this.model.modified = true;
    this.updateDisplayNodes();
    this.hideContextMenu();
  }

  public newAction(){
    showConfirmDialog("Do you want do discard current tree and start with a new one?")
    .then(() => {
      this.model.modified = false;
      this.model.rootNode.removeChildren();
      this.model.rootNode.setNextEmpty();
      this.updateDisplayNodes();
     });
  }

  public saveAction(){
    this.model.showOverlay = true;
    execute(
      () => this.dataService.GetSaveFileList(),
      (data:string[]) => {
        this.model.savefileDialogType = DialogType.Save;
        this.model.showSavefileDialog = true;
        this.model.saveFiles = data;
        //this.model.$digest();
      }
    ).fail((code, text) => {
      showMessageBox(text);
      this.model.showOverlay = false; 
      //this.model.$digest();
    });
  }

  public loadAction(){
    this.model.showOverlay = true;
    execute(
      () => this.dataService.GetSaveFileList(),
      (data:string[]) => {
        this.model.savefileDialogType = DialogType.Load;
        this.model.showSavefileDialog = true;
        this.model.saveFiles = data;
        //this.model.$digest();
      }
    ).fail((code, text) => {
      showMessageBox(text);
      this.model.showOverlay = false; 
      //this.model.$digest();
    });
  }

  public cancelSaveAction(){
    this.model.showSavefileDialog = false;
    this.model.showOverlay = false;
  }

  public selectFilenameAction(name:string){
    this.model.selectedFilename = name;
  }

  public doFilenameAction(name:string){
    this.model.selectedFilename = name;
    if(this.model.savefileDialogType == DialogType.Load){
      this.loadConfirmedAction();
    } else {
      this.saveConfirmedAction();
    }
  }

  public saveConfirmedAction(){
    var filename = this.model.selectedFilename;
    if(isNullOrEmpty(filename))
      return;
    var func = () => execute(
      () => {
        var saveData:SaveData = { name: this.model.name, nodes: IndexedSkillNode.convertFromSkillNodeTree(this.model.rootNode) };
        return this.dataService.SaveFile(filename, saveData);
      },
      () => {
        this.model.modified = false;
      }
    )
    .fail((code, text) => {
      showMessageBox(text);
    })
    .always(
      () => {
        this.model.showSavefileDialog = false;
        this.model.showOverlay = false;
        //this.model.$digest();
      }
    );
    if(contains(this.model.saveFiles, filename)){
      showConfirmDialog("File already exists - overwrite?")
      .then(() => func());
    } else {
      func();
    }
  }

  public loadConfirmedAction(){
    var filename = this.model.selectedFilename;
    if(isNullOrEmpty(filename))
      return;
    if(!contains(this.model.saveFiles, filename)){
      showMessageBox("File does not exist!");
      return;
    }
    execute(
      () => this.dataService.LoadFile(filename),
      (data:SaveData) => {
        var root = IndexedSkillNode.convertToSkillNodeTree(data.nodes);
        this.model.modified = false;
        this.model.name = data.name;
        this.model.rootNode = root;
        this.updateDisplayNodes();
      }
    )
    .fail((code, text) => {
      showMessageBox(text);
    })
    .always(
      () => {
        this.model.showSavefileDialog = false;
        this.model.showOverlay = false;
        //this.model.$digest();
      }
    );
  }

}
