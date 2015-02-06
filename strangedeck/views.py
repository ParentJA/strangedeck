__author__ = 'jason.parent@carneylabs.com (Jason Parent)'

# Django imports...
from django.shortcuts import render


def home(request):
    return render(request, 'strangedeck/home.html')