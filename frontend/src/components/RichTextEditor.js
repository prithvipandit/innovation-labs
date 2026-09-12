import { useRef } from 'react';
import { Bold, Italic, List } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function RichTextEditor({ value, onChange, required, dataTestId, placeholder }) {
  const textareaRef = useRef(null);

  const applyFormat = (type) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const selected = value.slice(selectionStart, selectionEnd);
    let insertion;

    if (type === 'bold') {
      insertion = `**${selected || 'bold text'}**`;
    } else if (type === 'italic') {
      insertion = `_${selected || 'italic text'}_`;
    } else {
      insertion = (selected || 'list item').split('\n').map((line) => `- ${line}`).join('\n');
    }

    const newValue = value.slice(0, selectionStart) + insertion + value.slice(selectionEnd);
    onChange(newValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPos = selectionStart + insertion.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  };

  return (
    <div>
      <div className="flex gap-1 mb-2">
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          className="p-1.5 rounded border hover:bg-gray-100"
          title="Bold"
          aria-label="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('italic')}
          className="p-1.5 rounded border hover:bg-gray-100"
          title="Italic"
          aria-label="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('bullet')}
          className="p-1.5 rounded border hover:bg-gray-100"
          title="Bullet list"
          aria-label="Bullet list"
        >
          <List className="w-4 h-4" />
        </button>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        data-testid={dataTestId}
        rows={10}
        className="min-h-[220px] resize-y"
      />
      <p className="text-xs text-[#636E72] mt-1">
        Supports **bold**, _italic_, "- " bullet points, and line breaks.
      </p>
    </div>
  );
}
