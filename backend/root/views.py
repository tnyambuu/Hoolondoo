from django.shortcuts import render
from django.contrib import auth
from django.db import transaction

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.filters import SearchFilter


from rest_framework import (
    mixins,
    generics,
    response,
    status
)

from root.models import (
    User,
    SystemRegistration,
    RelatedSystem
)
from root.serializer import (
    UserSerializer,
    SystemRegistrationSerializer,
    RelatedSystemSerializer
)

send_info = {
    'is_success': True,
    'info': '',
    'description': '',
}


class CreateUserAPIView(
    generics.GenericAPIView
):

    queryset = User.objects
    serializer_class = UserSerializer

    def get(self, request):

        return response.Response(request.query_params.get('root'), status=status.HTTP_200_OK)

    @transaction.atomic
    def post(self, request):

        data = request.data

        if User.objects.filter(username=data['email']).exists():

            send_info['description'] = 'Ийм email-тэй хэрэглэгч байна.'
            send_info['is_success'] = False

            return response.Response(send_info, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

        self.queryset.create_user(
            email=data['email'],
            password=data['password'],
            first_name = data['first_name'],
            last_name = data['last_name'],
            username = data['email']
        )
        send_info['description'] = 'Амжилттай бүртгэгдлээ'
        send_info['info'] = 'INF_001'
        send_info['is_success'] = True

        return response.Response(send_info, status=status.HTTP_200_OK)


class UserLoginAPIView(
    generics.GenericAPIView
):

    queryset = User.objects
    serializer_class = UserSerializer

    def get(self, request):

        user = request.user

        user = User.objects.filter(email=user).first()

        if not user:
            send_info['info'] = 'ERR_002'
            send_info['is_success'] = False
            send_info['description'] = 'Нэвтрээгүй байна'
            return response.Response(send_info, status=status.HTTP_200_OK)

        user_data = self.serializer_class(user).data
        send_info['user_data'] = user_data

        return response.Response(send_info, status=status.HTTP_200_OK)

    def post(self, request):

        data = request.data

        username = data['email']
        password = data['password']

        user_detail = User.objects.filter(username=username).first()

        if not user_detail:
            send_info['description'] = 'Email байхгүй байна.'
            send_info['is_success'] = False
            send_info['info'] = 'ERR_001'

            return response.Response(send_info, status=status.HTTP_200_OK)

        if not password:
            send_info['description'] = 'Password байхгүй байна.'
            send_info['is_success'] = False
            send_info['info'] = 'ERR_001'

            return response.Response(send_info, status=status.HTTP_200_OK)

        user = auth.authenticate(request, username=username, password=password)

        if not user:
            send_info['description'] = 'Password буруу байна.'
            send_info['is_success'] = False
            send_info['info'] = 'ERR_001'
            return response.Response(send_info, status=status.HTTP_200_OK)

        auth.login(request, user)

        send_info['description'] = 'Амжилттай нэвтэрлээ.'

        user_detail = self.get_serializer(user_detail).data
        send_info['user_detail'] = user_detail
        send_info['info'] = 'INF_001'
        send_info['is_success'] = True

        return response.Response(send_info, status=status.HTTP_200_OK)

# @permission_classes([IsAuthenticated])
class UserLogoutAPIView(
    generics.GenericAPIView
):

    queryset = User.objects

    def get(self, request):

        auth.logout(request)
        send_info['description'] = 'Амжилттай гарлаа.'
        send_info['info'] = 'INF_001'

        return response.Response(send_info, status=status.HTTP_200_OK)

@permission_classes([IsAuthenticated])
class TestAPIView(
    generics.GenericAPIView
):

    def get(self, request):
        print(request.user)
        return response.Response(send_info, status=status.HTTP_200_OK)


class SystemDataAPIView(
    generics.GenericAPIView,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin
):


    queryset = SystemRegistration.objects.all()
    serializer_class = SystemRegistrationSerializer

    filter_backends = [SearchFilter]
    search_fields = ['system_name', 'developer__first_name', 'developer__last_name', 'developer__email', 'price', 'date', 'description']

    def get(self, request, pk=None):

        user = request.user
        print(user)

        self.queryset = self.queryset.filter(developer=user)

        if pk:
            self.queryset = self.queryset.filter(pk=pk)
            all_data = self.retrieve(request).data
            send_info['description'] = 'Амжилттай мэдээлэл авлаа'
            send_info['data'] = all_data
            send_info['info'] = 'INF_002'
            send_info['is_success'] = True

            return response.Response(send_info, status=status.HTTP_200_OK)

        all_data = self.list(request).data
        send_info['description'] = 'Амжилттай мэдээлэл авлаа'
        send_info['data'] = all_data
        send_info['info'] = 'INF_002'
        send_info['is_success'] = True

        return response.Response(send_info, status=status.HTTP_200_OK)

    @transaction.atomic
    def post(self, request):

        data = request.data.copy()

        if data['related_system']:
            saved_data_id = []

            for value in data['related_system']:
                null_object = {'releted_system_name': value}
                saved_object = RelatedSystemSerializer(data=null_object)

                if not saved_object.is_valid():
                    send_info['info'] = 'ERR_002'
                    send_info['is_success'] = False
                    send_info['description'] = 'RelatedSystem үүсгэхэд алдаа гарлаа'
                    send_info['data'] = saved_object.errors

                    return response.Response(send_info, status=status.HTTP_200_OK)

                saved_object = saved_object.save()
                saved_data_id.append(saved_object.id)

            data['related_system'] = saved_data_id

        serializer = self.serializer_class(data=data)

        if not serializer.is_valid():

            send_info['info'] = 'ERR_002'
            send_info['is_success'] = False
            send_info['description'] = 'Өгөгдөл дутуу байна'
            send_info['data'] = serializer.errors

            return response.Response(send_info, status=status.HTTP_200_OK)

        serializer.save()

        send_info['info'] = 'INF_001'
        send_info['is_success'] = True
        send_info['description'] = 'Амжилттай үүсгэлээ'

        return response.Response(send_info, status=status.HTTP_200_OK)
