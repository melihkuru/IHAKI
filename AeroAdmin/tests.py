from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse


class AuthViewsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='12345')

    def test_login_with_incorrect_password(self):
        response = self.client.post(reverse('aero_admin_login'),
                                    {'email': 'test@example.com', 'password': 'wrongpassword'})
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'aero_admin_login.html')
        self.assertContains(response, 'Girdiğiniz şifre bilgisi yanlıştır. Lütfen şifrenizi kontrol ediniz.')

    def test_login_with_nonexistent_email(self):
        response = self.client.post(reverse('aero_admin_login'),
                                    {'email': 'nonexistent@example.com', 'password': '12345'})
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'aero_admin_login.html')
        self.assertContains(response,
                            'Email adresiyle eşleşen bir hesap bulunamadı. Lütfen mail adresinizi kontrol ediniz.')
