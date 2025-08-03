// Dark Mode Toggle Functionality
(function() {
    'use strict';

    // Check for saved theme preference or default to system preference
    const getCurrentTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // Apply theme to document
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
        }
        localStorage.setItem('theme', theme);
    };

    // Initialize theme
    const initTheme = () => {
        const currentTheme = getCurrentTheme();
        applyTheme(currentTheme);
        
        // Create theme toggle button if it doesn't exist
        if (!document.getElementById('theme-toggle')) {
            createThemeToggle();
        }
    };

    // Create theme toggle button
    const createThemeToggle = () => {
        const navbar = document.querySelector('.nav-menu');
        if (!navbar) return;

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle';
        toggleBtn.className = 'theme-toggle-btn';
        toggleBtn.innerHTML = `
            <i class="fas fa-moon dark-icon"></i>
            <i class="fas fa-sun light-icon"></i>
        `;
        toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
        toggleBtn.setAttribute('title', 'Toggle dark mode');

        // Add styles for the toggle button
        const style = document.createElement('style');
        style.textContent = `
            .theme-toggle-btn {
                background: none;
                border: none;
                color: var(--text-dark);
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
            }

            .theme-toggle-btn:hover {
                background: rgba(136, 36, 199, 0.1);
                color: var(--primary-color);
            }

            .theme-toggle-btn .light-icon {
                display: none;
            }

            .theme-toggle-btn .dark-icon {
                display: block;
            }

            [data-theme="dark"] .theme-toggle-btn .light-icon {
                display: block;
            }

            [data-theme="dark"] .theme-toggle-btn .dark-icon {
                display: none;
            }

            @media (prefers-color-scheme: dark) {
                .theme-toggle-btn {
                    color: var(--text-dark);
                }
            }
        `;
        document.head.appendChild(style);

        // Add click event
        toggleBtn.addEventListener('click', () => {
            const currentTheme = getCurrentTheme();
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });

        // Insert before the CTA button
        const ctaButton = navbar.querySelector('.nav-cta');
        if (ctaButton) {
            navbar.insertBefore(toggleBtn, ctaButton);
        } else {
            navbar.appendChild(toggleBtn);
        }
    };

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }

    // Expose functions globally for debugging
    window.themeUtils = {
        getCurrentTheme,
        applyTheme,
        initTheme
    };
})(); 