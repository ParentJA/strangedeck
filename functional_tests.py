__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

# Standard library imports...
import unittest

# Third-party imports...
from selenium import webdriver


class NewVisitorTest(unittest.TestCase):
	def setUp(self):
		self.browser = webdriver.Firefox()
		self.browser.implicitly_wait(3)

	def tearDown(self):
		self.browser.quit()

	def test_can_visit_the_homepage_and_start_a_new_game(self):
		# Jason navigates to the Strangedeck homepage...
		self.browser.get('http://localhost:8100')

		# He notices that the page title says the brand name...
		self.assertIn('Strangedeck', self.browser.title)

		# He also notices that the header says the brand name too...
		header_text = self.browser.find_element_by_tag_name('h1').text

		self.assertIn('Strangedeck', header_text)

		# He notices a button that says 'Start a new game'...
		start_button = self.browser.find_element_by_id('id-start-button')

		self.assertEqual('Start a new game', start_button.text)

		# He presses the 'Start a new game' button and it disappears...
		start_button.click()

		self.assertFalse(start_button.is_displayed())

		# He notices that a new view appears that asks him to enter his name 
		# and then press a button labeled 'Play'...
		name_input = self.browser.find_element_by_id('id-name-input')

		self.assertTrue(name_input)


if __name__ == '__main__':
	unittest.main()