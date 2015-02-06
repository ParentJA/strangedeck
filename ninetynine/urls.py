__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

# Django imports...
from django.conf.urls import patterns
from django.conf.urls import url

urlpatterns = patterns('ninetynine.views',
    url(r'^home/$', 'home', name='home'),
    url(r'^game/$', 'game', name='game'),
)