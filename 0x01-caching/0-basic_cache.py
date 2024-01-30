#!/usr/bin/env python3
"""
BasicCache caching system
"""
from typing import Any, Type, Union
BaseCaching: Type = __import__('base_caching').BaseCaching


class BasicCache(BaseCaching):
    """Abstraction of a basic cache without a limit."""

    def put(self, key, item):
        """Adds `key`: `item` pair to cache dictionary.
        If either `key` or `item` is `None`, nothing is added."""
        if key is not None and item is not None:
            self.cache_data[key] = item

    def get(self, key) -> Union[Any, None]:
        """Returns item associated with `key` from cache dictionary.
        If `key` is not in cache or is `None`, returns `None`."""
        return self.cache_data.get(key)
