import { TEAM_MEMBERS } from '@/lib/team-members';

// Parse tags from comment content (e.g., "@huzaifa @sarim")
export const parseTagsFromContent = (content: string): string[] => {
  const tagRegex = /@(\w+)/g;
  const matches = content.match(tagRegex);
  
  if (!matches) return [];
  
  // Extract usernames and find corresponding emails
  const tags: string[] = [];
  matches.forEach(match => {
    const username = match.substring(1); // Remove @ symbol
    const member = TEAM_MEMBERS.find(m => 
      m.id.toLowerCase() === username.toLowerCase() ||
      m.name.toLowerCase() === username.toLowerCase()
    );
    
    if (member) {
      tags.push(member.email);
    }
  });
  
  return tags;
};

// Highlight tags in comment content for display
export const highlightTagsInContent = (content: string): string => {
  return content.replace(
    /@(\w+)/g,
    (match, username) => {
      const member = TEAM_MEMBERS.find(m => 
        m.id.toLowerCase() === username.toLowerCase() ||
        m.name.toLowerCase() === username.toLowerCase()
      );
      
      if (member) {
        return `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">@${member.name}</span>`;
      }
      
      return match; // Return original if no match found
    }
  );
};

// Get suggested tags based on input
export const getTagSuggestions = (input: string): string[] => {
  if (!input.startsWith('@')) return [];
  
  const query = input.substring(1).toLowerCase();
  return TEAM_MEMBERS
    .filter(member => 
      member.id.toLowerCase().includes(query) ||
      member.name.toLowerCase().includes(query)
    )
    .map(member => member.id);
};

// Format tags for display
export const formatTagsForDisplay = (tags: string[]): string[] => {
  return tags.map(tag => {
    const member = TEAM_MEMBERS.find(m => m.email === tag);
    return member ? `@${member.name}` : tag;
  });
};

// Check if content contains valid tags
export const hasValidTags = (content: string): boolean => {
  const tags = parseTagsFromContent(content);
  return tags.length > 0;
};
