import eventsData from '@/services/mockData/events.json';

class EventsService {
  constructor() {
    this.events = [...eventsData];
  }

  async getAll() {
    await this.delay();
    return [...this.events];
  }

  async getById(id) {
    await this.delay();
    const event = this.events.find(e => e.Id === parseInt(id));
    if (!event) {
      throw new Error('Event not found');
    }
    return { ...event };
  }

  async create(eventData) {
    await this.delay();
    const newId = Math.max(...this.events.map(e => e.Id), 0) + 1;
    const newEvent = {
      Id: newId,
      ...eventData,
      completed: eventData.completed || false,
      recurring: eventData.recurring || 'none',
      googleEventId: eventData.googleEventId || null
    };
    this.events.push(newEvent);
    return { ...newEvent };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.events.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Event not found');
    }
    this.events[index] = { ...this.events[index], ...updates };
    return { ...this.events[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.events.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Event not found');
    }
    this.events.splice(index, 1);
    return true;
  }

  delay(ms = 350) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new EventsService();