import { useState } from 'react';
import { TEAM_MEMBERS } from '@/lib/team-members';
import { parseTagsFromContent, highlightTagsInContent } from '@/utils/tag-parser';

export default function TagTest() {
  const [testContent, setTestContent] = useState('');

  const handleTest = () => {
    const tags = parseTagsFromContent(testContent);
    const highlighted = highlightTagsInContent(testContent);
    
    console.log('Original content:', testContent);
    console.log('Parsed tags:', tags);
    console.log('Highlighted content:', highlighted);
    
    // Show tags found
    const foundMembers = tags.map(tag => {
      const member = TEAM_MEMBERS.find(m => m.email === tag);
      return member ? member.name : tag;
    });
    
    alert(`Tags found: ${foundMembers.join(', ')}`);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Tag Testing Component</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Comment Content
          </label>
          <textarea
            value={testContent}
            onChange={(e) => setTestContent(e.target.value)}
            placeholder="Try typing: @huzaifa please review this task or @sarim can you help with this?"
            className="w-full p-3 border border-gray-300 rounded-md"
            rows={4}
          />
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Available team members: {TEAM_MEMBERS.map(m => `@${m.id}`).join(', ')}
          </p>
        </div>
        
        <button
          onClick={handleTest}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Test Tag Parsing
        </button>
        
        {testContent && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-2">Preview:</h4>
            <div 
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: highlightTagsInContent(testContent) }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
