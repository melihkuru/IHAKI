# Generated by Django 4.2.13 on 2024-06-02 17:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Core', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='uav',
            name='flight_range',
            field=models.DecimalField(blank=True, decimal_places=8, max_digits=12, null=True),
        ),
        migrations.AlterField(
            model_name='uav',
            name='last_latitude',
            field=models.DecimalField(blank=True, decimal_places=8, max_digits=12, null=True),
        ),
        migrations.AlterField(
            model_name='uav',
            name='last_longitude',
            field=models.DecimalField(blank=True, decimal_places=8, max_digits=12, null=True),
        ),
    ]
