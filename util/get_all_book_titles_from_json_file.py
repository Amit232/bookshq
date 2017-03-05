__author__ = 'Amitk'
import json
import os


def get_all_json_files_in_folder():
    json_folder_path = "F:\Books_Database\\books_list_2\\"
    json_file_list = []
    for file in os.listdir(json_folder_path):
        if file.endswith(".json"):
            json_file_list.append(file)
    return json_file_list


def get_all_titles_in_json_file():
    json_files = get_all_json_files_in_folder()
    final_list = []
    for item in json_files:
        item = "F:\Books_Database\\books_list_2\\" + item
        final_list.append(item)
    for json_file in final_list:
        print "File we are dealing with now ", json_file
        with open(json_file) as json_file_handler:
            data = json.load(json_file_handler)
            dict_keys = data.keys()
            with open("all_books.txt", "a") as all_books_handler:
                for title in dict_keys:
                    all_books_handler.write(title)
                    all_books_handler.write("\n")

get_all_titles_in_json_file()
