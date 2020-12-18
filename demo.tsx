import SmartBlock from './src/adapter';
import Code from './src/extensions/code';
import ImageDialogAdapter from './src/extensions/imageDialogAdapter';
import ImageWithText from './src/extensions/imageWithText';
import LinkDialogAdaper from './src/extensions/linkDialogAdapter';
import * as showdown from 'showdown';
import './css/smartblock.css';

import Paragraph from './src/extensions/paragraph';
import Trash from './src/extensions/trash';
import MoveUp from './src/extensions/move-up';
import MoveDown from './src/extensions/move-down';
import Heading from './src/extensions/heading';
import ListItem from './src/extensions/list-item';
import BulletList from './src/extensions/bullet-list';
import OrderedList from './src/extensions/ordered-list';
import Embed from './src/extensions/embed';
import Table from './src/extensions/table';
import Blockquote from './src/extensions/blockquote';
import Strong from './src/extensions/strong';
import Emphasis from './src/extensions/emphasis';
import Underline from './src/extensions/underline';
import Strike from './src/extensions/strike';
import DefaultKeys from './src/extensions/default-keys';
import DefaultPlugins from './src/extensions/default-plugins';
import { Extension } from './src/types/';

import testContent from './testContent'

const getDialog = (attr) => {
  let onOKCl
  let onCancelCl
  let dialog = null

  return (onOK, onCancel, attrs) => {
    if (!dialog) {
      const div = document.createElement('div')
      div.style.position = 'fixed'
      div.style.left = '50%'
      div.style.top = '50%'
      document.body.append(div)
      const input = document.createElement('input')
      input.style.width = '200px';
      div.append(input)
      const ok = document.createElement('button')
      ok.innerHTML = 'OK'
      div.append(ok)
      const cancel = document.createElement('button')
      cancel.innerHTML = 'Cancel'
      div.append(cancel)

      ok.addEventListener('click', () => {
        onOKCl({ title: 'foo', foo: 'bar', [attr]: input.value })
        div.style.display = 'none'
      })
      cancel.addEventListener('click', () => {
        onCancelCl()
        div.style.display = 'none'
      })

      dialog = { div, input, ok, cancel }
    }
    onOKCl = onOK
    onCancelCl = onCancel
    dialog.input.value = attrs[attr]
    dialog.div.style.display = 'block'

    return dialog
  }
}

const openLinkDialog = getDialog('href')
const openImageDialog = getDialog('src')
const openImageTextDialog = getDialog('src')

const extensions = [
  // blocks
  new Paragraph(),
  new Heading({ sizes: ['XL', 'L', 'M', 'S', 'XS'] }),
  new ListItem(),
  new BulletList(),
  new OrderedList(),
  new Embed(),
  // new Code(),
  new Table(),
  new Blockquote(),
  // marks
  new Strong(),
  new Emphasis(),
  new Underline(),
  new Strike(),
  // utility
  new MoveDown(),
  new MoveUp(),
  new Trash(),
  // default
  new DefaultKeys(),
  new DefaultPlugins({
    placeholder: 'Content here...'
  }),
  new Code(),
  new LinkDialogAdaper({
    attributes: ['title', 'href'],
    openDialog: openLinkDialog,
  }),
  new ImageDialogAdapter({
    attributes: ['title', 'src'],
    openDialog: openImageDialog,
  }),
  new ImageWithText({
    attributes: ['title', 'src'],
    openDialog: openImageTextDialog,
    previewSrcFromAttrs: ({ src }) => src + '#XXXXXXXXX'
  }),
] as Extension[]


SmartBlock('#app', {
  json: testContent,
  showdown,
  extensions,
  onChange: ({ json }) => console.log('onChange', json)
});

// JSX version
// import * as React from 'react';
// import { render } from 'react-dom';
// import SmartBlock from './src/components/smartblock';
// import extensions from './src/extensions';
// ​
// render(<>
//   <SmartBlock
// 	extensions={extensions}
// 	html="html"
// 	showTitle={true}
// 	onChange={({html}) => console.log(html)}
//   />
// </>,
// document.getElementById('app')
// );