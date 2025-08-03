# GYWAN Website

A modern, responsive Django website for the Girls and Young Women's Advocacy Network (GYWAN).

## Features

- **Modern Design**: Responsive design with smooth animations and micro-interactions
- **Donation System**: Integrated Stripe payment processing for one-time and recurring donations
- **Content Management**: Django admin interface for managing events, stories, blog posts, and resources
- **Contact System**: Contact form with email notifications
- **Newsletter**: Email subscription system
- **SEO Optimized**: Meta tags, Open Graph tags, and structured data
- **Mobile First**: Fully responsive design that works on all devices

## Tech Stack

- **Backend**: Django 4.2+, Python 3.8+
- **Frontend**: HTML5, CSS3 (custom), Vanilla JavaScript
- **Database**: SQLite (development), PostgreSQL (production)
- **Payment**: Stripe integration
- **Deployment**: Gunicorn, Nginx, WhiteNoise

## Quick Start

### Prerequisites

- Python 3.8 or higher
- pip package manager
- Git

### Installation

1. **Clone the repository**

   \`\`\`bash
   git clone https://github.com/jimmaroufkamara/gywan-website.git

   cd gywan-website
   \`\`\`

2. **Create virtual environment**

   \`\`\`bash

   python -m venv venv

   source venv/bin/activate  # On Windows: venv\Scripts\activate

   \`\`\`

3. **Install dependencies**
   \`\`\`bash

   pip install -r requirements.txt

   \`\`\`

4. **Environment setup**

   \`\`\`bash

   cp .env.example .env

   # Edit .env with your configuration

   \`\`\`

5. **Database setup**

   \`\`\`bash

   python manage.py makemigrations

   python manage.py migrate

   python manage.py createsuperuser

   \`\`\`


6. **Run development server**

   \`\`\`bash

   python manage.py runserver

   \`\`\`

Visit `http://127.0.0.1:8000` to view the website.

## Configuration

### Environment Variables

Key environment variables to configure:

- `SECRET_KEY`: Django secret key
- `DEBUG`: Set to False in production
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `DATABASE_URL`: Database connection string
- `STRIPE_PUBLIC_KEY`: Stripe publishable key
- `STRIPE_SECRET_KEY`: Stripe secret key
- `EMAIL_HOST_USER`: SMTP email username
- `EMAIL_HOST_PASSWORD`: SMTP email password

### Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Add keys to your `.env` file
4. Test with Stripe's test card numbers

## Deployment

### Production Deployment

1. **Server Setup**

   \`\`\`bash

   # Install system dependencies

   sudo apt update

   sudo apt install python3-pip python3-venv nginx postgresql

   \`\`\`

2. **Database Setup**

   \`\`\`bash

   sudo -u postgres createdb gywan_db

   sudo -u postgres createuser gywan_user

   \`\`\`

3. **Application Deployment**

   \`\`\`bash

   # Clone and setup

   git clone <repository-url>

   cd gywan-website

   python3 -m venv venv

   source venv/bin/activate

   pip install -r requirements.txt

   
   # Configure environment

   cp .env.example .env

   # Edit .env with production settings

   
   # Database migration

   python manage.py migrate

   python manage.py collectstatic

   python manage.py createsuperuser

   \`\`\`

4. **Nginx Configuration**

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location /static/ {
           alias /path/to/staticfiles/;
       }
       
       location /media/ {
           alias /path/to/media/;
       }
       
       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   \`\`\`

5. **Process Management**
   \`\`\`bash

   # Install supervisor

   sudo apt install supervisor
   
   # Create supervisor config

   sudo nano /etc/supervisor/conf.d/gywan.conf
   \`\`\`

## Content Management

### Admin Interface

Access the Django admin at `/admin/` to manage:

- **Events**: Add upcoming workshops, conferences, and programs
- **Stories**: Share success stories and testimonials
- **Blog Posts**: Publish articles and updates
- **Resources**: Upload downloadable materials
- **Donations**: View donation history and statistics
- **Contact Messages**: Review and respond to inquiries

### Adding Content

1. **Events**: Include title, date, location, description, and featured image
2. **Stories**: Add inspiring stories with author information and images
3. **Blog Posts**: Create engaging articles with tags and excerpts
4. **Resources**: Upload PDFs, guides, and toolkits with categories

## Customization

### Styling

- **Colors**: Edit CSS custom properties in `static/css/main.css`
- **Fonts**: Update Google Fonts imports in base template
- **Layout**: Modify templates in `templates/` directory

### Functionality

- **Forms**: Customize forms in `main/forms.py`
- **Models**: Extend models in `main/models.py`
- **Views**: Add new views in `main/views.py`

## Support

For technical support or questions:

- **Documentation**: Check this README and code comments
- **Issues**: Report bugs via GitHub Issues
- **Email**: Contact the development team

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## License

This project is licensed under the MIT License. See LICENSE file for details.

---

**GYWAN** - Empowering girls and young women to become confident leaders and changemakers.
\`\`\`

```python file="main/management/__init__.py"
# Management commands package
