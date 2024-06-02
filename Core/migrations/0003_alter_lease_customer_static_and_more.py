# Generated by Django 4.2.13 on 2024-06-02 21:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Core', '0002_alter_uav_flight_range_alter_uav_last_latitude_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lease',
            name='customer_static',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='lease',
            name='lessor_static',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='lease',
            name='status',
            field=models.CharField(choices=[('Active', 'Active'), ('Cancelled', 'Cancelled')], default='Active', max_length=20),
        ),
        migrations.AlterField(
            model_name='lease',
            name='uav_static',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]