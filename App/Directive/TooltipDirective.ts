import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective {

  @Input() tooltip;

  private ShowTooltip(text, elem){
    if(text == null || text == "")
      return;
    var dialog = $("#Tooltip");
    if(dialog.length == 0){
      dialog = $("<div id='Tooltip' class='dialog noselect' style='display:none'></div>");
      $(document.body).append(dialog);
    }
    dialog.html(text);
    if(elem != null){
      var pos = elem.offset();
      pos.left -= (dialog.outerWidth() - elem.outerWidth()) / 2;
      pos.top += elem.height();
      dialog.css(pos);
    }
    dialog.stop().fadeIn();
    return dialog;
  }

  private HideTooltip(){
    $("#Tooltip").stop().fadeOut();
  }

  constructor(private elemRef:ElementRef){
    var elem = $(elemRef.nativeElement);
    elem.off("hover");
    elem.hover(e => { this.ShowTooltip(this.tooltip, elem); }, e => { this.HideTooltip(); });
  }

}
