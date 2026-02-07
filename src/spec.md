# A&A Boxes Bilingual Landing Page with Admin Panel

## Overview
A bilingual landing page for A&A Boxes with smooth animations and transitions, featuring English and Spanish language support with seamless switching capabilities, plus a comprehensive admin panel for content management and dynamic content creation.

## Core Features

### Bilingual Language Support
- Implement language toggle button in the header allowing users to switch between English and Spanish
- All content sections (Hero, Packages, Products, How to Order, Instagram Feed, About, Contact, Footer) must display in the selected language
- Language switching should be instant without page reload
- Maintain current language selection during user session
- Extract content from AAboxes Catalog Aug 2025.pdf for accurate bilingual translations
- Integrate all translations into the existing LanguageContext.tsx for bilingual toggle support
- Primary content language: Spanish

### Smooth Scroll Navigation
- Implement smooth scrolling transitions between different sections of the landing page
- Ensure seamless navigation when users click on navigation links or scroll manually
- Maintain smooth scroll behavior when language changes

### Fade-in Animations
- Add subtle fade-in animations for text content as it enters the viewport
- Implement fade-in effects for product and package images when they become visible on screen
- Animations should trigger based on scroll position and element visibility
- Preserve animations when switching between languages

### Interactive Hover Effects
- Create gentle hover animations for product and package images that enhance their visual appeal
- Implement hover effects for call-to-action buttons with smooth transitions
- Maintain the premium, soft-glam aesthetic through subtle animation timing and easing

### Updated Packages Section
- Display all package types from page 2 of AAboxes Catalog Aug 2025.pdf
- Each package must include:
  - Package name in both English and Spanish
  - Package description in both English and Spanish
  - Corresponding package visuals using existing product images
- Match existing product images (castle party box, custom Nutella jar, custom Play-Doh, custom Pringles, deluxe milk box, pyramid shaker box) to appropriate catalog packages
- Maintain existing hover effects and animations for all package displays

### Updated Products Section
- Display all products from pages 3-5 of AAboxes Catalog Aug 2025.pdf
- Each product must include:
  - Product name in both English and Spanish (refined descriptions)
  - Product description in both English and Spanish (refined descriptions)
  - Corresponding product image from provided assets
- Use existing product images effectively matched to catalog products
- Maintain existing hover effects and animations for all product displays

### New How to Order Section
- Add comprehensive step-by-step ordering process from page 6 of AAboxes Catalog Aug 2025.pdf
- Present all ordering steps in both English and Spanish
- Include clear, numbered steps with appropriate visual hierarchy
- Maintain consistent design aesthetic with other sections
- Apply same fade-in animations and smooth scroll behavior

### Instagram Feed Section
- Add new Instagram Feed section positioned immediately before the Contact section
- Display section title in both languages:
  - English: "Follow Us on Instagram"
  - Spanish: "Síguenos en Instagram"
- Include bilingual section descriptions explaining the Instagram content
- Embed Instagram plugin or iframe to display the Instagram account feed dynamically
- Implement responsive design ensuring the feed adapts to all screen sizes
- Apply consistent soft-glam theme styling matching other sections
- Include fade-in animations and smooth scroll transitions consistent with other sections
- Support configuration through admin panel for Instagram plugin settings

### Updated Contact Section
- Extract and display complete contact information from page 7 of AAboxes Catalog Aug 2025.pdf
- Include all contact details:
  - Email address
  - Phone number
  - WhatsApp contact
  - Physical address
  - Social media links
  - Business hours
- Present all contact information in both English and Spanish
- Ensure consistency between Contact section and Footer
- Maintain existing design aesthetic and animations

### Dynamic Content Sections
- Display additional custom sections created through the admin panel
- Support flexible content blocks with titles, descriptions, images, and custom backgrounds
- Maintain proper section ordering as configured by administrators
- Apply consistent fade-in animations and smooth scroll behavior to dynamic sections
- Ensure all dynamic content displays in both English and Spanish based on language selection

### Admin Panel System

#### Authentication
- Implement secure login using Internet Identity for authentication
- Create protected admin routes accessible only to authenticated users
- Maintain session state and handle logout functionality

#### Admin Dashboard
- Create a comprehensive admin interface with elegant design matching the Soft Glam Crafter aesthetic
- Provide navigation between different content management sections
- Display current content status and recent changes
- Include new sections for Additional Sections and Content Blocks management

#### Content Management
- Enable editing of all text content across website sections:
  - Hero section titles and descriptions
  - Package names and descriptions
  - Product names and descriptions
  - How to Order steps and instructions
  - Instagram Feed section titles and descriptions
  - Contact information and details
  - Footer content and links
- Support simultaneous editing of both English and Spanish versions
- Provide rich text editing capabilities for formatted content
- Include character limits and validation for content fields

#### Instagram Feed Configuration
- Provide admin interface for configuring Instagram plugin settings
- Allow input of Instagram account handle or username
- Support configuration of Instagram plugin embed code or iframe settings
- Include preview functionality to test Instagram feed display
- Enable administrators to update Instagram configuration without technical knowledge
- Store Instagram configuration settings in backend for persistence

#### Dynamic Content Management
- Additional Sections Manager:
  - Create, edit, and delete custom content sections
  - Configure section titles in both English and Spanish
  - Add section descriptions in both English and Spanish
  - Upload and manage section-specific images
  - Set custom background images or colors for sections
  - Define section ordering and visibility
- Content Blocks Manager:
  - Create flexible content blocks within sections
  - Support various content types (text, images, mixed content)
  - Configure block positioning and layout options
  - Enable bilingual content entry for all text elements
  - Provide content preview functionality

#### Image Management
- Allow uploading and replacing of existing images:
  - Product images
  - Package images
  - Hero background image
  - Logo variations
  - Dynamic section backgrounds
  - Content block images
- Support common image formats (JPG, PNG, WebP)
- Implement image preview functionality before saving
- Maintain image optimization and responsive sizing

#### Preview and Publishing
- Provide real-time preview of changes before publishing
- Allow administrators to see how changes appear in both languages
- Include preview functionality for dynamic sections and content blocks
- Implement save/publish workflow with confirmation dialogs
- Show change history and rollback capabilities
- Enable immediate frontend reflection of content changes after saving

### Visual Assets Integration
- Use the new circular A&A Boxes logo across all instances (Header, Hero, and Footer components)
- Display the logo at increased size for improved visibility and detail
- Ensure the circular logo maintains its gold-and-rose color palette and high-resolution quality
- Logo should scale responsively while maintaining circular appearance across mobile and desktop
- Use logo on light backgrounds for visual harmony within the Soft Glam Crafter design system
- Utilize existing product images effectively matched to catalog packages and products
- Use the hero background image effectively in the landing page design

## Backend Requirements
- Store all website content (text, descriptions, contact information) in persistent storage
- Handle image uploads and storage with proper file management
- Provide API endpoints for content retrieval and updates
- Implement content versioning for change tracking
- Support bilingual content storage with language-specific fields
- Ensure data validation and sanitization for all content updates
- Store dynamic sections and content blocks with proper data structure
- Support section ordering and visibility management
- Implement access control ensuring only authenticated admins can modify content
- Handle dynamic content creation, editing, and deletion operations
- Provide endpoints for retrieving dynamic sections for public display
- Store Instagram Feed configuration settings (account handle, embed code, plugin settings)
- Provide API endpoints for Instagram configuration management
- Support Instagram Feed content retrieval and display settings

## Technical Requirements
- All animations should be smooth and performant
- Animation timing should feel natural and not overwhelming
- Responsive design that works across different screen sizes
- Maintain accessibility standards for users who prefer reduced motion
- Circular logo should be optimized for web display while maintaining quality and circular appearance
- Language switching must preserve scroll position and animation states
- Keep all existing animations, layout, and luxury "Soft Glam Crafter" design style intact
- Admin panel should be responsive and maintain the same design aesthetic
- Implement proper error handling and loading states for admin operations
- Dynamic sections should integrate seamlessly with existing site structure
- Ensure immediate frontend updates when dynamic content is modified
- Maintain consistent design aesthetic across all dynamic content sections
- Instagram Feed section must be responsive and adapt to all screen sizes
- Instagram plugin/iframe should load efficiently and maintain performance
- Ensure Instagram Feed integrates seamlessly with existing section flow and animations

## Content Language
- Primary languages: English and Spanish
- Primary content language: Spanish
- Content should be extracted and translated from the provided AAboxes Catalog Aug 2025.pdf
- All user interface elements must be available in both languages
- All translations integrated into LanguageContext.tsx for seamless bilingual support
- Admin interface should also support both English and Spanish
- Dynamic content creation must support bilingual entry for all text elements
- Instagram Feed section titles and descriptions must be available in both languages
