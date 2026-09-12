import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

export default function RichText({ text, className = '' }) {
  if (!text) return null;
  return (
    <div className={`text-sm leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_em]:italic [&_p]:mb-2 last:[&_p]:mb-0 ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkBreaks]}>{text}</ReactMarkdown>
    </div>
  );
}
