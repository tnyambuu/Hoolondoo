from django.urls import path
from .views import (
    CreateUserAPIView,
    UserLoginAPIView,
    UserLogoutAPIView,
    TestAPIView,
    SystemDataAPIView,
)

urlpatterns = [
    path('createuser/', CreateUserAPIView.as_view()),
    path('login/', UserLoginAPIView.as_view()),
    path('logged/', UserLoginAPIView.as_view()),
    path('logout/', UserLogoutAPIView.as_view()),
    path('test/', TestAPIView.as_view()),
    path('systemdata/', SystemDataAPIView.as_view()),
]