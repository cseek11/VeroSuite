/* eslint-disable no-undef */
// Legacy JS utility - to be refactored to TS in future cleanup

export class DataAdapter {
  constructor({ source = [], map = {}, transport } = {}) { this.source = source; this.map = map; this.transport = transport; }
  _applyMap(item, inverse=false) { return item; }
  async read(range) { if (this.transport?.read) return typeof this.transport.read === 'function' ? this.transport.read(range) : fetch(this.transport.read+`?start=${range.start.toISOString()}&end=${range.end.toISOString()}`).then(r=>r.json()); return this.source.filter(e=> new Date(e.start) >= range.start && new Date(e.end) <= range.end); }
  async create(item) { this.source.push(item); return item; }
  async update(id, patch) { const idx = this.source.findIndex(x=>x.id===id); if (idx>=0) this.source[idx] = { ...this.source[idx], ...patch }; return this.source[idx]; }
  async remove(id) { this.source = this.source.filter(x=>x.id!==id); }
}




