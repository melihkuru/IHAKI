from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render, redirect


def login_process(request):
    global user
    if request.user.is_authenticated:
        return redirect('/AeroLease')

    if request.method == 'GET':
        context = ''
        return render(request, 'aero_lease_login.html', {'context': context})

    if request.method == 'POST':
        email = request.POST.get('email', '')
        password = request.POST.get('password', '')
        try:
            user = User.objects.get(email=email)
        except ObjectDoesNotExist:
            context = {
                'error_message': 'Email adresiyle eşleşen bir hesap bulunamadı. Lütfen mail adresinizi kontrol ediniz.'}
            return render(request, 'aero_lease_login.html', context)

        user = authenticate(request, username=user.username, password=password)
        if user is not None:
            login(request, user)
            return redirect("/AeroLease")
        else:
            context = {'error_message': 'Girdiğiniz şifre bilgisi yanlıştır. Lütfen şifrenizi kontrol ediniz.'}
            return render(request, 'aero_lease_login.html', context)

def signup_process(request):
    global user
    if request.user.is_authenticated:
        return redirect('/AeroLease')

    if request.method == 'GET':
        context = ''
        return render(request, 'aero_lease_sign_up.html', {'context': context})

    if request.method == 'POST':
        email = request.POST.get('email', '')
        password = request.POST.get('password', '')
        try:
            user = User.objects.get(email=email)
        except ObjectDoesNotExist:
            context = {
                'error_message': 'Email adresiyle eşleşen bir hesap bulunamadı. Lütfen mail adresinizi kontrol ediniz.'}
            return render(request, 'aero_lease_sign_up.html', context)

        user = authenticate(request, username=user.username, password=password)
        if user is not None:
            login(request, user)
            return redirect("/AeroLease")
        else:
            context = {'error_message': 'Girdiğiniz şifre bilgisi yanlıştır. Lütfen şifrenizi kontrol ediniz.'}
            return render(request, 'aero_lease_sign_up.html', context)

@login_required
def app_view(request):
    return render(request, 'aero_lease_app.html')
