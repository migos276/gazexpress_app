from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, Station, Livreur, Zone, Bouteille, Commande, Paiement


class UserSerializer(serializers.ModelSerializer):
    coordonnees_gps = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'nom', 'prenom', 'telephone', 'role', 
                  'adresse', 'coordonnees_gps', 'is_active', 'is_approved', 'date_creation']
        read_only_fields = ['id', 'date_creation', 'is_approved', 'role']
    
    def get_coordonnees_gps(self, obj):
        if obj.latitude and obj.longitude:
            return {'latitude': float(obj.latitude), 'longitude': float(obj.longitude)}
        return None


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    station_nom = serializers.CharField(write_only=True, required=False)
    vehicule = serializers.CharField(write_only=True, required=False)
    immatriculation = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'password_confirm', 'nom', 'prenom', 
                  'telephone', 'role', 'adresse', 'station_nom', 'vehicule', 'immatriculation']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password': 'Les mots de passe ne correspondent pas.'})
        
        if attrs.get('role') == 'admin':
            raise serializers.ValidationError({'role': 'Impossible de créer un compte administrateur.'})
        
        if attrs.get('role') == 'station' and not attrs.get('station_nom'):
            raise serializers.ValidationError({'station_nom': 'Le nom de la station est requis.'})
        
        if attrs.get('role') == 'livreur':
            if not attrs.get('vehicule'):
                raise serializers.ValidationError({'vehicule': 'Le type de véhicule est requis.'})
            if not attrs.get('immatriculation'):
                raise serializers.ValidationError({'immatriculation': "L'immatriculation est requise."})
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        station_nom = validated_data.pop('station_nom', None)
        vehicule = validated_data.pop('vehicule', None)
        immatriculation = validated_data.pop('immatriculation', None)
        password = validated_data.pop('password')
        
        allowed_fields = {'email', 'nom', 'prenom', 'telephone', 'role', 'adresse'}
        safe_data = {k: v for k, v in validated_data.items() if k in allowed_fields}
        
        user = User(
            email=safe_data.get('email'),
            nom=safe_data.get('nom', ''),
            prenom=safe_data.get('prenom', ''),
            telephone=safe_data.get('telephone', ''),
            role=safe_data.get('role', 'client'),
            adresse=safe_data.get('adresse', ''),
            is_staff=False,
            is_superuser=False,
            is_active=True,
        )
        user.set_password(password)
        
        if user.role in ['station', 'livreur']:
            user.is_approved = False
        
        user.save()
        
        if user.role == 'station' and station_nom:
            Station.objects.create(
                user=user,
                nom=station_nom,
                adresse=safe_data.get('adresse', ''),
                telephone=safe_data.get('telephone', ''),
                is_approved=False
            )
        
        if user.role == 'livreur' and vehicule:
            Livreur.objects.create(
                user=user,
                vehicule=vehicule,
                immatriculation=immatriculation or '',
                is_approved=False
            )
        
        return user


class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = ['id', 'nom', 'frais_livraison', 'delai_estime', 'is_active']


class StationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    coordonnees_gps = serializers.SerializerMethodField()
    
    class Meta:
        model = Station
        fields = ['id', 'nom', 'adresse', 'telephone', 'email', 
                  'coordonnees_gps', 'horaires', 'is_active', 'is_approved', 'logo']
        read_only_fields = ['id', 'is_approved']
    
    def get_coordonnees_gps(self, obj):
        if obj.latitude and obj.longitude:
            return {'latitude': float(obj.latitude), 'longitude': float(obj.longitude)}
        return None


class LivreurSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    zone = ZoneSerializer(read_only=True)
    
    class Meta:
        model = Livreur
        fields = ['id', 'user', 'vehicule', 'immatriculation', 'zone', 
                  'is_disponible', 'is_approved', 'note_moyenne', 'nombre_livraisons']
        read_only_fields = ['id', 'is_approved', 'note_moyenne', 'nombre_livraisons']


class BouteilleSerializer(serializers.ModelSerializer):
    station_nom = serializers.CharField(source='station.nom', read_only=True)
    station_coordonnees = serializers.SerializerMethodField()
    
    class Meta:
        model = Bouteille
        fields = ['id', 'nom_commercial', 'type', 'marque', 'prix', 'stock',
                  'description', 'image', 'code_produit', 'station', 
                  'station_nom', 'station_coordonnees', 'disponible']
        read_only_fields = ['id', 'station_nom', 'station_coordonnees']
    
    def get_station_coordonnees(self, obj):
        if obj.station.latitude and obj.station.longitude:
            return {'latitude': float(obj.station.latitude), 'longitude': float(obj.station.longitude)}
        return None


class CommandeSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    bouteille = BouteilleSerializer(read_only=True)
    station = StationSerializer(read_only=True)
    livreur = LivreurSerializer(read_only=True)
    coordonnees_livraison = serializers.SerializerMethodField()
    
    class Meta:
        model = Commande
        fields = ['id', 'client', 'bouteille', 'station', 'livreur', 'quantite',
                  'prix_total', 'frais_livraison', 'montant_total', 'adresse_livraison',
                  'coordonnees_livraison', 'statut', 'notes', 'date_commande', 'date_livraison']
        read_only_fields = ['id', 'prix_total', 'montant_total', 'date_commande']
    
    def get_coordonnees_livraison(self, obj):
        if obj.latitude_livraison and obj.longitude_livraison:
            return {'latitude': float(obj.latitude_livraison), 'longitude': float(obj.longitude_livraison)}
        return None


class CommandeCreateSerializer(serializers.ModelSerializer):
    bouteille_id = serializers.IntegerField(write_only=True)
    latitude = serializers.DecimalField(max_digits=10, decimal_places=8, required=False)
    longitude = serializers.DecimalField(max_digits=11, decimal_places=8, required=False)
    
    class Meta:
        model = Commande
        fields = ['bouteille_id', 'quantite', 'adresse_livraison', 'latitude', 'longitude', 'notes']
    
    def create(self, validated_data):
        bouteille_id = validated_data.pop('bouteille_id')
        latitude = validated_data.pop('latitude', None)
        longitude = validated_data.pop('longitude', None)
        
        bouteille = Bouteille.objects.get(id=bouteille_id)
        
        zone = Zone.objects.filter(is_active=True).first()
        frais_livraison = zone.frais_livraison if zone else 0
        
        commande = Commande.objects.create(
            client=self.context['request'].user,
            bouteille=bouteille,
            station=bouteille.station,
            frais_livraison=frais_livraison,
            latitude_livraison=latitude,
            longitude_livraison=longitude,
            **validated_data
        )
        return commande


class PaiementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paiement
        fields = ['id', 'commande', 'montant', 'methode', 'statut', 'reference', 'date_paiement']
        read_only_fields = ['id', 'reference', 'date_paiement']


class DashboardStatsSerializer(serializers.Serializer):
    total_clients = serializers.IntegerField()
    total_livreurs = serializers.IntegerField()
    total_stations = serializers.IntegerField()
    total_commandes = serializers.IntegerField()
    revenus_totaux = serializers.DecimalField(max_digits=12, decimal_places=2)
    commandes_jour = serializers.IntegerField()
    commandes_semaine = serializers.IntegerField()
    commandes_mois = serializers.IntegerField()


class ApprovalSerializer(serializers.Serializer):
    approved = serializers.BooleanField()
