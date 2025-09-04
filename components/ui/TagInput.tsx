import React, { useState, KeyboardEvent } from 'react';
import { ICONS } from '../../constants';

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  label: string;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags, label }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <label htmlFor="tags-input" className="block text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">{label}</label>
      <div className="mt-1 flex flex-wrap items-center gap-2 p-2 border border-border rounded-md dark:bg-slate-700 dark:border-dark-border">
        {tags.map(tag => (
          <span key={tag} className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </span>
        ))}
        <input
          id="tags-input"
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Etiket ekle..."
          className="flex-grow bg-transparent focus:outline-none text-sm p-1"
        />
      </div>
    </div>
  );
};

export default TagInput;