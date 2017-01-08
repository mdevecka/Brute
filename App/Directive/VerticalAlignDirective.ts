import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[valign]'
})
export class VerticalAlignDirective {

  @Input() valign;

  private Align(elem){
    var img = <HTMLImageElement>elem[0];
    if(!img.naturalHeight){
      //console.log("not ready yet");
      return;
    }
    var nWidth = img.naturalWidth;
    var nHeight = img.naturalHeight;
    var parWidth = elem.parent().width();
    var parHeight = elem.parent().height();
    var ratioW = parWidth/nWidth;
    var ratioH = parHeight/nHeight;
    var ratio = Math.min(ratioW, ratioH);
    var width = toInt(nWidth * ratio);
    var height = toInt(nHeight * ratio);
    var oy = (parHeight - height)/2;
    //console.log("set margin", elem.attr("src"), height, parHeight, oy);
    elem.css("padding-top", oy);
    elem.show();
  }

  constructor(private elemRef:ElementRef){
  }

  public ngOnInit() {
    var elem = $(this.elemRef.nativeElement);
    if(!this.valign)
      return;
    elem.hide();
    elem.load((e) => {
      var target = $(e.target);
      //console.log("load", target.attr("src"));
      this.Align(target);
    });
    this.Align(elem);
  }

}

