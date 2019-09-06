import json

from rest_framework import exceptions

class Parameter:
    def __init__(self, key=None, value=None, required=False):
        self.key = key
        self.value = value
        self.required = required


class PostParametersList:
    def __init__(self, request):
        self.request = request
        self.list = []

    def check_parameter(self, key, required=False, default_value=None, is_json=False):
        value = self.request.POST.get(key, default_value)
        if value is None and required:
            raise exceptions.NotAcceptable(detail="Falta argumento [" + key + "]")
        elif value is not None:
            if is_json:
                self.list.append(Parameter(key=key, value=json.loads(value), required=required))
            else:
                self.list.append(Parameter(key=key, value=value, required=required))

    def __getitem__(self, key):
        for param in self.list:
            if param.key == key:
                return param.value

        return self.request.POST.get(key, '')

    def __dict__(self):
        args = dict()
        for param in self.list:
            args[param.key] = param.value
        return args