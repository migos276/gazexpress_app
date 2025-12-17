from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


class User(AbstractUser):
    ROLE_CHOICES = [
        ('client', 'Client'),
        ('livreur', 'Livreur'),
        ('station', 'Station'),
        ('admin', 'Administrateur'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    telephone = models.CharField(max_length=20)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')
    adresse = models.TextField(blank=True, null=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_approved = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'nom', 'prenom', 'telephone']
    
    def save(self, *args, **kwargs):
        if self.pk:
            try:
                old_user = User.objects.get(pk=self.pk)
                if old_user.role != self.role and self.role in ['station', 'livreur']:
                    self.is_approved = False
            except User.DoesNotExist:
                pass
        elif self.role in ['station', 'livreur']:
            self.is_approved = False
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)
    
    class Meta:
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'


class Zone(models.Model):
    nom = models.CharField(max_length=100)
    frais_livraison = models.DecimalField(max_digits=10, decimal_places=2)
    delai_estime = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.nom
    
    class Meta:
        verbose_name = 'Zone'
        verbose_name_plural = 'Zones'


class Station(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='station_profile')
    nom = models.CharField(max_length=200)
    adresse = models.TextField()
    telephone = models.CharField(max_length=20)
    horaires = models.CharField(max_length=200, blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    logo = models.ImageField(upload_to='stations/logos/', null=True, blank=True)
    is_active = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    date_creation = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.nom
    
    class Meta:
        verbose_name = 'Station'
        verbose_name_plural = 'Stations'


class Livreur(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='livreur_profile')
    vehicule = models.CharField(max_length=100)
    immatriculation = models.CharField(max_length=20)
    zone = models.ForeignKey(Zone, on_delete=models.SET_NULL, null=True, blank=True)
    is_disponible = models.BooleanField(default=True)
    is_approved = models.BooleanField(default=False)
    note_moyenne = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    nombre_livraisons = models.IntegerField(default=0)
    date_creation = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.prenom} {self.user.nom}"
    
    class Meta:
        verbose_name = 'Livreur'
        verbose_name_plural = 'Livreurs'


class Bouteille(models.Model):
    TYPE_CHOICES = [
        ('6kg', '6 kg'),
        ('12kg', '12 kg'),
        ('15kg', '15 kg'),
        ('autre', 'Autre'),
    ]
    
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='bouteilles')
    nom_commercial = models.CharField(max_length=200)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    marque = models.CharField(max_length=100)
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='bouteilles/', null=True, blank=True)
    code_produit = models.CharField(max_length=50, blank=True, null=True)
    disponible = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.nom_commercial} - {self.type}"
    
    class Meta:
        verbose_name = 'Bouteille'
        verbose_name_plural = 'Bouteilles'


class Commande(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('assignee', 'Assignée'),
        ('en_cours', 'En cours de livraison'),
        ('livree', 'Livrée'),
        ('annulee', 'Annulée'),
    ]
    
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='commandes')
    bouteille = models.ForeignKey(Bouteille, on_delete=models.CASCADE)
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='commandes')
    livreur = models.ForeignKey(Livreur, on_delete=models.SET_NULL, null=True, blank=True, related_name='livraisons')
    quantite = models.IntegerField(default=1)
    prix_total = models.DecimalField(max_digits=10, decimal_places=2)
    frais_livraison = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    montant_total = models.DecimalField(max_digits=10, decimal_places=2)
    adresse_livraison = models.TextField()
    latitude_livraison = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude_livraison = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    notes = models.TextField(blank=True, null=True)
    date_commande = models.DateTimeField(auto_now_add=True)
    date_livraison = models.DateTimeField(null=True, blank=True)
    
    def save(self, *args, **kwargs):
        self.prix_total = self.bouteille.prix * self.quantite
        self.montant_total = self.prix_total + self.frais_livraison
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Commande #{self.id} - {self.client.email}"
    
    class Meta:
        verbose_name = 'Commande'
        verbose_name_plural = 'Commandes'
        ordering = ['-date_commande']


class Paiement(models.Model):
    METHODE_CHOICES = [
        ('mobile_money', 'Mobile Money'),
        ('carte', 'Carte bancaire'),
        ('especes', 'Espèces'),
    ]
    
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('confirme', 'Confirmé'),
        ('echoue', 'Échoué'),
        ('rembourse', 'Remboursé'),
    ]
    
    commande = models.OneToOneField(Commande, on_delete=models.CASCADE, related_name='paiement')
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    methode = models.CharField(max_length=20, choices=METHODE_CHOICES)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    reference = models.CharField(max_length=100, unique=True)
    date_paiement = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Paiement {self.reference}"
    
    class Meta:
        verbose_name = 'Paiement'
        verbose_name_plural = 'Paiements'
