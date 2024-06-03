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

from django.test import TestCase, Client
from django.urls import reverse


# Temel view testleri.
class AuthViewsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='12345')
        self.group = Group.objects.create(name='CustomerGroup')
        Configuration.objects.create(key="TermsAndConditions", value="Sözleşme Metni Yok İse Bu Gözükecektir.")

    def test_login_get_request(self):
        response = self.client.get(reverse('aero_lease_login'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'aero_lease_login.html')

    def test_login_with_incorrect_password(self):
        response = self.client.post(reverse('aero_lease_login'),
                                    {'email': 'test@example.com', 'password': 'wrongpassword'})
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'aero_lease_login.html')
        self.assertContains(response, 'Girdiğiniz şifre bilgisi yanlıştır. Lütfen şifrenizi kontrol ediniz.')

    def test_login_with_nonexistent_email(self):
        response = self.client.post(reverse('aero_lease_login'),
                                    {'email': 'nonexistent@example.com', 'password': '12345'})
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'aero_lease_login.html')
        self.assertContains(response,
                            'Email adresiyle eşleşen bir hesap bulunamadı. Lütfen mail adresinizi kontrol ediniz.')

    def test_signup_get_request(self):
        response = self.client.get(reverse('aero_lease_sign_up'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'aero_lease_sign_up.html')

    def test_signup_with_valid_data(self):
        response = self.client.post(reverse('aero_lease_sign_up'), {
            'email': 'newuser@example.com',
            'first-name': 'First',
            'last-name': 'Last',
            'merchant': 'Merchant',
            'password': 'validpassword123',
            'confirm_password': 'validpassword123',
            'toc': 'on'
        })
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'aero_lease_login.html')
        self.assertContains(response, 'Üyeliğiniz başarıyla oluşturuldu. Giriş yapabilirsiniz.')
        self.assertTrue(User.objects.filter(email='newuser@example.com').exists())
        new_user = User.objects.get(email='newuser@example.com')
        self.assertTrue(Customer.objects.filter(user=new_user).exists())

    def test_signup_with_existing_email(self):
        response = self.client.post(reverse('aero_lease_sign_up'), {
            'email': 'test@example.com',
            'first-name': 'First',
            'last-name': 'Last',
            'merchant': 'Merchant',
            'password': 'validpassword123',
            'confirm_password': 'validpassword123',
            'toc': 'on'
        })
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'aero_lease_sign_up.html')
        self.assertContains(response, 'Bu email ile zaten üye olmuş görünüyorsunuz.')

    def test_signup_with_invalid_email(self):
        response = self.client.post(reverse('aero_lease_sign_up'), {
            'email': 'invalidemail',
            'first-name': 'First',
            'last-name': 'Last',
            'merchant': 'Merchant',
            'password': 'validpassword123',
            'confirm_password': 'validpassword123',
            'toc': 'on'
        })
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'aero_lease_sign_up.html')

    def test_signup_with_short_password(self):
        response = self.client.post(reverse('aero_lease_sign_up'), {
            'email': 'newuser@example.com',
            'first-name': 'First',
            'last-name': 'Last',
            'merchant': 'Merchant',
            'password': 'short',
            'confirm_password': 'short',
            'toc': 'on'
        })
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'aero_lease_sign_up.html')
        self.assertContains(response,
                            'Şifreniz için harf ve rakam karışımından oluşan 8 veya daha fazla karakter kullanın.')

    def test_signup_with_non_matching_passwords(self):
        response = self.client.post(reverse('aero_lease_sign_up'), {
            'email': 'newuser@example.com',
            'first-name': 'First',
            'last-name': 'Last',
            'merchant': 'Merchant',
            'password': 'password123',
            'confirm_password': 'differentpassword123',
            'toc': 'on'
        })
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'aero_lease_sign_up.html')
        self.assertContains(response, 'Girdiğiniz şifreler uyuşmuyor.')

    def test_signup_without_toc(self):
        response = self.client.post(reverse('aero_lease_sign_up'), {
            'email': 'newuser@example.com',
            'first-name': 'First',
            'last-name': 'Last',
            'merchant': 'Merchant',
            'password': 'validpassword123',
            'confirm_password': 'validpassword123',
        })
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'aero_lease_sign_up.html')
        self.assertContains(response, 'Üyelik için koşullar ve şartları kabul etmeniz gerekmektedir.')

    def test_app_view_authenticated(self):
        self.client.login(username='testuser', password='12345')
        response = self.client.get(reverse('app_view'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'aero_lease_app.html')

    def test_app_view_unauthenticated(self):
        response = self.client.get(reverse('app_view'))
        self.assertEqual(response.status_code, 302)
