import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SearchBar({ placeholder = 'Search...', onSearch, testId }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(value.trim()), 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#636E72]" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-10 rounded-full border-2"
        data-testid={testId}
      />
    </div>
  );
}
