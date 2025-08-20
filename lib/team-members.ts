export interface TeamMember {
  id: string;
  name: string;
  email: string;
  initials: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'huzaifa',
    name: 'Huzaifa',
    email: 'huzaifa@nyrix.co',
    initials: 'H'
  },
  {
    id: 'sarim',
    name: 'Sarim',
    email: 'sarim@nyrix.co',
    initials: 'S'
  },
  {
    id: 'talha',
    name: 'Talha',
    email: 'talhaone1234@gmail.com',
    initials: 'T'
  },
  {
    id: 'hashir',
    name: 'Hashir',
    email: 'muhammadhashirsiddiqui2@gmail.com',
    initials: 'H'
  }
];

export const getTeamMemberByEmail = (email: string): TeamMember | undefined => {
  return TEAM_MEMBERS.find(member => member.email === email);
};

export const getTeamMemberById = (id: string): TeamMember | undefined => {
  return TEAM_MEMBERS.find(member => member.id === id);
};

export const getTeamMemberByName = (name: string): TeamMember | undefined => {
  return TEAM_MEMBERS.find(member => 
    member.name.toLowerCase() === name.toLowerCase()
  );
};
