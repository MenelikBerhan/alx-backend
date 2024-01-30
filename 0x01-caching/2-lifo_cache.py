#!/usr/bin/env python3
"""
A LIFO caching system
"""
from typing import Any, Type, Union
BaseCaching: Type = __import__('base_caching').BaseCaching


class LIFOCache(BaseCaching):
    """Abstraction of a LIFO cache."""

    def __init__(self):
        """ Initiliaze
        """
        super().__init__()
        self.queue = []

    def put(self, key, item):
        """Adds `key`: `item` pair to cache dictionary.
        If either `key` or `item` is `None`, nothing is added.
        If cache is full discards the last item put in cache."""
        if key is not None and item is not None:
            if key in self.queue:
                # move key to end of queue
                self.queue.remove(key)
            elif len(self.queue) == BaseCaching.MAX_ITEMS:
                # discard last key in queue
                discarded_key = self.queue.pop()
                del self.cache_data[discarded_key]
                print('DISCARD: {}'.format(discarded_key))

            self.cache_data[key] = item
            self.queue.append(key)

    def get(self, key) -> Union[Any, None]:
        """Returns item associated with `key` from cache dictionary.
        If `key` is not in cache or is `None`, returns `None`."""
        return self.cache_data.get(key)
