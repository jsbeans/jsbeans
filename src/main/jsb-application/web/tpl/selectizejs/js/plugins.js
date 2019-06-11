/*
    Hide textfield plugin
    https://github.com/selectize/selectize.js/issues/110#issuecomment-167840205
*/
Selectize.define('hidden_textfield', function(options) {
    var self = this;
    this.showInput = function() {
         this.$control.css({cursor: 'pointer'});
         this.$control_input.css({opacity: 0, position: 'relative', left: self.rtl ? 10000 : -10000 });
         this.isInputHidden = false;
     };

     this.setup_original = this.setup;

     this.setup = function() {
          self.setup_original();
          this.$control_input.prop("disabled","disabled");
     }
});