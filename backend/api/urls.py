
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, UserProfileView, UserViewSet, PendingApprovalsView,
    StationViewSet, LivreurViewSet, ZoneViewSet, BouteilleViewSet,
    CommandeViewSet, PaiementViewSet, DashboardStatsView, health_check
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'stations', StationViewSet)
router.register(r'livreurs', LivreurViewSet)
router.register(r'zones', ZoneViewSet)
router.register(r'bouteilles', BouteilleViewSet)
router.register(r'commandes', CommandeViewSet)
router.register(r'paiements', PaiementViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
    path('admin/pending-approvals/', PendingApprovalsView.as_view(), name='pending-approvals'),
    path('admin/dashboard/', DashboardStatsView.as_view(), name='dashboard'),
    path('health/', health_check, name='health_check'),
    # Ajout de la route health sans slash pour compatibilité
    path('health', health_check, name='health_check_no_slash'),
]
