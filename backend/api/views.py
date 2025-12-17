from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
import uuid

from .models import User, Station, Livreur, Zone, Bouteille, Commande, Paiement
from .serializers import (
    UserSerializer, RegisterSerializer, StationSerializer, LivreurSerializer,
    ZoneSerializer, BouteilleSerializer, CommandeSerializer, CommandeCreateSerializer,
    PaiementSerializer, DashboardStatsSerializer, ApprovalSerializer
)
from .permissions import IsAdmin, IsStation, IsApprovedStation, IsLivreur, IsApprovedLivreur, IsClient, IsOwnerOrAdmin


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        message = "Inscription réussie."
        if user.role in ['station', 'livreur']:
            message = "Inscription réussie. Votre compte est en attente d'approbation par l'administrateur."
        
        return Response({
            'user': UserSerializer(user).data,
            'message': message
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    
    def get_queryset(self):
        queryset = User.objects.all()
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)
        return queryset
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        user = self.get_object()
        serializer = ApprovalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user.is_approved = serializer.validated_data['approved']
        user.save()
        
        if user.role == 'station':
            try:
                station = user.station_profile
                station.is_approved = serializer.validated_data['approved']
                station.is_active = serializer.validated_data['approved']
                station.save()
            except Station.DoesNotExist:
                pass
        
        if user.role == 'livreur':
            try:
                livreur = user.livreur_profile
                livreur.is_approved = serializer.validated_data['approved']
                livreur.save()
            except Livreur.DoesNotExist:
                pass
        
        action_msg = "approuvé" if serializer.validated_data['approved'] else "refusé"
        return Response({'message': f'Utilisateur {action_msg} avec succès.'})


class PendingApprovalsView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    
    def get_queryset(self):
        return User.objects.filter(
            role__in=['station', 'livreur'],
            is_approved=False
        )


class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.all()
    serializer_class = StationSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        if self.action in ['approve']:
            return [IsAdmin()]
        return [IsStation()]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Station.objects.all()
        if user.role == 'station':
            return Station.objects.filter(user=user)
        return Station.objects.filter(is_approved=True, is_active=True)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def approve(self, request, pk=None):
        station = self.get_object()
        serializer = ApprovalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        station.is_approved = serializer.validated_data['approved']
        station.is_active = serializer.validated_data['approved']
        station.save()
        
        station.user.is_approved = serializer.validated_data['approved']
        station.user.save()
        
        action_msg = "approuvée" if serializer.validated_data['approved'] else "refusée"
        return Response({'message': f'Station {action_msg} avec succès.'})


class LivreurViewSet(viewsets.ModelViewSet):
    queryset = Livreur.objects.all()
    serializer_class = LivreurSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        if self.action in ['approve']:
            return [IsAdmin()]
        return [IsLivreur()]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Livreur.objects.all()
        if user.role == 'livreur':
            return Livreur.objects.filter(user=user)
        return Livreur.objects.filter(is_approved=True)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def approve(self, request, pk=None):
        livreur = self.get_object()
        serializer = ApprovalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        livreur.is_approved = serializer.validated_data['approved']
        livreur.save()
        
        livreur.user.is_approved = serializer.validated_data['approved']
        livreur.user.save()
        
        action_msg = "approuvé" if serializer.validated_data['approved'] else "refusé"
        return Response({'message': f'Livreur {action_msg} avec succès.'})
    
    @action(detail=False, methods=['get'])
    def disponibles(self, request):
        livreurs = Livreur.objects.filter(is_approved=True, is_disponible=True)
        serializer = self.get_serializer(livreurs, many=True)
        return Response(serializer.data)


class ZoneViewSet(viewsets.ModelViewSet):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [IsAdmin()]


class BouteilleViewSet(viewsets.ModelViewSet):
    queryset = Bouteille.objects.all()
    serializer_class = BouteilleSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsApprovedStation()]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Bouteille.objects.filter(station__is_approved=True, disponible=True)
        
        if user.is_authenticated and user.role == 'station':
            try:
                queryset = Bouteille.objects.filter(station=user.station_profile)
            except:
                pass
        
        type_filter = self.request.query_params.get('type')
        if type_filter:
            queryset = queryset.filter(type=type_filter)
        
        marque = self.request.query_params.get('marque')
        if marque:
            queryset = queryset.filter(marque__icontains=marque)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(station=self.request.user.station_profile)


class CommandeViewSet(viewsets.ModelViewSet):
    queryset = Commande.objects.all()
    serializer_class = CommandeSerializer
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CommandeCreateSerializer
        return CommandeSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Commande.objects.all()
        if user.role == 'client':
            return Commande.objects.filter(client=user)
        if user.role == 'station':
            try:
                return Commande.objects.filter(station=user.station_profile)
            except:
                return Commande.objects.none()
        if user.role == 'livreur':
            try:
                return Commande.objects.filter(livreur=user.livreur_profile)
            except:
                return Commande.objects.none()
        return Commande.objects.none()
    
    @action(detail=True, methods=['post'])
    def assign_livreur(self, request, pk=None):
        commande = self.get_object()
        livreur_id = request.data.get('livreur_id')
        
        try:
            livreur = Livreur.objects.get(id=livreur_id, is_approved=True)
            commande.livreur = livreur
            commande.statut = 'assignee'
            commande.save()
            return Response({'message': 'Livreur assigné avec succès.'})
        except Livreur.DoesNotExist:
            return Response({'error': 'Livreur non trouvé.'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        commande = self.get_object()
        new_status = request.data.get('statut')
        
        if new_status not in dict(Commande.STATUT_CHOICES):
            return Response({'error': 'Statut invalide.'}, status=status.HTTP_400_BAD_REQUEST)
        
        commande.statut = new_status
        if new_status == 'livree':
            commande.date_livraison = timezone.now()
            if commande.livreur:
                commande.livreur.nombre_livraisons += 1
                commande.livreur.save()
        
        commande.save()
        return Response({'message': 'Statut mis à jour avec succès.'})


class PaiementViewSet(viewsets.ModelViewSet):
    queryset = Paiement.objects.all()
    serializer_class = PaiementSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Paiement.objects.all()
        return Paiement.objects.filter(commande__client=user)
    
    def perform_create(self, serializer):
        reference = f"PAY-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(reference=reference)


class DashboardStatsView(APIView):
    permission_classes = [IsAdmin]
    
    def get(self, request):
        now = timezone.now()
        today = now.date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        stats = {
            'total_clients': User.objects.filter(role='client').count(),
            'total_livreurs': Livreur.objects.filter(is_approved=True).count(),
            'total_stations': Station.objects.filter(is_approved=True).count(),
            'total_commandes': Commande.objects.count(),
            'revenus_totaux': Commande.objects.filter(statut='livree').aggregate(
                total=Sum('montant_total'))['total'] or 0,
            'commandes_jour': Commande.objects.filter(date_commande__date=today).count(),
            'commandes_semaine': Commande.objects.filter(date_commande__date__gte=week_ago).count(),
            'commandes_mois': Commande.objects.filter(date_commande__date__gte=month_ago).count(),
        }
        
        serializer = DashboardStatsSerializer(stats)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check(request):
    return Response({'status': 'ok', 'message': 'GazExpress API is running'})
