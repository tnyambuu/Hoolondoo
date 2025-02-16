from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):

    first_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    username = models.CharField(max_length=150, blank=True, null=True, unique=True)
    email = models.EmailField(blank=True)
    password = models.CharField(max_length=256, null=True)


class RelatedSystem(models.Model):

    releted_system_name = models.IntegerField(verbose_name='Системийн ID')



class SystemRegistration(models.Model):
    '''Системийн бүртгэл'''

    CARD = 1
    CORE = 2
    INTERNAL = 3
    DIGITAL = 4

    SYSTEM_TYPE =(
        (CARD, 'Карт'),
        (CORE, 'Коре'),
        (INTERNAL, 'Дотоод'),
        (DIGITAL, 'Дижитал'),
    )

    system_name = models.CharField(max_length=50, verbose_name='Системийн нэр')
    system_type = models.PositiveIntegerField(choices=SYSTEM_TYPE, default=CARD)
    price = models.PositiveIntegerField(null=True, verbose_name='Үнэлгээ')
    description = models.TextField(null=True, verbose_name='Тайлбар')
    related_system = models.ManyToManyField(RelatedSystem, verbose_name='Холбоотой системүүд', blank=True)
    developer = models.ForeignKey(User, on_delete=models.SET_NULL, verbose_name='Хөгжүүлэгч', null=True)
    date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=False)
