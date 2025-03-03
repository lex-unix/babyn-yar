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
  import { AssetDialog, LinkDialog, EditorCommandButton } from '$components'
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
        <EditorCommandButton
          on:click={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
        >
          <Heading1Icon size={16} />
        </EditorCommandButton>
        <EditorCommandButton
          on:click={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          <Heading2Icon size={16} />
        </EditorCommandButton>
        <EditorCommandButton
          on:click={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
        >
          <Heading3Icon size={16} />
        </EditorCommandButton>
        <EditorCommandButton
          on:click={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive('paragraph')}
        >
          <PilcrowIcon size={16} />
        </EditorCommandButton>
        <EditorCommandButton
          on:click={() => linkDialog.open()}
          active={editor.isActive('link')}
        >
          <LinkIcon size={16} />
        </EditorCommandButton>
        {#if editor.isActive('link')}
          <EditorCommandButton
            on:click={() => editor.chain().focus().unsetLink().run()}
          >
            <UnlinkIcon size={16} />
          </EditorCommandButton>
        {/if}
        <EditorCommandButton
          on:click={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <ListIcon size={16} />
        </EditorCommandButton>
        <EditorCommandButton
          on:click={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          <ListOrderedIcon size={16} />
        </EditorCommandButton>
        <div class="min-h-full w-[1px] self-stretch bg-gray-200" />
        <EditorCommandButton
          on:click={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <BoldIcon size={16} />
        </EditorCommandButton>
        <EditorCommandButton
          on:click={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <ItalicIcon size={16} />
        </EditorCommandButton>
        <EditorCommandButton
          on:click={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
        >
          <UnderlineIcon size={16} />
        </EditorCommandButton>
        <EditorCommandButton
          on:click={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
        >
          <StrikethroughIcon size={16} />
        </EditorCommandButton>
        <div class="min-h-full w-[1px] self-stretch bg-gray-200" />
        <EditorCommandButton
          on:click={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeftIcon size={16} />
        </EditorCommandButton>
        <EditorCommandButton
          on:click={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenterIcon size={16} />
        </EditorCommandButton>
        <EditorCommandButton
          on:click={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRightIcon size={16} />
        </EditorCommandButton>
        <EditorCommandButton
          on:click={() => editor.chain().focus().setHardBreak().run()}
        >
          <CornerDownLeftIcon size={16} />
        </EditorCommandButton>
        <div class="min-h-full w-[1px] self-stretch bg-gray-200" />
        <EditorCommandButton on:click={() => assetsDialog.open('image')}>
          <ImageIcon size={16} />
        </EditorCommandButton>
        <EditorCommandButton on:click={() => assetsDialog.open('video')}>
          <VideoIcon size={16} />
        </EditorCommandButton>
        <EditorCommandButton on:click={() => youtubeDialog.open()}>
          <YoutubeIcon size={16} />
        </EditorCommandButton>
      </div>
    </div>
  {/if}
  <div bind:this={element} />
</div>

<AssetDialog bind:this={assetsDialog} on:select={selectAsset} />

<LinkDialog bind:this={linkDialog} on:done={addLink} />

<YouTubeVideoDialog bind:this={youtubeDialog} on:done={addYouTubeVideo} />
