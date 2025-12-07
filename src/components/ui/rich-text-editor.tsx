import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Bold, Italic, List, ListOrdered, Strikethrough, Link as LinkIcon, Heading1, Heading2, Heading3 } from 'lucide-react'
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
        <div className="flex flex-wrap items-center gap-1 p-1 border-b bg-muted/20">
            <Toggle
                size="sm"
                pressed={editor.isActive('heading', { level: 1 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                aria-label="Heading 1"
            >
                <Heading1 className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('heading', { level: 2 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                aria-label="Heading 2"
            >
                <Heading2 className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('heading', { level: 3 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                aria-label="Heading 3"
            >
                <Heading3 className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Toggle
                size="sm"
                pressed={editor.isActive('bold')}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                aria-label="Bold"
            >
                <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('italic')}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                aria-label="Italic"
            >
                <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('strike')}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                aria-label="Strikethrough"
            >
                <Strikethrough className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Toggle
                size="sm"
                pressed={editor.isActive('bulletList')}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                aria-label="Bullet List"
            >
                <List className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('orderedList')}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                aria-label="Ordered List"
            >
                <ListOrdered className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="mx-1 h-6" />

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
                aria-label="Link"
            >
                <LinkIcon className="h-4 w-4" />
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
        immediatelyRender: false // Fix for React 19 hydration mismatch in simple usage
    })

    // Sync content if value changes externally (and editor is not focused? or just allow it?)
    // Allowing 2-way sync can be tricky with cursors.
    // For this form, usually value only changes via editor, OR reset.
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            // Only update if difference is significant to avoid cursor jumps?
            // Actually, for simple forms, if value is empty (reset), we should clear.
            if (value === '' && editor.getText() !== '') {
                editor.commands.setContent('')
            }
            // If external update happened that wasn't from us:
            else if (editor.getHTML() !== value) {
                // Check if content matches roughly?
                // Simple approach: setContent. Cursors might jump if typing fast and prop updates.
                // But react-hook-form 'onChange' updates local state which feeds back 'value'.
                // So we must be careful not to create loop.
                // Typically we don't sync 'value' back to editor on every keypress if we just typed it.
                // Tiptap handles this mostly, but let's only set content if fully different (like reset).
                // editor.commands.setContent(value)
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
