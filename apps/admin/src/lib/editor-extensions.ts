import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'

export const extensions = [
  StarterKit.configure({
    heading: {
      HTMLAttributes: {
        class: 'text-2xl font-semibold mb-5'
      },
      levels: [1, 2]
    },
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc pl-6 my-2'
      }
    },
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal pl-6 my-2'
      }
    }
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
    alignments: ['left', 'center', 'right']
  }),
  Underline.configure({
    HTMLAttributes: {
      class: 'underline underline-offset-4'
    }
  }),
  Link.configure({
    HTMLAttributes: {
      class: 'underline text-blue-500'
    }
  })
]
