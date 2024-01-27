#!/usr/bin/env python3
"""
Contains a helper function for pagination.
"""


def index_range(page: int, page_size: int) -> 'tuple[int, int]':
    """Return a tuple of size two containing a start index and an end index
    corresponding to the range of indexes to return in a list for given
    `page` (first page is page 1) and `page_size`."""
    # start_index = (page - 1) * page_size -- (page - 1 since page starts at 1)
    # end_index = start_index + page_size = (page - 1) * page_size + page_size
    # end_index = page * page_size
    return ((page - 1) * page_size, page * page_size)
