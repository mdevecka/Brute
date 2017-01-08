export function showMessageBox(text:string):JQueryPromise<any>{
  var def = $.Deferred();
  var dialog = $("<message-box>");
  dialog.attr("text", text);
  dialog.attr("ok-click", "okAction()");
  $(document.body).append(dialog);
/*  angular.element(document).injector().invoke(function($compile) {
    var parentScope = angular.element(dialog).scope();
    var scope = <any>parentScope.$new(true);
    scope.okAction = () => { scope.$destroy();dialog.remove();def.resolve(); }
    $compile(dialog)(scope);
  });*/
  return def;
}

export function showConfirmDialog(text:string):JQueryPromise<any>{
  var def = $.Deferred();
  var dialog = $("<confirm-dialog>");
  dialog.attr("text", text);
  dialog.attr("yes-click", "yesAction()");
  dialog.attr("no-click", "noAction()");
  $(document.body).append(dialog);
/*  angular.element(document).injector().invoke(function($compile) {
    var parentScope = angular.element(dialog).scope();
    var scope = <any>parentScope.$new(true);
    scope.noAction = () => { scope.$destroy();dialog.remove();def.reject(); }
    scope.yesAction = () => { scope.$destroy();dialog.remove();def.resolve(); }
    $compile(dialog)(scope);
  });*/
  return def;
}

