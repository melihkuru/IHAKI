import logging
import re

from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User, Group
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.core.validators import validate_email
from django.db import transaction
from django.shortcuts import render, redirect

from Core.models import Customer, Configuration
from IHAKI.settings import env


def login_process(request):
    global user
    if request.user.is_authenticated:
        return redirect('/AeroLease')

    if request.method == 'GET':
        context = ''
        return render(request, 'aero_lease_login.html', {'context': context})

    if request.method == 'POST':
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '').strip()
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
    if request.user.is_authenticated:
        return redirect('/AeroLease')

    context = {
        'terms_conditions': Configuration.get_key("TermsAndConditions", "Sözleşme Metni Yok İse Bu Gözükecektir.")}
    if request.method == 'GET':
        return render(request, 'aero_lease_sign_up.html', context)

    if request.method == 'POST':
        email = request.POST.get('email', '').strip()
        name = request.POST.get('first-name', '').strip()
        surname = request.POST.get('last-name', '').strip()
        merchant = request.POST.get('merchant', '').strip()
        password = request.POST.get('password', '').strip()
        confirm_password = request.POST.get('confirm_password', '').strip()
        toc = request.POST.get('toc', '').strip()

        errors = []

        try:
            validate_email(email)
        except ValidationError:
            errors.append('Email adresiniz geçersidir.')

        if User.objects.filter(email=email).exists():
            errors.append('Bu email ile zaten üye olmuş görünüyorsunuz.')

        if len(password) < 8 or not re.search(r'\d', password):
            errors.append('Şifreniz için harf ve rakam karışımından oluşan 8 veya daha fazla karakter kullanın.')

        if password != confirm_password:
            errors.append('Girdiğiniz şifreler uyuşmuyor.')

        if not toc:
            errors.append('Üyelik için koşullar ve şartları kabul etmeniz gerekmektedir.')

        if errors:
            error_message = " ".join(errors)
            # Kullanıcı hata aldığında verdiği bilgileri forma tekrar veriyorum. AJAX kullansaydım gerek kalmazdı ancak
            # signup için form-submit yapıyorum.
            context["email"] = email
            context["firstname"] = name
            context["lastname"] = surname
            context["merchant"] = merchant
            context["error_message"] = error_message
            return render(request, 'aero_lease_sign_up.html', context)

        # Müşteriler için önelikle kullanıcı oluşturup ardından customer açıyorum. Bu süreçte oluşabilcek hatalar için
        # veritabanı işlemleri transaction içinde yapıyorum. Bu sayede örneğin kullanıcı kaydı açılan müşteri, müşteri
        # herhangi bir sebeple customer tablosuna yazılamazsa hatalı mantık önlenecektir.
        with transaction.atomic():
            user = User.objects.create_user(username=email, email=email, password=password, first_name=name,
                                            last_name=surname)

            group_id = int(env("IHAKI_CUSTOMER_GROUP_ID"))
            try:
                group = Group.objects.get(id=group_id)
                user.groups.add(group)
                logging.info(f"User ID {user.id} added to group ID {group.id}")
            except Group.DoesNotExist:
                logging.error(
                    f"Customer group with ID {group_id} not found. User ID {user.id} registered without customer group "
                    f"information. This may cause authorization problems. Please check your system information.")

            customer = Customer(user=user, company_name=merchant)
            customer.save()

            return render(request, 'aero_lease_login.html',
                          {'success_message': 'Üyeliğiniz başarıyla oluşturuldu. Giriş yapabilirsiniz.'})


@login_required
def app_view(request):
    return render(request, 'aero_lease_app.html')
