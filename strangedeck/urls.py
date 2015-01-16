__author__ = 'jason.a.parent@gmail.com (Jason Parent)'

# Django imports...
from django.conf.urls import include
from django.conf.urls import patterns
from django.conf.urls import url
from django.contrib import admin

urlpatterns = patterns('',
	url(r'^$', 'ninetynine.views.home', name='home'),
	url(r'^ninetynine/', include('ninetynine.urls')),
    url(r'^admin/', include(admin.site.urls)),
)