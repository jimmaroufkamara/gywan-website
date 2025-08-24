"""
URL configuration for GYWAN project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls')),
]

# Custom 404 handler
handler404 = 'gywan_project.views.custom_404_view'

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Admin customization
admin.site.site_header = "GYWAN Administration"
admin.site.site_title = "GYWAN Admin Portal"
admin.site.index_title = "Welcome to GYWAN Administration"
