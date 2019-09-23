export const URL = '/api/image/upload';

export interface EditorToolbarItem {
  class?: string;
  style?: any;
  caption?: string;
  tooltip?: string;
  command?: string;
  val?: any;
  children?: EditorToolbarItem[];
  childrenInline?: boolean;
}

export let toolbarItems: EditorToolbarItem[] = [
  // {
  //   class: 'iconfont icon-template',
  //   tooltip: '模板',
  //   command: 'templates'
  // },
  // {
  //   class: 'separator'
  // },
  // {
  //   class: 'iconfont icon-reply',
  //   tooltip: '撤销',
  //   command: 'undo'
  // },
  // {
  //   class: 'iconfont icon-redo',
  //   tooltip: '重做',
  //   command: 'redo'
  // },
  // {
  //   class: 'separator'
  // },
  {
    class: 'iconfont icon-header',
    tooltip: '标题和文本',
    children: [
      {
        caption: '标题 1',
        command: 'formatBlock',
        val: 'h1'
      },
      {
        caption: '标题 2',
        command: 'formatBlock',
        val: 'h2'
      },
      {
        caption: '标题 3',
        command: 'formatBlock',
        val: 'h3'
      },
      {
        caption: '标题 4',
        command: 'formatBlock',
        val: 'h4'
      },
      {
        caption: '标题 5',
        command: 'formatBlock',
        val: 'h5'
      },
      {
        class: 'separator'
      },
      {
        caption: '普通文本',
        command: 'formatBlock',
        val: 'div'
      }
    ]
  },
  {
    class: 'iconfont icon-bold',
    tooltip: '加粗',
    command: 'bold'
  },
  {
    class: 'iconfont icon-italic',
    tooltip: '斜体',
    command: 'italic'
  },
  {
    class: 'iconfont icon-underline',
    tooltip: '下划线',
    command: 'underline'
  },
  {
    class: 'iconfont icon-strikethrough',
    tooltip: '删除线',
    command: 'strikethrough'
  },
  {
    class: 'separator'
  },
  {
    class: 'iconfont icon-align-left',
    tooltip: '左对齐',
    command: 'justifyLeft'
  },
  {
    class: 'iconfont icon-align-center',
    tooltip: '居中对齐',
    command: 'justifyCenter'
  },
  {
    class: 'iconfont icon-align-right',
    tooltip: '右对齐',
    command: 'justifyRight'
  },
  {
    class: 'iconfont icon-list-ol',
    tooltip: '有序列表',
    command: 'insertOrderedList'
  },
  {
    class: 'iconfont icon-list-ul',
    tooltip: '无序列表',
    command: 'insertUnorderedList'
  },
  {
    class: 'iconfont icon-indent',
    tooltip: '增加缩进',
    command: 'indent'
  },
  {
    class: 'iconfont icon-outdent',
    tooltip: '减少缩进',
    command: 'outdent'
  },
  {
    class: 'separator'
  },
  {
    class: 'iconfont icon-font',
    tooltip: '字体',
    children: [
      {
        caption: '宋体',
        command: 'fontName',
        val: 'SimSun'
      },
      {
        caption: '微软雅黑',
        command: 'fontName',
        val: 'Microsoft YaHei'
      },
      {
        caption: '楷体',
        command: 'fontName',
        val: 'SimKai'
      },
      {
        caption: '黑体',
        command: 'fontName',
        val: 'SimHei'
      },
      {
        caption: '隶书',
        command: 'fontName',
        val: 'SimLi'
      },
      {
        style: { 'white-space': 'nowrap' },
        caption: 'andale mono',
        command: 'fontName',
        val: 'andale mono'
      },
      {
        caption: 'arial',
        command: 'fontName',
        val: 'arial'
      },
      {
        style: { 'white-space': 'nowrap' },
        caption: 'arial black',
        command: 'fontName',
        val: 'arial black,avant garde'
      },
      {
        style: { 'white-space': 'nowrap' },
        caption: 'comic sans ms',
        command: 'fontName',
        val: 'comic sans ms'
      },
      {
        caption: 'helvetica',
        command: 'fontName',
        val: 'helvetica'
      },
      {
        caption: 'impact',
        command: 'fontName',
        val: 'impact,chicago'
      },
      {
        style: { 'white-space': 'nowrap' },
        caption: 'sans-serif',
        command: 'fontName',
        val: 'sans-serif'
      },
      {
        style: { 'white-space': 'nowrap' },
        caption: 'times new roman',
        command: 'fontName',
        val: 'times new roman'
      }
    ]
  },
  {
    class: 'iconfont icon-text-width',
    tooltip: '字体大小',
    children: [
      {
        caption: '10px',
        command: 'fontSize',
        val: 1
      },
      {
        caption: '12px',
        command: 'fontSize',
        val: 2
      },
      {
        caption: '16px',
        command: 'fontSize',
        val: 3
      },
      {
        caption: '18px',
        command: 'fontSize',
        val: 4
      },
      {
        caption: '24px',
        command: 'fontSize',
        val: 5
      },
      {
        caption: '32px',
        command: 'fontSize',
        val: 6
      },
      {
        caption: '48px',
        command: 'fontSize',
        val: 7
      }
    ]
  },
  {
    class: 'iconfont icon-color',
    tooltip: '字体颜色',
    childrenInline: true,
    children: [
      {
        class: 'color-button',
        command: 'foreColor',
        val: '#ff4d4f',
        style: { 'background-color': '#ff4d4f' }
      },
      {
        class: 'color-button',
        command: 'foreColor',
        val: '#fa541c',
        style: { 'background-color': '#fa541c' }
      },
      {
        class: 'color-button',
        command: 'foreColor',
        val: '#fa8c16',
        style: { 'background-color': '#fa8c16' }
      },
      {
        class: 'color-button',
        command: 'foreColor',
        val: '#faad14',
        style: { 'background-color': '#faad14' }
      },
      {
        class: 'color-button',
        command: 'foreColor',
        val: '#eb2f96',
        style: { 'background-color': '#eb2f96' }
      },
      {
        class: 'color-button',
        command: 'foreColor',
        val: '#7cb305',
        style: { 'background-color': '#7cb305' }
      },
      {
        class: 'color-button',
        command: 'foreColor',
        val: '#389e0d',
        style: { 'background-color': '#389e0d' }
      },
      {
        class: 'color-button',
        command: 'foreColor',
        val: '#08979c',
        style: { 'background-color': '#08979c' }
      },
      {
        class: 'color-button',
        command: 'foreColor',
        val: '#096dd9',
        style: { 'background-color': '#096dd9' }
      },
      {
        class: 'color-button',
        command: 'foreColor',
        val: '#1d39c4',
        style: { 'background-color': '#1d39c4' }
      },
      {
        class: 'color-button',
        command: 'foreColor',
        val: '#fff',
        style: { 'background-color': '#fff', border: '1px solid #f60' }
      },
      {
        class: 'color-button',
        command: 'foreColor',
        val: '#000',
        style: { 'background-color': '#000' }
      }
    ]
  },
  {
    class: 'iconfont icon-bk-color',
    tooltip: '背景颜色',
    childrenInline: true,
    children: [
      {
        class: 'color-button',
        command: 'backColor',
        val: '#ff4d4f',
        style: { 'background-color': '#ff4d4f' }
      },
      {
        class: 'color-button',
        command: 'backColor',
        val: '#fa541c',
        style: { 'background-color': '#fa541c' }
      },
      {
        class: 'color-button',
        command: 'backColor',
        val: '#fa8c16',
        style: { 'background-color': '#fa8c16' }
      },
      {
        class: 'color-button',
        command: 'backColor',
        val: '#faad14',
        style: { 'background-color': '#faad14' }
      },
      {
        class: 'color-button',
        command: 'backColor',
        val: '#eb2f96',
        style: { 'background-color': '#eb2f96' }
      },
      {
        class: 'color-button',
        command: 'backColor',
        val: '#7cb305',
        style: { 'background-color': '#7cb305' }
      },
      {
        class: 'color-button',
        command: 'backColor',
        val: '#389e0d',
        style: { 'background-color': '#389e0d' }
      },
      {
        class: 'color-button',
        command: 'backColor',
        val: '#08979c',
        style: { 'background-color': '#08979c' }
      },
      {
        class: 'color-button',
        command: 'backColor',
        val: '#096dd9',
        style: { 'background-color': '#096dd9' }
      },
      {
        class: 'color-button',
        command: 'backColor',
        val: '#1d39c4',
        style: { 'background-color': '#1d39c4' }
      },
      {
        class: 'color-button',
        command: 'backColor',
        val: '#fff',
        style: { 'background-color': '#fff', border: '1px solid #f60' }
      },
      {
        class: 'color-button',
        command: 'backColor',
        val: '#000',
        style: { 'background-color': '#000' }
      }
    ]
  },
  {
    class: 'iconfont icon-eraser',
    tooltip: '清除格式',
    command: 'removeFormat'
  },
  {
    class: 'separator'
  },
  {
    class: 'iconfont icon-link',
    tooltip: '插入链接',
    command: 'createLink'
  },
  {
    class: 'iconfont icon-image',
    tooltip: '插入图片',
    children: [
      {
        caption: '图片链接',
        command: 'insertImage'
      },
      {
        caption: '本地图片',
        command: 'localImage'
      }
      // {
      //   caption: '图片库',
      //   command: 'remoteImage'
      // }
    ]
  },
  {
    class: 'iconfont icon-quote',
    tooltip: '引用',
    command: 'formatBlock',
    val: 'blockquote'
  },
  {
    class: 'separator'
  },
  {
    class: 'iconfont icon-html',
    tooltip: '查看html源码',
    command: 'html'
  }
];
