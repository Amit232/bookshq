#!/usr/bin/env python
import sys
import isbnlib
from collections import defaultdict
import json
import time

# Creating a multi-dimensional dictionary
books_isbn_dict = defaultdict(dict)


def get_all_books_from_txt_file(path_to_text_file):
    """
    This will get all the books from a .txt file passed as command line argument
    """
    query_list = []
    print path_to_text_file
    file_name = path_to_text_file
    with open(file_name) as file_handler:
            for line in file_handler:
                # Stripping the line because each line is a string which ends with "\n".
                # "\n" will throw an error when used with isbn tools
                query = line.strip()
                query_list.append(query)

    return query_list


def get_isbn_from_words(query_list):
    """
    This method will the necessary metadata to a json file ( ISBN, Author and description)
    This method will return a list of ISBNs for the book titles.
    :return : list of isbns
    :rtype : list
    """
    try:
        count = 0
        failed_books = []
        successful_books_list = []
        for query in query_list:
            # 10 digit or 13 digit isbn received
            isbn = isbnlib.isbn_from_words(query)
            if isbn == None:
                print "Failed to get isbn for ", query
                continue

            # The string returned from desc() functiuon is a unicode string.hence encoding it to ascii.

            description = isbnlib.desc(isbn)
            # It is observed that for some books isbn_desc() returns None.
            # Capturing such data and continue with the next book.
            if description != None:
                description = description.encode('ascii', 'ignore')
            else:
                print "Failed to get description for isbn ", query
                failed_books.append(query)
                continue
            # "\n" is continued as a string and not interpreted as a new line.
            # Hence the following line.
            final_description = description.replace("\n", " ")

            # Same as above. Encoding it to ascii
            meta_data_dict = isbnlib.meta(isbn)
            if meta_data_dict == None:
                print "No metadata present for the book with isbn ", query
                failed_books.append(query)
                continue
            else:
                author = meta_data_dict["Authors"][0].encode('ascii', 'ignore')
            if type(author) == None:
                print "Failed to get author for isbn ", query
                failed_books.append(query)
                continue
            books_isbn_dict[query]["isbn"] = isbn
            books_isbn_dict[query]["description"] = final_description
            books_isbn_dict[query]["author"] = author
            successful_books_list.append(query)

            # Writing data to json file
            try:
                with open('book_data_base.json', 'w') as json_file_handler:
                    json.dump(dict(books_isbn_dict), json_file_handler, indent=4)
            except Exception as ex:
                print "This exception occured while printing to the json file"
                print ex
    except Exception as ex:
        print "Failed to open the file handler"
        print ex

    print len(successful_books_list)

    # print "Failed to get the data for" + str(len(failed_books)) + "books"
    # put_all_failed_books_in_a_list(failed_books)
    # put_all_successful_books_in_a_list(successful_books_list)

# def put_all_failed_books_in_a_list(failed_books_list):
#     """
#     This method is will write out all the books into a .txt file
#     """
#     if failed_books_list is not None:
#         with open("failed_books_list.txt", "w+") as failed_books_file_handler:
#             for item in failed_books_list:
#                 failed_books_file_handler.write(item)
#                 failed_books_file_handler.write("\n")
#
#
# def put_all_successful_books_in_a_list(successful_books_list):
#     """
#     This method is will write out all the books into a .txt file
#     """
#     if successful_books_list is not None:
#         with open("successful_books_list.txt", "w+") as successful_books_list_handler:
#             for item in successful_books_list_handler:
#                 successful_books_list_handler.write(item)
#                 successful_books_list_handler.write("\n")
#

# def retry_logic():
#     """
#     This method is used to retry for all the books if we receive a 403 Are you making yoo many requests error?
#     """
#     total_books_list = get_all_books_from_txt_file(sys.argv[1])
#     failed_books_list = get_all_books_from_txt_file("failed_books_list.txt")
#     successful_books_list = get_all_books_from_txt_file("successful_books_list.txt")
#
#     # Applying retry logic for books : total books - failed_books - successful_books
#     retry_list = list(set(total_books_list) - (set(failed_books_list) | set(successful_books_list)))
#
#     get_isbn_from_words(retry_list)

path_to_file = sys.argv[1]
query_list_from_file = get_all_books_from_txt_file(path_to_file)
get_isbn_from_words(query_list_from_file)

# retry_logic()