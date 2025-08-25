from django.urls import path, include
from . import views
from .views import our_team_view


urlpatterns = [
    # Main pages
    path('', views.HomeView.as_view(), name='home'),
    path('about/', views.AboutView.as_view(), name='about'),
    path('team/', views.our_team_view, name='our_team'),
    path('contact/', views.ContactView.as_view(), name='contact'),
    path('donate2/', views.donate2_view, name='donate2'),
    path('donate2/thank-you/', views.donate2_thank_you, name='donate2_thank_you'),

    
    # Events
    path('events/', views.EventListView.as_view(), name='events'),
    path('events/<slug:slug>/', views.EventDetailView.as_view(), name='event_detail'),
    
    # Stories
    path('stories/', views.StoryListView.as_view(), name='stories'),
    path('stories/<slug:slug>/', views.StoryDetailView.as_view(), name='story_detail'),
    
    # Blog
    path('blog/', views.BlogListView.as_view(), name='blog'),
    path('blog/<slug:slug>/', views.BlogDetailView.as_view(), name='blog_detail'),
    
    # Resources
    path('resources/', views.ResourceListView.as_view(), name='resources'),
    
    # AJAX endpoints
  #  path('process-donation/', views.ProcessDonationView.as_view(), name='process_donation'),
   # path('newsletter-subscribe/', views.newsletter_subscribe, name='newsletter_subscribe'),
   # path('api/track-download/<int:resource_id>/', views.track_download, name='track_download'),
]
