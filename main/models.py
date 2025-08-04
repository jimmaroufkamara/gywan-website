from django.db import models

class Announcement(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    link = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title



class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100, blank=True)
    quote = models.TextField()
    photo = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.role}" if self.role else self.name
from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from django.utils.text import slugify
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

# Base model
class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True

# Team Member
class TeamMember(BaseModel):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=150)
    bio = models.TextField()
    image = models.ImageField(upload_to='team/', null=True, blank=True)
    twitter = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    facebook = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = 'Team Member'
        verbose_name_plural = 'Team Members'

    def __str__(self):
        return self.name

# Supporter (NEW)
class Supporter(BaseModel):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=150)
    image = models.ImageField(upload_to='supporters/', null=True, blank=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = 'Supporter'
        verbose_name_plural = 'Supporters'

    def __str__(self):
        return self.name

# Impact Stats
class ImpactStat(BaseModel):
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=50, help_text="E.g. '10K+', '85%'")
    description = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to='impact_stats/', null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'Impact Stat'
        verbose_name_plural = 'Impact Stats'

    def __str__(self):
        return f"{self.label}: {self.value}"

# Event
class Event(BaseModel):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    date = models.DateTimeField()
    location = models.CharField(max_length=200)
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    image = models.ImageField(upload_to='events/', null=True, blank=True)
    featured = models.BooleanField(default=False)
    registration_url = models.URLField(blank=True)

    class Meta:
        ordering = ['-date']
        verbose_name = 'Event'
        verbose_name_plural = 'Events'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('event_detail', kwargs={'slug': self.slug})

# Story
class Story(BaseModel):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    content = models.TextField()
    author = models.CharField(max_length=100)
    location = models.CharField(max_length=100, blank=True)
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    image = models.ImageField(upload_to='stories/', null=True, blank=True)
    featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Story'
        verbose_name_plural = 'Stories'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('story_detail', kwargs={'slug': self.slug})

# Blog Post
class BlogPost(BaseModel):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='blog/', null=True, blank=True)
    excerpt = models.TextField(max_length=300)
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    tags = models.CharField(max_length=200, blank=True)
    featured = models.BooleanField(default=False)
    published = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Blog Post'
        verbose_name_plural = 'Blog Posts'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('blog_detail', kwargs={'slug': self.slug})

    def get_tags_list(self):
        return [tag.strip() for tag in self.tags.split(',')] if self.tags else []

# Resource
class Resource(BaseModel):
    CATEGORY_CHOICES = [
        ('guide', 'Guides'),
        ('report', 'Reports'),
        ('toolkit', 'Toolkits'),
        ('policy', 'Policy Briefs'),
        ('research', 'Research'),
        ('other', 'Other'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField()
    file = models.FileField(upload_to='resources/')
    image = models.ImageField(upload_to='resources/images/', null=True, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    download_count = models.PositiveIntegerField(default=0)
    featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Resource'
        verbose_name_plural = 'Resources'

    def __str__(self):
        return self.title

# Donation
class Donation(BaseModel):
    DONATION_TYPES = [
        ('one_time', 'One Time'),
        ('monthly', 'Monthly'),
    ]
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    donation_type = models.CharField(max_length=20, choices=DONATION_TYPES, default='one_time')
    donor_name = models.CharField(max_length=200)
    donor_email = models.EmailField()
    stripe_payment_id = models.CharField(max_length=200, blank=True)
    is_anonymous = models.BooleanField(default=False)
    message = models.TextField(blank=True)
    processed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Donation'
        verbose_name_plural = 'Donations'

    def __str__(self):
        return f"${self.amount} - {self.donor_name}"

# Contact
class Contact(BaseModel):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'

    def __str__(self):
        return f"{self.subject} - {self.name}"

# Newsletter
class Newsletter(BaseModel):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=200, blank=True)
    subscribed = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Newsletter Subscription'
        verbose_name_plural = 'Newsletter Subscriptions'

    def __str__(self):
        return self.email

# Impact Story
class ImpactStory(models.Model):
    title = models.CharField(max_length=200)
    quote = models.TextField()
    location = models.CharField(max_length=100)
    image = models.ImageField(upload_to='impact_stories/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# Comment (Generic)
class Comment(models.Model):
    name = models.CharField(max_length=100, default='Anonymous')
    email = models.EmailField()
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    def __str__(self):
        return f"{self.name} - {self.text[:50]}"
