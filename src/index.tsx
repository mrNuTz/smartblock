import { Plugin } from 'prosemirror-state'
import SmartBlock from './components/smartblock'
import Button from './components/button'
import EditMenu from './components/edit-menu'
import Editor from './components/editor'
import InlineMenu from './components/inline-menu'
import Menu from './components/menu'
import {
  getViewport,
  isInput,
  markActive,
  blockActive,
  canInsert,
  findNodePosition,
  getParentNodePosFromState,
  createTable,
  liftListItem,
  findSelectedNodeWithType
} from './utils'
import { Dispatch, Extension } from './types'

// extensions
import Link from './extensions/link'
import LinkDialogAdapter from './extensions/linkDialogAdapter'
import Image from './extensions/image'
import ImageDialogAdapter from './extensions/imageDialogAdapter'
import ImageWithText from './extensions/imageWithText'
import BulletList from './extensions/bullet-list'
import CustomBlock from './extensions/custom-block'
import CustomMark from './extensions/custom-mark'
import Heading from './extensions/heading'
import ListItem from './extensions/list-item'
import Blockquote from './extensions/blockquote'
import Embed from './extensions/embed'
import Code from './extensions/code'
import MoveDown from './extensions/move-down'
import MoveUp from './extensions/move-up'
import OrderedList from './extensions/ordered-list'
import Paragraph from './extensions/paragraph'
import Strike from './extensions/strike'
import Strong from './extensions/strong'
import Table from './extensions/table'
import Trash from './extensions/trash'
import Emphasis from './extensions/emphasis'
import Underline from './extensions/underline'
import DefaultKeys from './extensions/default-keys'
import DefaultPlugins from './extensions/default-plugins'
import Expert from './extensions/expert'
import Cta from './extensions/cta'
import Product from './extensions/product'
import Extensions from './extensions'

import 'prosemirror-view/style/prosemirror.css'

export {
  /* components */
  SmartBlock,
  Button,
  EditMenu,
  Editor,
  InlineMenu,
  Menu,
  /*
    extensions
  */
  /* blocks */
  Extensions,
  Link,
  LinkDialogAdapter,
  Image,
  ImageDialogAdapter,
  ImageWithText,
  BulletList,
  CustomBlock,
  Heading,
  ListItem,
  MoveDown,
  MoveUp,
  OrderedList,
  Paragraph,
  Blockquote,
  Table,
  Embed,
  Code,
  Expert,
  Cta,
  Product,
  /* inline */
  Emphasis,
  Strike,
  Strong,
  Underline,
  CustomMark,
  Trash,
  /* utils */
  getViewport,
  isInput,
  markActive,
  blockActive,
  canInsert,
  findNodePosition,
  findSelectedNodeWithType,
  getParentNodePosFromState,
  createTable,
  liftListItem,
  /* types */
  Dispatch,
  Extension,
  /* defaults */
  DefaultKeys,
  DefaultPlugins,
  /* official */
  Plugin,
}
