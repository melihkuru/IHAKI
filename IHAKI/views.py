from datetime import datetime
from django.shortcuts import render
from django.http import HttpResponseRedirect


def home_view(request):
    context = {
        'year': datetime.now().year,
    }
    return render(request, 'index.html', context)


def not_login_view(request):
    next_param = request.GET.get('next', '')
    if 'AeroAdmin' in next_param:
        return HttpResponseRedirect('/AeroAdmin/Login/')
    elif 'AeroLease' in next_param:
        return HttpResponseRedirect('/AeroLease/Login/')
    return home_view(request)
