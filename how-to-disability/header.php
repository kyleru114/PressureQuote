<?php
/**
 * The header for our theme
 *
 * @package HowToDisability
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="skip-link screen-reader-text" href="#primary">
    <?php esc_html_e( 'Skip to content', 'howtodisability' ); ?>
</a>

<header id="masthead" class="site-header">
    <div class="container">
        <div class="header-content">
            <div class="site-branding">
                <?php if ( has_custom_logo() ) : ?>
                    <?php the_custom_logo(); ?>
                <?php else : ?>
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-logo" rel="home">
                        <img src="<?php echo get_template_directory_uri(); ?>/images/logo-horizontal.png" 
                             alt="<?php bloginfo( 'name' ); ?>" 
                             class="logo-horizontal">
                    </a>
                <?php endif; ?>
            </div>

            <nav id="site-navigation" class="main-navigation">
                <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span class="screen-reader-text"><?php esc_html_e( 'Menu', 'howtodisability' ); ?></span>
                </button>
                
                <?php
                wp_nav_menu(
                    array(
                        'theme_location' => 'primary',
                        'menu_id'        => 'primary-menu',
                        'container'      => false,
                        'fallback_cb'    => 'howtodisability_default_menu'
                    )
                );
                ?>
            </nav>
        </div>
    </div>
</header>

<?php
// Hero section for front page
if ( is_front_page() && ! is_paged() ) : ?>
    <section class="hero-section">
        <div class="container">
            <h1><?php echo get_theme_mod( 'hero_title', 'Navigate Disability Benefits with Confidence' ); ?></h1>
            <p><?php echo get_theme_mod( 'hero_subtitle', 'Expert guidance on SSDI and SSI claims to help you understand the process and maximize your chances of approval' ); ?></p>
            <a href="<?php echo get_theme_mod( 'hero_button_url', '#resources' ); ?>" class="cta-button">
                <?php echo get_theme_mod( 'hero_button_text', 'Get Started' ); ?>
            </a>
        </div>
    </section>
<?php endif; ?>