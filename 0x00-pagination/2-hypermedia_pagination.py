#!/usr/bin/env python3
"""
Contains a helper function and abstraction class for pagination.
"""
import csv
import math
from typing import List, Dict, Tuple, Union


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """Return a tuple of size two containing a start index and an end index
    corresponding to the range of indexes to return in a list for given
    `page` (first page is page 1) and `page_size`."""
    return ((page - 1) * page_size, page * page_size)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """Returns the appropriate page of the dataset based on `page` and
        `page_size`, or an empty list if input arguments are out of range."""
        # assert inputs are int and greater than 0
        assert (all([type(i) == int and i > 0 for i in (page, page_size)]))

        start, end = index_range(page, page_size)
        data_size = len(self.dataset())

        if start >= data_size:  # index out of range
            return []
        if end > data_size:     # return all after start index
            end = data_size

        return self.dataset()[start:end]

    def get_hyper(self, page: int = 1, page_size: int = 10) ->\
            Dict[str, Union[int, List[List]]]:
        """Returns a dictionary containing the following key-value pairs:
        `page_size`: the length of the returned dataset page
        `page`: the current page number
        `data`: the dataset page (based on `page` and `page_size`)
        `next_page`: number of the next page, None if no next page
        `prev_page`: number of the previous page, None if no previous page
        `total_pages`: the total number of pages in the dataset as an integer
        """
        data = self.get_page(page, page_size)
        actual_page_size = len(data)
        data_size = len(self.dataset())
        total_pages = data_size // page_size
        total_pages += 1 if data_size % page_size else 0
        next_page = page + 1 if page < total_pages else None
    # prev_page = page - 1 if page > 1 and page <= total_pages + 1 else None
        prev_page = page - 1 if page > 1 else None
        return {
            'page_size': actual_page_size,
            'page': page,
            'data': data,
            'next_page': next_page,
            'prev_page': prev_page,
            'total_pages': total_pages
        }
