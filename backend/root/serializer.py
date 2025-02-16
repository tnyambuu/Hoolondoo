from rest_framework import serializers
from root.models import (
    SystemRegistration,
    User,
    RelatedSystem
)

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        exclude = ['password']


class SystemRegistrationLiteSerializer(serializers.ModelSerializer):

    class Meta:
        model = SystemRegistration
        fields = '__all__'


class SystemRegistrationSerializer(serializers.ModelSerializer):
    related_system_data = serializers.SerializerMethodField()

    class Meta:
        model = SystemRegistration
        fields = '__all__'


    def get_related_system_data(self, obj):

        data = None
        all_data = []

        if type(obj) != type(0):
            if obj.related_system:
                data = obj.related_system.values_list('id', flat=True)
                for value in data:
                    value = RelatedSystem.objects.filter(id=value).first().releted_system_name
                    value = SystemRegistration.objects.filter(id=value).first()
                    all_data.append(SystemRegistrationLiteSerializer(value).data)


        return all_data


class RelatedSystemSerializer(serializers.ModelSerializer):

    class Meta:
        model = RelatedSystem
        fields = '__all__'