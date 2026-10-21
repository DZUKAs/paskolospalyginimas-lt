'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
export function Editor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ link: { openOnClick: false } })],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });
  return (
    <div className="editor">
      <div className="editor-toolbar">
        <button
          type="button"
          aria-label="Paryškinti"
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          Paryškinti
        </button>
        <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}>
          Kursyvas
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          Antraštė
        </button>
        <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          Sąrašas
        </button>
        <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
          Žingsniai
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Nuorodos HTTPS adresas');
            if (url && url.startsWith('https://'))
              editor?.chain().focus().setLink({ href: url }).run();
          }}
        >
          Nuoroda
        </button>
        <button type="button" onClick={() => editor?.chain().focus().undo().run()}>
          Atšaukti
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
export function Upload({ onChange }: { onChange: (url: string) => void }) {
  return (
    <label className="field">
      Įkelti paveikslėlį (JPG, PNG, WebP iki 5 MB)
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const f = new FormData();
          f.set('file', file);
          const r = await fetch('/api/upload', { method: 'POST', body: f });
          const result = await r.json();
          if (r.ok) onChange(result.url);
          else window.alert(result.error);
        }}
      />
    </label>
  );
}
