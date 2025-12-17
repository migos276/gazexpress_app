from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsStation(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'station'


class IsApprovedStation(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated or request.user.role != 'station':
            return False
        try:
            return request.user.station_profile.is_approved
        except:
            return False


class IsLivreur(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'livreur'


class IsApprovedLivreur(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated or request.user.role != 'livreur':
            return False
        try:
            return request.user.livreur_profile.is_approved
        except:
            return False


class IsClient(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'client'


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'client'):
            return obj.client == request.user
        return obj == request.user
