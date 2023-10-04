import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Video } from './video-extension'

export const extensions = [
  StarterKit.configure({
    heading: {
      HTMLAttributes: {
        class: 'text-2xl font-semibold my-5'
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
    },
    paragraph: {
      HTMLAttributes: {
        class: 'my-4'
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
    },
    openOnClick: false
  }),
  Image.configure({
    HTMLAttributes: {
      class: 'max-w-[400px] object-contain my-6 min-h-[120px] w-full rounded-lg'
    }
  }),
  Video.configure({
    HTMLAttributes: {
      class: 'max-w-[400px] min-h-[120px] w-full my-6'
    }
  })
]
