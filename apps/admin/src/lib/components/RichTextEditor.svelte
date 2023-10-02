<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { Editor, type JSONContent } from '@tiptap/core'
  import { extensions } from '$lib'
  import {
    BoldIcon,
    PilcrowIcon,
    ListIcon,
    HeadingIcon,
    ListOrderedIcon,
    ItalicIcon,
    StrikethroughIcon,
    UnderlineIcon,
    AlignCenterIcon,
    AlignLeftIcon,
    AlignRightIcon,
    ImageIcon,
    VideoIcon
  } from 'lucide-svelte'
  import { AssetDialog, SearchBar } from '$components'

  export let content: JSONContent

  let searchValue = ''
  let element: HTMLDivElement
  let editor: Editor
  let assetsDialog: AssetDialog

  function selectAsset(e: CustomEvent<{ url: string }>) {
    assetsDialog.closeDialog()
    editor.commands.setImage({ src: e.detail.url })
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
        <button
          type="button"
          on:click={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()}
          class:active={editor.isActive('heading', { level: 1 })}
          class="rounded p-1.5 hover:bg-gray-600/10"
        >
          <HeadingIcon size={16} />
        </button>
        <button
          type="button"
          on:click={() => editor.chain().focus().setParagraph().run()}
          class:active={editor.isActive('paragraph')}
          class="rounded p-1.5 hover:bg-gray-600/10"
        >
          <PilcrowIcon size={16} />
        </button>
        <button
          type="button"
          on:click={() => editor.chain().focus().toggleBulletList().run()}
          class:active={editor.isActive('bulletList')}
          class="rounded p-1.5 hover:bg-gray-600/10"
        >
          <ListIcon size={16} />
        </button>
        <button
          type="button"
          on:click={() => editor.chain().focus().toggleOrderedList().run()}
          class:active={editor.isActive('orderedList')}
          class="rounded p-1.5 hover:bg-gray-600/10"
        >
          <ListOrderedIcon size={16} />
        </button>
        <div class="min-h-full w-[1px] self-stretch bg-gray-800/10" />
        <button
          type="button"
          on:click={() => editor.chain().focus().toggleBold().run()}
          class:active={editor.isActive('bold')}
          class="rounded p-1.5 hover:bg-gray-600/10"
        >
          <BoldIcon size={16} />
        </button>
        <button
          type="button"
          on:click={() => editor.chain().focus().toggleItalic().run()}
          class:active={editor.isActive('italic')}
          class="rounded p-1.5 hover:bg-gray-600/10"
        >
          <ItalicIcon size={16} />
        </button>
        <button
          type="button"
          on:click={() => editor.chain().focus().toggleUnderline().run()}
          class:active={editor.isActive('underline')}
          class="rounded p-1.5 hover:bg-gray-600/10"
        >
          <UnderlineIcon size={16} />
        </button>
        <button
          type="button"
          on:click={() => editor.chain().focus().toggleStrike().run()}
          class:active={editor.isActive('strike')}
          class="rounded p-1.5 hover:bg-gray-600/10"
        >
          <StrikethroughIcon size={16} />
        </button>
        <div class="min-h-full w-[1px] self-stretch bg-gray-800/10" />
        <button
          type="button"
          on:click={() => editor.chain().focus().setTextAlign('left').run()}
          class="rounded p-1.5 hover:bg-gray-600/10"
        >
          <AlignLeftIcon size={16} />
        </button>
        <button
          type="button"
          on:click={() => editor.chain().focus().setTextAlign('center').run()}
          class="rounded p-1.5 hover:bg-gray-600/10"
        >
          <AlignCenterIcon size={16} />
        </button>
        <button
          type="button"
          on:click={() => editor.chain().focus().setTextAlign('right').run()}
          class="rounded p-1.5 hover:bg-gray-600/10"
        >
          <AlignRightIcon size={16} />
        </button>
        <div class="min-h-full w-[1px] self-stretch bg-gray-800/10" />
        <button
          type="button"
          on:click={() => assetsDialog.openDialog('image')}
          class="rounded p-1.5 hover:bg-gray-600/10"
        >
          <ImageIcon size={16} />
        </button>
        <button
          type="button"
          on:click={() => assetsDialog.openDialog('video')}
          class="rounded p-1.5 hover:bg-gray-600/10"
        >
          <VideoIcon size={16} />
        </button>
      </div>
    </div>
  {/if}
  <div bind:this={element} />
</div>

<AssetDialog bind:this={assetsDialog} on:select={selectAsset}>
  <svelte:fragment slot="title">Медіа файли</svelte:fragment>
  <svelte:fragment slot="description">Оберіть потрібний файл</svelte:fragment>
  <SearchBar bind:value={searchValue} slot="search" />
</AssetDialog>

<style lang="postcss">
  .active {
    @apply bg-gray-600/10;
  }
</style>
