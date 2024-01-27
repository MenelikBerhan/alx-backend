#!/usr/bin/env python3
"""
Deletion-resilient hypermedia pagination
"""

import csv
import math
from typing import List, Dict


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def indexed_dataset(self) -> Dict[int, List]:
        """Dataset indexed by sorting position, starting at 0
        """
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            truncated_dataset = dataset[:1000]
            self.__indexed_dataset = {
                i: dataset[i] for i in range(len(dataset))
            }
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """Returns a dictionary with the following key-value pairs:
        `index`: the index of the first item in the current page.
        `next_index`: the index of the first item in the next page.
        `page_size`: the current page size.
        `data`: the actual page of the dataset. `page_size` no. of pages,
            starting from `index` if it exists or next existing index."""

        indexed_data = self.indexed_dataset()
        max_index = max(indexed_data.keys())
        assert (type(index) == int and index <= max_index)

        # move index to the next existing index that is in valid range (<= max)
        while (index not in indexed_data and index < max_index):
            index += 1

        data = []
        start_index = None
        # starting from index, append page_size no. of pages to data
        while (index <= max_index and page_size):
            if index in indexed_data:
                data.append(indexed_data[index])
                page_size -= 1
                if start_index is None:     # index of the first item
                    start_index = index
            index += 1

        # move index to the next existing index after this page
        while (index not in indexed_data and index < max_index):
            index += 1

        # set valid and existing start index for next page
        next_index = index if index <= max_index else None

        page_size = len(data)   # actual returned page size

        return {
            'index': start_index,
            'next_index': next_index,
            'page_size': page_size,
            'data': data
        }
