// Any plugins you want to use has to be imported
// Detail plugins list see https://www.tinymce.com/docs/plugins/
// Custom builds see https://www.tinymce.com/download/custom-builds/
window.tinymce.PluginManager.add('placeholder', function(editor) {
  // console.log('plugins:', editor)
  editor.on('init', function() {
    var label = new Label()
    onBlur()
    window.tinymce.DOM.bind(label.el, 'click', onFocus)
    editor.on('focus', onFocus)
    editor.on('blur', onBlur)
    editor.on('change', onBlur)
    editor.on('setContent', onBlur)
    function onFocus() { if (!editor.settings.readonly === true) { label.hide() } editor.execCommand('mceFocus', false) }
    function onBlur() { if (editor.getContent() == '') { label.show() } else { label.hide() } }
  })
  var Label = function() {
    var placeholder_text = editor.getElement().getAttribute('placeholder') || editor.settings.placeholder
    console.log('placeholder_text:', placeholder_text)
    var placeholder_attrs = editor.settings.placeholder_attrs || { id: editor.id + 'tinymce-placeholder', style: { position: 'absolute', top: '2px', left: 0, color: '#aaaaaa', padding: '.25%', margin: '10px', width: '80%', 'font-size': '17px !important;', overflow: 'hidden', 'white-space': 'pre-wrap' }}
    var contentAreaContainer = editor.getContentAreaContainer()
    window.tinymce.DOM.setStyle(contentAreaContainer, 'position', 'relative')
    this.el = window.tinymce.DOM.add(contentAreaContainer, 'label', placeholder_attrs, placeholder_text)
  }
  Label.prototype.hide = function() { window.tinymce.DOM.setStyle(this.el, 'display', 'none') }
  Label.prototype.show = function() { window.tinymce.DOM.setStyle(this.el, 'display', '') }
})
// window.tinymce.PluginManager.add('lineheight', function(editor, url) {
//   var pluginName = '设置行高'
//   var global$1 = window.tinymce.util.Tools.resolve('tinymce.util.Tools')
//   var lineheight_val = editor.getParam('lineheight_val', '1 1.5 1.6 1.75 1.8 2 3 4 5')

//   editor.on('init', function() {
//     editor.formatter.register({
//       lineheight: {
//         selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table',
//         styles: { 'line-height': '%value' }
//       }
//     })
//   })

//   var doAct = function(value) {
//     editor.formatter.apply('lineheight', { value: value })
//     editor.fire('change', {})
//   }

//   // editor.ui.registry.getAll().icons.lineheight || editor.ui.registry.addIcon('lineheight', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9.984 12.984v-1.969h12v1.969h-12zM9.984 18.984v-1.969h12v1.969h-12zM9.984 5.016h12v1.969h-12v-1.969zM6 6.984v10.031h2.484l-3.469 3.469-3.516-3.469h2.484v-10.031h-2.484l3.516-3.469 3.469 3.469h-2.484z"></path></svg>')

//   editor.addButton('lineheight', {
//     image: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9.984 12.984v-1.969h12v1.969h-12zM9.984 18.984v-1.969h12v1.969h-12zM9.984 5.016h12v1.969h-12v-1.969zM6 6.984v10.031h2.484l-3.469 3.469-3.516-3.469h2.484v-10.031h-2.484l3.516-3.469 3.469 3.469h-2.484z"></path></svg>',
//     tooltip: pluginName,
//     fetch: function(callback) {
//       var dom = editor.dom
//       var blocks = editor.selection.getSelectedBlocks()
//       var lhv = 0
//       global$1.each(blocks, function(block) {
//         if (lhv == 0) {
//           lhv = dom.getStyle(block, 'line-height') ? dom.getStyle(block, 'line-height') : 0
//         }
//       })

//       var items = lineheight_val.split(' ').map(function(item) {
//         var text = item
//         var value = item
//         return {
//           type: 'togglemenuitem',
//           text: text,
//           active: lhv == value,
//           onAction: function() {
//             doAct(value)
//           }
//         }
//       })
//       callback(items)
//     }
//   })

//   return {
//     getMetadata: function() {
//       return {
//         name: pluginName,
//         url: 'http://tinymce.ax-z.cn/more-plugins/lineheight.php'
//       }
//     }
//   }
// })

const plugins = ['advlist anchor autolink autosave code codesample colorpicker colorpicker directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount powerpaste lineheight ']

export default plugins
