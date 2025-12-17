from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Station, Livreur, Zone, Bouteille, Commande, Paiement


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'nom', 'prenom', 'role', 'is_approved', 'is_active', 'date_creation']
    list_filter = ['role', 'is_approved', 'is_active']
    search_fields = ['email', 'nom', 'prenom', 'telephone']
    ordering = ['-date_creation']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Informations supplémentaires', {'fields': ('nom', 'prenom', 'telephone', 'role', 'adresse', 'latitude', 'longitude', 'is_approved')}),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Informations supplémentaires', {'fields': ('email', 'nom', 'prenom', 'telephone', 'role')}),
    )
    
    actions = ['approve_users', 'reject_users']
    
    def approve_users(self, request, queryset):
        queryset.update(is_approved=True)
        for user in queryset:
            if user.role == 'station':
                Station.objects.filter(user=user).update(is_approved=True, is_active=True)
            if user.role == 'livreur':
                Livreur.objects.filter(user=user).update(is_approved=True)
    approve_users.short_description = "Approuver les utilisateurs sélectionnés"
    
    def reject_users(self, request, queryset):
        queryset.update(is_approved=False)
        for user in queryset:
            if user.role == 'station':
                Station.objects.filter(user=user).update(is_approved=False, is_active=False)
            if user.role == 'livreur':
                Livreur.objects.filter(user=user).update(is_approved=False)
    reject_users.short_description = "Refuser les utilisateurs sélectionnés"


@admin.register(Station)
class StationAdmin(admin.ModelAdmin):
    list_display = ['nom', 'telephone', 'is_approved', 'is_active', 'date_creation']
    list_filter = ['is_approved', 'is_active']
    search_fields = ['nom', 'adresse', 'telephone']
    actions = ['approve_stations', 'reject_stations']
    
    def approve_stations(self, request, queryset):
        queryset.update(is_approved=True, is_active=True)
        for station in queryset:
            station.user.is_approved = True
            station.user.save()
    approve_stations.short_description = "Approuver les stations sélectionnées"
    
    def reject_stations(self, request, queryset):
        queryset.update(is_approved=False, is_active=False)
        for station in queryset:
            station.user.is_approved = False
            station.user.save()
    reject_stations.short_description = "Refuser les stations sélectionnées"


@admin.register(Livreur)
class LivreurAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'vehicule', 'is_approved', 'is_disponible', 'note_moyenne', 'nombre_livraisons']
    list_filter = ['is_approved', 'is_disponible']
    search_fields = ['user__nom', 'user__prenom', 'vehicule', 'immatriculation']
    actions = ['approve_livreurs', 'reject_livreurs']
    
    def approve_livreurs(self, request, queryset):
        queryset.update(is_approved=True)
        for livreur in queryset:
            livreur.user.is_approved = True
            livreur.user.save()
    approve_livreurs.short_description = "Approuver les livreurs sélectionnés"
    
    def reject_livreurs(self, request, queryset):
        queryset.update(is_approved=False)
        for livreur in queryset:
            livreur.user.is_approved = False
            livreur.user.save()
    reject_livreurs.short_description = "Refuser les livreurs sélectionnés"


@admin.register(Zone)
class ZoneAdmin(admin.ModelAdmin):
    list_display = ['nom', 'frais_livraison', 'delai_estime', 'is_active']
    list_filter = ['is_active']
    search_fields = ['nom']


@admin.register(Bouteille)
class BouteilleAdmin(admin.ModelAdmin):
    list_display = ['nom_commercial', 'type', 'marque', 'prix', 'stock', 'station', 'disponible']
    list_filter = ['type', 'marque', 'disponible']
    search_fields = ['nom_commercial', 'marque', 'code_produit']


@admin.register(Commande)
class CommandeAdmin(admin.ModelAdmin):
    list_display = ['id', 'client', 'station', 'statut', 'montant_total', 'date_commande']
    list_filter = ['statut', 'date_commande']
    search_fields = ['client__email', 'adresse_livraison']
    date_hierarchy = 'date_commande'


@admin.register(Paiement)
class PaiementAdmin(admin.ModelAdmin):
    list_display = ['reference', 'commande', 'montant', 'methode', 'statut', 'date_paiement']
    list_filter = ['methode', 'statut']
    search_fields = ['reference']
