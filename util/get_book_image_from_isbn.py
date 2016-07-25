import urllib, json, cStringIO
from PIL import Image
def get_book_image_from_isbn(isbn):
	url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn
	response = urllib.urlopen(url)
	data = json.loads(response.read())
	img_url = data["items"][0]["volumeInfo"]["imageLinks"]["thumbnail"]
	get_image_from_url(img_url)

def get_image_from_url(url):
	file = cStringIO.StringIO(urllib.urlopen(url).read())
	img = Image.open(file)
	img.save("output_steve_jobs.png")

get_book_image_from_isbn("9781451648546")

