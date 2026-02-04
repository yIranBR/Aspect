import NodeCache from 'node-cache';

// Cache com TTL padrão de 5 minutos (300 segundos)
// checkperiod: verifica expiração a cada 60 segundos
const cache = new NodeCache({ 
  stdTTL: 300, 
  checkperiod: 60,
  useClones: false // Melhor performance
});

// Chaves de cache
export const CACHE_KEYS = {
  EXAMS: 'exams',
  APPOINTMENTS: 'appointments',
  USERS: 'users',
};

// Funções auxiliares
export const cacheService = {
  get: <T>(key: string): T | undefined => {
    const value = cache.get<T>(key);
    if (value) {
      console.log(`[Cache] HIT: ${key}`);
    } else {
      console.log(`[Cache] MISS: ${key}`);
    }
    return value;
  },

  set: <T>(key: string, value: T, ttl?: number): boolean => {
    console.log(`[Cache] SET: ${key}`);
    if (ttl) {
      return cache.set(key, value, ttl);
    }
    return cache.set(key, value);
  },

  del: (key: string | string[]): number => {
    console.log(`[Cache] DEL: ${key}`);
    return cache.del(key);
  },

  flush: (): void => {
    console.log('[Cache] FLUSH: Limpando todo o cache');
    cache.flushAll();
  },

  // Invalidar caches relacionados
  invalidateExams: (): void => {
    cache.del(CACHE_KEYS.EXAMS);
  },

  invalidateAppointments: (): void => {
    cache.del(CACHE_KEYS.APPOINTMENTS);
  },

  invalidateUsers: (): void => {
    cache.del(CACHE_KEYS.USERS);
  },

  // Estatísticas do cache
  getStats: () => {
    return cache.getStats();
  }
};

export default cache;
