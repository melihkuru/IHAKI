from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect


def home_view(request):
    return render(request, 'index.html')


from django.shortcuts import render
from django.http import HttpResponseRedirect
from urllib.parse import urlparse, parse_qs


def not_login_view(request):
    next_param = request.GET.get('next', '')

    if 'AeroAdmin' in next_param:
        return HttpResponseRedirect('/AeroAdmin/Login/')
    elif 'AeroLease' in next_param:
        return HttpResponseRedirect('/AeroLease/Login/')

    return render(request, 'index.html')

