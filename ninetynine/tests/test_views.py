__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

# Django imports...
from django.test import TestCase


class HomeTest(TestCase):
	def test_home_view_renders_home_template(self):
		response = self.client.get('/')

		self.assertTemplateUsed(response, 'ninetynine/home.html')