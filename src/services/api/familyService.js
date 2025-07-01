import familyData from '@/services/mockData/familyMembers.json';

class FamilyService {
  constructor() {
    this.members = [...familyData];
  }

  async getAll() {
    await this.delay();
    return [...this.members];
  }

  async getById(id) {
    await this.delay();
    const member = this.members.find(m => m.Id === parseInt(id));
    if (!member) {
      throw new Error('Family member not found');
    }
    return { ...member };
  }

  async create(memberData) {
    await this.delay();
    const newId = Math.max(...this.members.map(m => m.Id), 0) + 1;
    const newMember = {
      Id: newId,
      ...memberData,
      points: memberData.points || 0
    };
    this.members.push(newMember);
    return { ...newMember };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.members.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Family member not found');
    }
    this.members[index] = { ...this.members[index], ...updates };
    return { ...this.members[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.members.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Family member not found');
    }
    this.members.splice(index, 1);
    return true;
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new FamilyService();