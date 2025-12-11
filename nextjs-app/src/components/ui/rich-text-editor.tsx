'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import {
    Bold, Italic, List, ListOrdered, Strikethrough, Link as LinkIcon,
    Heading1, Heading2, Heading3,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Type, X
} from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/20">
            {/* Headers / Size */}
            <Toggle
                size="sm"
                pressed={editor.isActive('heading', { level: 1 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                title="Título 1"
            >
                <Heading1 className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('heading', { level: 2 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                title="Título 2"
            >
                <Heading2 className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('heading', { level: 3 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                title="Título 3"
            >
                <Heading3 className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="mx-1 h-6" />

            {/* Formatting */}
            <Toggle
                size="sm"
                pressed={editor.isActive('bold')}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                title="Negrito"
            >
                <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('italic')}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                title="Itálico"
            >
                <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('strike')}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                title="Tachado"
            >
                <Strikethrough className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="mx-1 h-6" />

            {/* Alignment */}
            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: 'left' })}
                onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                title="Alinhar à Esquerda"
            >
                <AlignLeft className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: 'center' })}
                onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                title="Centralizar"
            >
                <AlignCenter className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: 'right' })}
                onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                title="Alinhar à Direita"
            >
                <AlignRight className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: 'justify' })}
                onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}
                title="Justificar"
            >
                <AlignJustify className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="mx-1 h-6" />

            {/* Font Family selector (Simplified) */}
            <Toggle
                size="sm"
                pressed={editor.isActive('textStyle', { fontFamily: 'Inter' })}
                onPressedChange={() => editor.chain().focus().setFontFamily('Inter').run()}
                title="Fonte Padrão (Sans)"
            >
                <span className="text-xs font-sans font-bold">Sans</span>
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('textStyle', { fontFamily: 'serif' })}
                onPressedChange={() => editor.chain().focus().setFontFamily('serif').run()}
                title="Fonte Serifada"
            >
                <span className="text-xs font-serif font-bold">Serif</span>
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('textStyle', { fontFamily: 'monospace' })}
                onPressedChange={() => editor.chain().focus().setFontFamily('monospace').run()}
                title="Fonte Monoespaçada"
            >
                <span className="text-xs font-mono font-bold">Mono</span>
            </Toggle>


            <Separator orientation="vertical" className="mx-1 h-6" />

            {/* Lists */}
            <Toggle
                size="sm"
                pressed={editor.isActive('bulletList')}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                title="Lista com Marcadores"
            >
                <List className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('orderedList')}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                title="Lista Numerada"
            >
                <ListOrdered className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="mx-1 h-6" />

            {/* Link & Clear */}
            <Toggle
                size="sm"
                pressed={editor.isActive('link')}
                onPressedChange={() => {
                    if (editor.isActive('link')) {
                        editor.chain().focus().unsetLink().run()
                    } else {
                        const url = window.prompt('URL do link:')
                        if (url) {
                            editor.chain().focus().setLink({ href: url }).run()
                        }
                    }
                }}
                title="Inserir Link"
            >
                <LinkIcon className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                onPressedChange={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                title="Limpar Formatação"
            >
                <X className="h-4 w-4" />
            </Toggle>
        </div>
    )
}

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            FontFamily,
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none p-4 min-h-[150px] outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        immediatelyRender: false
    })

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            if (value === '' && editor.getText() !== '') {
                editor.commands.setContent('')
            }
            else if (editor.getHTML() !== value) {
                // Optional: Sync back if needed
            }
        }
    }, [value, editor])

    return (
        <div className={cn("border rounded-md overflow-hidden bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2", className)}>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}
