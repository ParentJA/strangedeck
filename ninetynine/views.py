__author__ = 'jason.a.parent@gmail (Jason Parent)'

# Django imports...
from django.shortcuts import render


def home(request):
	return render(request, 'ninetynine/home.html')