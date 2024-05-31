from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect


def login_process(request):
    if request.user.is_authenticated:
        return redirect('/AeroLease')

    if request.method == 'GET':
        context = ''
        return render(request, 'admin_login.html', {'context': context})

    if request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("/AeroLease")
        else:
            context = {'error': 'Wrong credintials'}
            return render(request, 'admin_login.html', {'context': context})


@login_required
def app_view(request):
    return render(request, 'admin_app.html')