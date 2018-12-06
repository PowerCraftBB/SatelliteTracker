from sys import stdout
from os import path
import re
import requests
from bs4 import BeautifulSoup

categories = []

""" make satelliteCategories page """

# set up constant
satelliteCategories = ''
satelliteCategories += '<h1>Choose a category to view</h1>\n'
satelliteCategories += '<a class="backButton" href="/satellites/view">Back</a>\n'
satelliteCategories += '<a class="doneButton" href="/satellites/view">Done</a>\n'
satelliteCategories += '<hr />\n\n'

# get the table
categoriesPage = requests.get('https://www.n2yo.com/satellites/')
categoriesSoup = BeautifulSoup(categoriesPage.text, 'html.parser')
categoriesTable = categoriesSoup.find(id = 'categoriestab')

satelliteCategories += '<table>\n'

# add table head
tableHead = categoriesTable.thead
satelliteCategories += '\t<thead>\n\t\t<tr>\n'
for th in tableHead.find_all('th'):
	satelliteCategories += '\t\t\t<th>'+th.text+'</th>\n'
satelliteCategories += '\t\t</tr>\n\t</thead>\n'

# add table body
satelliteCategories += '\t<tbody>\n'
for tr in categoriesTable.find_all('tr'):
	if not tr.find('td'):
		continue

	satelliteCategories += '\t\t<tr>\n'
	for td in tr.find_all('td'):
		data = str(td.text)
		satelliteCategories += '\t\t\t<td>'
		if data.isdigit():
			satelliteCategories += td.text
		else:
			categories.append(td.a.get('href'))
			satelliteCategories += '<a'
			satelliteCategories += ' class="cta blue"'
			satelliteCategories += ' href="'
			satelliteCategories += 'satellites/categories/track/'+td.text.replace(' ', '').upper()
			satelliteCategories += '"'
			satelliteCategories += '>'
			satelliteCategories += td.text
			satelliteCategories += '</a>'
		satelliteCategories += '</td>\n'
	satelliteCategories += '\t\t</tr>\n'
satelliteCategories += '\t</tbody>\n'

satelliteCategories += '</table>\n'

satelliteCategories += '<hr />\n\n'
satelliteCategories += '<a class="backButton" href="/satellites/categories">Back</a>\n'
satelliteCategories += '<a class="doneButton" href="/satellites/view">Done</a>\n'

with open(path.dirname(__file__)+'/../templates/satelliteCategories.html', 'w') as f:
	f.write(satelliteCategories)


""" make satellite category page for every category """

for category in categories:
	# set up constant
	satelliteCategory = ''
	satelliteCategory += '<h1>Track or Untrack satellites</h1>\n'
	satelliteCategory += '<a class="backButton" href="/satellites/categories">Back</a>\n'
	satelliteCategory += '<a class="doneButton" href="/satellites/view">Done</a>\n'
	satelliteCategory += '<hr />\n\n'

	# get the table
	categoryPage = requests.get('https://www.n2yo.com/satellites/'+category)
	categorySoup = BeautifulSoup(categoryPage.text, 'html.parser')
	categoryTable = categorySoup.find(id = 'categoriestab')

	satelliteCategory += '<table>\n'

	# add table head
	tableHead = categoryTable.thead.tr
	satelliteCategory += '\t<thead>\n\t\t<tr>\n'
	for th in tableHead.find_all('th'):
		satelliteCategory += '\t\t\t<th>'+th.text+'</th>\n'
	satelliteCategory += '\t\t</tr>\n\t</thead>\n'

	# add table body
	satelliteCategory += '\t<tbody>\n'
	for trackBtn in categorySoup.find_all('button'):
		tr = trackBtn.parent.parent
		satid = tr.find_all('td')[1].text

		satelliteCategory += '\t\t<tr>\n'
		for i, td in enumerate(tr.find_all('td')):
			satelliteCategory += '\t\t\t<td>'
			if i == 0:
				satelliteCategory += td.a.text
			elif i == len(tr.find_all('td'))-1:
				satelliteCategory += '<button'
				satelliteCategory += ' id="'
				satelliteCategory += satid
				satelliteCategory += '"'
				satelliteCategory += ' class="cta blue"'
				satelliteCategory += ' type="button"'
				satelliteCategory += '>'
				satelliteCategory += td.button.text
				satelliteCategory += '</button>'
			else:
				satelliteCategory += td.text
			satelliteCategory += '</td>\n'
		satelliteCategory += '\t\t</tr>\n'

	satelliteCategory += '\t</tbody>\n'

	satelliteCategory += '</table>\n'

	satelliteCategory += '<hr />\n\n'
	satelliteCategory += '<a class="backButton" href="/satellites/categories">Back</a>\n'
	satelliteCategory += '<a class="doneButton" href="/satellites/view">Done</a>\n'

	categoryName = re.sub(r'SATELLITES$', '', categorySoup.h1.text.replace(' ', ''))

	with open(path.dirname(__file__)+'/../templates/satelliteCategories/'+categoryName+'.html', 'w') as f:
		f.write(satelliteCategory.encode('utf8'))

print('Tables updated successfully!')
stdout.flush()
