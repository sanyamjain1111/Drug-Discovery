from functools import lru_cache
from time import time
from typing import Dict, Tuple

# Simple in-memory cache and rate limiter

class SimpleCache:
    def __init__(self, ttl_seconds: int = 300):
        self.ttl = ttl_seconds
        self.store: Dict[str, Tuple[float, str]] = {}

    def get(self, key: str):
        now = time()
        item = self.store.get(key)
        if not item:
            return None
        ts, value = item
        if now - ts > self.ttl:
            self.store.pop(key, None)
            return None
        return value

    def set(self, key: str, value: str):
        self.store[key] = (time(), value)

cache = SimpleCache(ttl_seconds=600)

class RateLimiter:
    def __init__(self, max_per_minute: int = 30):
        self.max = max_per_minute
        self.bucket: Dict[str, Tuple[int, float]] = {}

    def allow(self, key: str) -> bool:
        now = time()
        count, ts = self.bucket.get(key, (0, now))
        if now - ts > 60:
            # reset window
            self.bucket[key] = (1, now)
            return True
        if count < self.max:
            self.bucket[key] = (count + 1, ts)
            return True
        return False

rate_limiter = RateLimiter(max_per_minute=60)


def cache_key_molecule(name: str) -> str:
    return f"molecule:{name.strip().lower()}"
