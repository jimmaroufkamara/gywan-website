// Modern Donation Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Stripe
    const stripe = Stripe(window.STRIPE_PUBLIC_KEY);
    const elements = stripe.elements();
    
    // Create card element
    const cardElement = elements.create('card', {
    style: {
      base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
      },
      invalid: {
                color: '#9e2146',
            },
        },
    });
    
    cardElement.mount('#card-element');
    
    // Handle card errors
    cardElement.addEventListener('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
    } else {
            displayError.textContent = '';
        }
    });

  // Amount selection
    let selectedAmount = 0;
    let selectedFrequency = 'one-time';
    
    const amountOptions = document.querySelectorAll('.amount-option');
    const customAmountInput = document.getElementById('custom-amount');
    const frequencyOptions = document.querySelectorAll('input[name="frequency"]');
    const selectedAmountDisplay = document.getElementById('selected-amount');
    const summaryAmount = document.getElementById('summary-amount');
    const summaryFrequency = document.getElementById('summary-frequency');
    const summaryTotal = document.getElementById('summary-total');
    const impactDescription = document.getElementById('impact-description');
    
    // Amount option click handlers
    amountOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            amountOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Get amount from data attribute
            selectedAmount = parseInt(this.dataset.amount);
            
            // Update displays
            updateAmountDisplays();
            updateImpactDescription();
            
            // Clear custom amount input
            customAmountInput.value = '';
        });
    });
    
    // Custom amount input handler
    customAmountInput.addEventListener('input', function() {
        const value = parseFloat(this.value) || 0;
        
        // Remove selected class from preset options
        amountOptions.forEach(opt => opt.classList.remove('selected'));
        
        selectedAmount = value;
        updateAmountDisplays();
        updateImpactDescription();
    });
    
    // Frequency option handlers
    frequencyOptions.forEach(option => {
        option.addEventListener('change', function() {
            selectedFrequency = this.value;
            updateFrequencyDisplay();
            updateTotalDisplay();
        });
    });
    
    // Update amount displays
    function updateAmountDisplays() {
        selectedAmountDisplay.textContent = selectedAmount.toFixed(2);
        summaryAmount.textContent = `$${selectedAmount.toFixed(2)}`;
        updateTotalDisplay();
    }
    
    // Update frequency display
    function updateFrequencyDisplay() {
        const frequencyText = selectedFrequency === 'monthly' ? 'Monthly' : 'One-time';
        summaryFrequency.textContent = frequencyText;
    }
    
    // Update total display
    function updateTotalDisplay() {
        summaryTotal.textContent = `$${selectedAmount.toFixed(2)}`;
    }
    
    // Update impact description
    function updateImpactDescription() {
        let description = '';
        
        if (selectedAmount >= 1000) {
            description = 'Sponsor a regional leadership summit for 100 young leaders';
        } else if (selectedAmount >= 500) {
            description = 'Launch a community empowerment program reaching 50 girls';
        } else if (selectedAmount >= 250) {
            description = 'Fund comprehensive skills training for 5 young women';
        } else if (selectedAmount >= 100) {
            description = 'Support one girl in our mentorship program for three months';
        } else if (selectedAmount >= 50) {
            description = 'Cover leadership workshop participation for one young woman';
        } else if (selectedAmount >= 25) {
            description = 'Provide essential school supplies for one girl for a full semester';
        } else {
            description = 'Select an amount to see your impact';
        }
        
        impactDescription.textContent = description;
    }
    
    // Form submission
    const donationForm = document.getElementById('donation-form');
    const donateButton = document.getElementById('donate-btn');
    const buttonText = donateButton.querySelector('.button-text');
    const loadingSpinner = donateButton.querySelector('.loading-spinner');
    
    donationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate amount
        if (selectedAmount <= 0) {
            alert('Please select a donation amount.');
            return;
    }

    // Validate form fields
        const donorName = document.getElementById('donor-name').value.trim();
        const donorEmail = document.getElementById('donor-email').value.trim();

    if (!donorName || !donorEmail) {
            alert('Please fill in all required fields.');
            return;
    }

    // Show loading state
        buttonText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        donateButton.disabled = true;
        loadingSpinner.style.display = 'block';
        
      // Create payment intent on server
        createPaymentIntent()
            .then(function(result) {
                if (result.error) {
                    alert(result.error);
                    resetButton();
                    return;
      }

      // Confirm payment with Stripe
                return stripe.confirmCardPayment(result.client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: donorName,
            email: donorEmail,
          },
        },
                });
      })
            .then(function(result) {
      if (result.error) {
                    alert(result.error.message);
                    resetButton();
                } else {
                    // Payment successful
                    handleSuccessfulPayment(result.paymentIntent);
                }
            })
            .catch(function(error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
                resetButton();
            });
    });
    
    // Create payment intent
    function createPaymentIntent() {
        const formData = new FormData(donationForm);
        formData.append('amount', selectedAmount);
        formData.append('frequency', selectedFrequency);
        
        return fetch('/donate/create-payment-intent/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            },
        })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
    }
    
    // Handle successful payment
    function handleSuccessfulPayment(paymentIntent) {
        // Show success message
        buttonText.innerHTML = '<i class="fas fa-check"></i> Thank You!';
        donateButton.style.background = '#28a745';
        
        // Redirect to thank you page after a short delay
        setTimeout(() => {
            window.location.href = `/donate/thank-you/?payment_intent=${paymentIntent.id}`;
        }, 2000);
    }
    
    // Reset button state
    function resetButton() {
        buttonText.innerHTML = '<i class="fas fa-heart"></i> Complete Donation';
        donateButton.disabled = false;
        loadingSpinner.style.display = 'none';
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.amount-option, .frequency-option, .story-card, .way-card').forEach(el => {
        observer.observe(el);
    });
    
    // Initialize tooltips for security badges
    const securityBadges = document.querySelectorAll('.security-badge');
    securityBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add hover effects for trust items
    const trustItems = document.querySelectorAll('.trust-item');
    trustItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Form validation feedback
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.style.borderColor = '';
            }
        });
    });
    
    // Payment method switching
    const paymentMethodRadios = document.querySelectorAll('input[name="payment_method"]');
    const cardSection = document.getElementById('card-section');
    const mobileSection = document.getElementById('mobile-section');
    const bankSection = document.getElementById('bank-section');
    const bankNameSelect = document.getElementById('bank-name');
    const bankDetailsDiv = document.getElementById('bank-details');
    const bankAccountInfo = document.getElementById('bank-account-info');

    // Sierra Leone bank account details (example data)
    const bankAccounts = {
        ecobank: {
            name: 'Ecobank Sierra Leone',
            account: '1234567890',
            branch: 'Freetown',
        },
        rokel: {
            name: 'Rokel Commercial Bank',
            account: '2345678901',
            branch: 'Freetown',
        },
        zenith: {
            name: 'Zenith Bank',
            account: '3456789012',
            branch: 'Freetown',
        },
        uba: {
            name: 'United Bank for Africa (UBA)',
            account: '4567890123',
            branch: 'Freetown',
        },
        gtbank: {
            name: 'Guaranty Trust Bank (GTBank)',
            account: '5678901234',
            branch: 'Freetown',
        },
        standardchartered: {
            name: 'Standard Chartered Bank',
            account: '6789012345',
            branch: 'Freetown',
        },
        access: {
            name: 'Access Bank',
            account: '7890123456',
            branch: 'Freetown',
        },
        freetown: {
            name: 'Freetown Commercial Bank',
            account: '8901234567',
            branch: 'Freetown',
        },
        union: {
            name: 'Union Trust Bank',
            account: '9012345678',
            branch: 'Freetown',
        },
        sierra: {
            name: 'Sierra Leone Commercial Bank',
            account: '0123456789',
            branch: 'Freetown',
        },
        first: {
            name: 'First International Bank',
            account: '1122334455',
            branch: 'Freetown',
        },
        skye: {
            name: 'Skye Bank',
            account: '2233445566',
            branch: 'Freetown',
        },
        fidelity: {
            name: 'Fidelity Bank',
            account: '3344556677',
            branch: 'Freetown',
        },
        guaranty: {
            name: 'Guaranty Trust Bank',
            account: '4455667788',
            branch: 'Freetown',
        },
        keystone: {
            name: 'Keystone Bank',
            account: '5566778899',
            branch: 'Freetown',
        },
        leone: {
            name: 'Leone Bank',
            account: '6677889900',
            branch: 'Freetown',
        },
    };

    function showPaymentSection(method) {
        cardSection.style.display = method === 'card' ? '' : 'none';
        mobileSection.style.display = method === 'mobile' ? '' : 'none';
        bankSection.style.display = method === 'bank' ? '' : 'none';
    }

    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            showPaymentSection(this.value);
        });
    });

    // Show default section
    showPaymentSection(document.querySelector('input[name="payment_method"]:checked').value);

    // Bank details display
    if (bankNameSelect) {
        bankNameSelect.addEventListener('change', function() {
            const val = this.value;
            if (bankAccounts[val]) {
                bankDetailsDiv.style.display = '';
                bankAccountInfo.innerHTML =
                    `<strong>Bank:</strong> ${bankAccounts[val].name}<br>` +
                    `<strong>Account Number:</strong> ${bankAccounts[val].account}<br>` +
                    `<strong>Branch:</strong> ${bankAccounts[val].branch}`;
            } else {
                bankDetailsDiv.style.display = 'none';
                bankAccountInfo.innerHTML = '';
            }
        });
    }
    
    // Initialize with default values
    updateAmountDisplays();
    updateFrequencyDisplay();
    updateImpactDescription();
});
