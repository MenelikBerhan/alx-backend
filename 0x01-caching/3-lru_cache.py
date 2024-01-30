#!/usr/bin/env python3
"""
A LRU caching system
"""
from typing import Any, Type, Union
BaseCaching: Type = __import__('base_caching').BaseCaching


class LRUCache(BaseCaching):
    """Abstraction of an LRU cache."""

    def __init__(self):
        """ Initiliaze
        """
        super().__init__()
        self.queue = []

    def put(self, key, item):
        """Adds `key`: `item` pair to cache dictionary.
        If either `key` or `item` is `None`, nothing is added.
        If cache is full discards the least recently used item."""
        if key is not None and item is not None:
            if key in self.queue:
                # update time stamp for key (move to end of queue)
                self.queue.remove(key)
            elif len(self.queue) == BaseCaching.MAX_ITEMS:
                # discard least recently used key (first in queue)
                discarded_key = self.queue.pop(0)
                del self.cache_data[discarded_key]
                print('DISCARD: {}'.format(discarded_key))

            self.cache_data[key] = item
            self.queue.append(key)

    def get(self, key) -> Union[Any, None]:
        """Updates time stamp of key and returns item associated with `key`
        from cache dictionary. If `key` is not in cache, returns `None`."""
        if key in self.cache_data:
            # update time stamp for key (move to end of queue)
            self.queue.remove(key)
            self.queue.append(key)

        return self.cache_data.get(key)
