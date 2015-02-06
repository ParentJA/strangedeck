__author__ = 'jason.parent@carneylabs.com (Jason Parent)'

# Django imports...
from django.contrib import messages
from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.shortcuts import redirect
from django.shortcuts import render

# Local imports...
from .forms import LogInForm
from .forms import SignUpForm


def sign_up(request):
    form = SignUpForm()

    if request.method == 'POST':
        form = SignUpForm(data=request.POST)

        if form.is_valid():
            form.save()

            username = form.cleaned_data['email']
            password = form.cleaned_data['password1']

            # Log in new user...
            return log_in(request, username, password)

    return render(request, 'strangedeck/sign_up.html', {
        'form': form
    })


def log_in(request, username, password):
    user = authenticate(username=username, password=password)

    if user is not None:
        if user.is_active:
            login(request, user)
        else:
            messages.error(request, 'Account disabled.')

    else:
        messages.error(request, 'Invalid login.')

    return redirect(reverse('home', current_app='strangedeck'))


@login_required
def log_out(request):
    logout(request)

    return redirect(reverse('home', current_app='strangedeck'))


def home(request):
    if request.user.is_authenticated():
        return render(request, 'strangedeck/home.html')

    else:
        form = LogInForm(request)

        if request.method == 'POST':
            form = LogInForm(data=request.POST)

            if form.is_valid():
                login(request, form.get_user())
            else:
                messages.error(request, 'Invalid login.')

            return redirect(reverse('home', current_app='strangedeck'))

        return render(request, 'strangedeck/log_in.html', {
            'form': form
        })