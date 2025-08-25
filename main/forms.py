from django import forms
from django.core.validators import MinValueValidator
from .models import Contact, Newsletter, Donation2, MobileProvider, Bank

class ContactForm(forms.ModelForm):
    """Contact form with enhanced styling"""
    
    class Meta:
        model = Contact
        fields = ['name', 'email', 'subject', 'message']
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['name'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Your Full Name'
        })
        self.fields['email'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'your.email@example.com'
        })
        self.fields['subject'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'What is this about?'
        })
        self.fields['message'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Tell us more about your inquiry...',
            'rows': 6
        })

class Donation2Form(forms.ModelForm):
    amount = forms.DecimalField(
        required=False,
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'min': '1',
            'step': '0.01',
            'placeholder': 'Enter Amount'
        })
    )
    mobile_provider = forms.ModelChoiceField(
        queryset=MobileProvider.objects.all(),
        required=False,
        widget=forms.Select(attrs={'class': 'form-control'}),
        empty_label="Select Mobile Provider"
    )
    bank_name = forms.ModelChoiceField(
        queryset=Bank.objects.all(),
        required=False,
        widget=forms.Select(attrs={'class': 'form-control'}),
        empty_label="Select Bank"
    )
    mobile_number = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Mobile Number'})
    )

    class Meta:
        model = Donation2
        fields = [
            'amount', 'donor_name', 'donor_email',
            'payment_method', 'frequency',
            'mobile_provider', 'mobile_number',
            'bank_name',
            'is_anonymous', 'message'
        ]
        widgets = {
            'donor_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Full Name'}),
            'donor_email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email Address'}),
            'payment_method': forms.Select(attrs={'class': 'form-control'}),
            'frequency': forms.Select(choices=[('one_time', 'One Time'), ('monthly', 'Monthly')],attrs={'class': 'form-control'}),
            'is_anonymous': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'message': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Message (optional)'}),
        }

    def clean(self):
        cleaned_data = super().clean()
        predefined = cleaned_data.get('predefined_amount')
        amount = cleaned_data.get('amount')
        if predefined and predefined != 'amount':
            cleaned_data['amount'] = predefined
        elif predefined == 'amount' and not amount:
            self.add_error('amount', 'Please enter an amount.')
        return cleaned_data



class NewsletterForm(forms.ModelForm):
    """Newsletter subscription form"""
    
    class Meta:
        model = Newsletter
        fields = ['email', 'name']
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Enter your email address'
        })
        self.fields['name'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Your name (optional)'
        })
