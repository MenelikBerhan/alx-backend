#!/usr/bin/env python3
"""
An LFU caching system
"""
from typing import Any, Type, Union
BaseCaching: Type = __import__('base_caching').BaseCaching


class LFUCache(BaseCaching):
    """Abstraction of an LFU cache."""

    def __init__(self):
        """ Initiliaze
        """
        super().__init__()
        self.queue = []         # to track access recency
        self.frequency = {}     # to track access frequency

    def put(self, key, item):
        """Adds `key`: `item` pair to cache dictionary.
        If either `key` or `item` is `None`, nothing is added.
        If cache is full discards the least frequently used item.
        If there are multiple LFU items to discard, the least
        recently used (LRU) item will be discarded."""
        if key is not None and item is not None:
            if key in self.queue:
                # update time stamp for key (move to end of queue)
                self.queue.remove(key)
            elif len(self.queue) == BaseCaching.MAX_ITEMS:
                # discard least frequently used key (lowest frequency)
                # if multiple LFU keys, discard LRU key (first in queue)
                discarded_key = sorted(
                    self.cache_data.keys(),
                    key=lambda k: (self.frequency[k], self.queue.index(k))
                    )[0]

                self.queue.remove(discarded_key)
                del self.frequency[discarded_key]
                del self.cache_data[discarded_key]
                print('DISCARD: {}'.format(discarded_key))

            self.cache_data[key] = item
            self.frequency[key] = self.frequency.get(key, 0) + 1
            self.queue.append(key)

    def get(self, key) -> Union[Any, None]:
        """Updates frequency and time stamp of key and returns item
        associated with `key` from cache dictionary.
        If `key` is not in cache, returns `None`."""
        if key in self.cache_data:
            # update frequency & time stamp for key (move to end of queue)
            self.frequency[key] += 1
            self.queue.remove(key)
            self.queue.append(key)

        return self.cache_data.get(key)
