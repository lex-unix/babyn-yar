<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { Editor, type JSONContent } from '@tiptap/core'
  import { extensions } from '$lib/editor-extensions'
  import {
    BoldIcon,
    PilcrowIcon,
    ListIcon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    ListOrderedIcon,
    ItalicIcon,
    StrikethroughIcon,
    UnderlineIcon,
    AlignCenterIcon,
    AlignLeftIcon,
    AlignRightIcon,
    ImageIcon,
    VideoIcon,
    LinkIcon,
    UnlinkIcon,
    CornerDownLeftIcon,
    YoutubeIcon
  } from 'lucide-svelte'
  import { AssetDialog, LinkDialog, EditorCommand } from '$components'
  import YouTubeVideoDialog from './YouTubeVideoDialog.svelte'

  export let content: JSONContent

  let element: HTMLDivElement
  let editor: Editor
  let assetsDialog: AssetDialog
  let linkDialog: LinkDialog
  let youtubeDialog: YouTubeVideoDialog

  function selectAsset(e: CustomEvent<{ url: string; type: string }>) {
    const { url, type } = e.detail
    assetsDialog.close()
    if (type === 'image') {
      editor.commands.setImage({ src: url })
    } else {
      editor.commands.setVideo(url)
    }
  }

  type LinkProps = Parameters<typeof editor.commands.setLink>[0]

  function addLink(
    e: CustomEvent<{ type: 'email' | 'internal' | 'external'; value: string }>
  ) {
    linkDialog.close()
    const { value, type } = e.detail
    if (!value) return

    const linkProps: LinkProps = { href: '' }

    if (type === 'email') {
      linkProps.href = 'mailto:' + value
    } else if (type === 'external') {
      linkProps.href = value
      linkProps.target = '_blank'
    } else {
      linkProps.href = value
      linkProps.target = null
    }

    editor.chain().focus().setLink(linkProps).run()
  }

  function addYouTubeVideo(e: CustomEvent<{ link: string }>) {
    youtubeDialog.close()
    editor.chain().focus().setYoutubeVideo({ src: e.detail.link }).run()
  }

  onMount(() => {
    editor = new Editor({
      editorProps: {
        attributes: {
          class:
            'border p-4 rounded-br rounded-bl min-h-[300px] bg-white outline-none'
        }
      },
      element: element,
      extensions,
      content,
      onTransaction: () => {
        editor = editor
      },
      onUpdate: () => {
        content = editor.getJSON()
      }
    })
  })

  onDestroy(() => {
    if (editor) {
      editor.destroy()
    }
  })
</script>

<div>
  {#if editor}
    <div
      class="min-w-full overflow-x-auto rounded-tl rounded-tr border border-b-0 bg-white"
    >
      <div class="flex items-center gap-1 p-2">
        <EditorCommand
          on:click={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          tooltip="Заголовок 1"
        >
          <Heading1Icon size={16} />
        </EditorCommand>
        <EditorCommand
          on:click={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          tooltip="Заголовок 2"
        >
          <Heading2Icon size={16} />
        </EditorCommand>
        <EditorCommand
          on:click={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          tooltip="Заголовок 3"
        >
          <Heading3Icon size={16} />
        </EditorCommand>
        <EditorCommand
          on:click={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive('paragraph')}
          tooltip="Параграф"
        >
          <PilcrowIcon size={16} />
        </EditorCommand>
        <EditorCommand
          on:click={() => linkDialog.open()}
          active={editor.isActive('link')}
          tooltip="Додати посилання"
        >
          <LinkIcon size={16} />
        </EditorCommand>
        {#if editor.isActive('link')}
          <EditorCommand
            on:click={() => editor.chain().focus().unsetLink().run()}
            tooltip="Видалити посилання"
          >
            <UnlinkIcon size={16} />
          </EditorCommand>
        {/if}
        <EditorCommand
          on:click={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          tooltip="Маркерований список"
        >
          <ListIcon size={16} />
        </EditorCommand>
        <EditorCommand
          on:click={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          tooltip="Нумерований список"
        >
          <ListOrderedIcon size={16} />
        </EditorCommand>
        <div class="min-h-full w-[1px] self-stretch bg-gray-200" />
        <EditorCommand
          on:click={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          tooltip="Жирний текст"
        >
          <BoldIcon size={16} />
        </EditorCommand>
        <EditorCommand
          on:click={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          tooltip="Курсив"
        >
          <ItalicIcon size={16} />
        </EditorCommand>
        <EditorCommand
          on:click={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          tooltip="Підкреслений текст"
        >
          <UnderlineIcon size={16} />
        </EditorCommand>
        <EditorCommand
          on:click={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          tooltip="Закреслений текст"
        >
          <StrikethroughIcon size={16} />
        </EditorCommand>
        <div class="min-h-full w-[1px] self-stretch bg-gray-200" />
        <EditorCommand
          on:click={() => editor.chain().focus().setTextAlign('left').run()}
          tooltip="Вирівняти по лівому краю"
        >
          <AlignLeftIcon size={16} />
        </EditorCommand>
        <EditorCommand
          on:click={() => editor.chain().focus().setTextAlign('center').run()}
          tooltip="Вирівняти по центру"
        >
          <AlignCenterIcon size={16} />
        </EditorCommand>
        <EditorCommand
          on:click={() => editor.chain().focus().setTextAlign('right').run()}
          tooltip="Вирівняти по правому краю"
        >
          <AlignRightIcon size={16} />
        </EditorCommand>
        <EditorCommand
          on:click={() => editor.chain().focus().setHardBreak().run()}
          tooltip="Перенос рядка"
        >
          <CornerDownLeftIcon size={16} />
        </EditorCommand>
        <div class="min-h-full w-[1px] self-stretch bg-gray-200" />
        <EditorCommand
          on:click={() => assetsDialog.open('image')}
          tooltip="Додати зображення"
        >
          <ImageIcon size={16} />
        </EditorCommand>
        <EditorCommand
          on:click={() => assetsDialog.open('video')}
          tooltip="Додати відео"
        >
          <VideoIcon size={16} />
        </EditorCommand>
        <EditorCommand
          on:click={() => youtubeDialog.open()}
          tooltip="Додати YouTube відео"
        >
          <YoutubeIcon size={16} />
        </EditorCommand>
      </div>
    </div>
  {/if}
  <div bind:this={element} />
</div>

<AssetDialog bind:this={assetsDialog} on:select={selectAsset} />

<LinkDialog bind:this={linkDialog} on:done={addLink} />

<YouTubeVideoDialog bind:this={youtubeDialog} on:done={addYouTubeVideo} />
