from django.test import TestCase
from django.contrib.auth.models import User
from .models import Category
from .serializers import CategorySerializer


# Varlıkların unit testi...
class CategoryModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')

    def test_category_creation(self):
        # kategori oluşturma testi
        category = Category.objects.create(
            name='Test Category',
            description='This is a test category.',
            lease_disabled=False,
            created_by=self.user
        )
        self.assertEqual(category.name, 'Test Category')
        self.assertEqual(category.description, 'This is a test category.')
        self.assertFalse(category.lease_disabled)
        self.assertEqual(category.created_by, self.user)

    def test_category_str(self):
        # __str__ metod testi.
        category = Category.objects.create(
            name='Test Category',
            description='This is a test category.',
            lease_disabled=False,
            created_by=self.user
        )
        self.assertEqual(str(category), 'Test Category')

    def test_category_unique_name(self):
        # Aynı isimde iki kategori oluşturulamayacağını testi
        Category.objects.create(
            name='Unique Category',
            description='This is a unique category.',
            lease_disabled=False,
            created_by=self.user
        )
        with self.assertRaises(Exception):
            Category.objects.create(
                name='Unique Category',
                description='This is another unique category.',
                lease_disabled=False,
                created_by=self.user
            )

    def test_category_auto_dates(self):
        category = Category.objects.create(
            name='Date Test Category',
            description='Testing auto dates.',
            lease_disabled=False,
            created_by=self.user
        )
        self.assertIsNotNone(category.create_date)
        self.assertIsNotNone(category.update_date)

    def test_category_update_date(self):
        category = Category.objects.create(
            name='Update Date Test Category',
            description='Testing update date.',
            lease_disabled=False,
            created_by=self.user
        )
        old_update_date = category.update_date
        category.name = 'Updated Category Name'
        category.save()
        self.assertNotEqual(category.update_date, old_update_date)


class CategorySerializerTest(TestCase):
    def setUp(self):
        self.category_data = {'name': 'Test Category'}
        self.category = Category.objects.create(**self.category_data)

    def test_valid_category_serializer(self):
        serializer = CategorySerializer(instance=self.category)
        data = serializer.data
        self.assertEqual(data['name'], self.category_data['name'])
