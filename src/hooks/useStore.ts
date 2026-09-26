const mem: Record<string, unknown> = {};

export const store = {
  get<T>(k: string, d: T): T {
    try {
      const v = localStorage.getItem(k);
      return v === null ? (k in mem ? (mem[k] as T) : d) : JSON.parse(v);
    } catch {
      return k in mem ? (mem[k] as T) : d;
    }
  },
  set<T>(k: string, v: T): void {
    mem[k] = v;
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {
      // localStorage blocked (private browsing)
    }
  },
};
