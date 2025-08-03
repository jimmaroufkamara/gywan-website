
from django.contrib import admin
from .models import Testimonial

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "created_at")
    search_fields = ("name", "role", "quote")
    list_filter = ("created_at",)
from .models import ImpactStat
from django.contrib import admin
from django.utils.html import format_html
from .models import Event, Story, BlogPost, Resource, Donation, Contact, Newsletter, ImpactStory, TeamMember, Comment, Supporter


@admin.register(ImpactStat)
class ImpactStatAdmin(admin.ModelAdmin):
    list_display = ('label', 'value', 'order', 'is_active')
    search_fields = ('label', 'description')
    list_editable = ('order', 'is_active')


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'is_active')
    search_fields = ('name', 'role', 'bio')
    list_filter = ('is_active',)

@admin.register(Supporter)
class SupporterAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'is_active')
    search_fields = ('name', 'role')
    list_filter = ('is_active',)



@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'location', 'featured', 'is_active')
    list_filter = ('featured', 'is_active', 'date', 'created_at')
    search_fields = ('title', 'description', 'location')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('featured', 'is_active')
    date_hierarchy = 'date'
    
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'description')
        }),
        ('Event Details', {
            'fields': ('date', 'location', 'registration_url')
        }),
        ('Social Media', {
            'fields': ('facebook_url', 'instagram_url', 'youtube_url', 'twitter_url')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Options', {
            'fields': ('featured', 'is_active')
        }),
    )


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'location', 'featured', 'created_at')
    list_filter = ('featured', 'is_active', 'created_at')
    search_fields = ('title', 'content', 'author', 'location')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('featured',)
    
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'content')
        }),
        ('Story Details', {
            'fields': ('author', 'location')
        }),
        ('Social Media', {
            'fields': ('facebook_url', 'instagram_url', 'youtube_url', 'twitter_url')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Options', {
            'fields': ('featured', 'is_active')
        }),
    )


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'published', 'featured', 'created_at')
    list_filter = ('published', 'featured', 'author', 'created_at')
    search_fields = ('title', 'content', 'excerpt', 'tags')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('published', 'featured')
    
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'excerpt')
        }),
        ('Content', {
            'fields': ('content', 'author')
        }),
        ('Social Media', {
            'fields': ('facebook_url', 'instagram_url', 'youtube_url', 'twitter_url')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Meta', {
            'fields': ('tags',)
        }),
        ('Options', {
            'fields': ('published', 'featured', 'is_active')
        }),
    )


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'download_count', 'featured', 'created_at')
    list_filter = ('category', 'featured', 'is_active', 'created_at')
    search_fields = ('title', 'description')
    list_editable = ('featured',)
    readonly_fields = ('download_count',)
    fields = ('title', 'description', 'file', 'image', 'category', 'download_count', 'featured', 'is_active',
              'facebook_url', 'instagram_url', 'youtube_url', 'twitter_url')


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('donor_name', 'amount', 'donation_type', 'processed', 'created_at')
    list_filter = ('donation_type', 'processed', 'is_anonymous', 'created_at')
    search_fields = ('donor_name', 'donor_email', 'stripe_payment_id')
    readonly_fields = ('stripe_payment_id', 'created_at', 'updated_at')
    list_editable = ('processed',)
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
            return self.readonly_fields + ('amount', 'donation_type', 'donor_name', 'donor_email')
        return self.readonly_fields


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    list_editable = ('is_read',)
    readonly_fields = ('created_at',)


@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'subscribed', 'created_at')
    list_filter = ('subscribed', 'created_at')
    search_fields = ('email', 'name')
    list_editable = ('subscribed',)


class CommentAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'text', 'created_at', 'content_type', 'object_id')
    search_fields = ('name', 'email', 'text')
    list_filter = ('content_type', 'created_at')

admin.site.register(Comment, CommentAdmin)
