<?php
/**
 * How to Disability Theme Customizer
 *
 * @package HowToDisability
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 */
function howtodisability_customize_register( $wp_customize ) {
    $wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
    $wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';
    $wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';

    // Hero Section
    $wp_customize->add_section( 'hero_section', array(
        'title'       => __( 'Hero Section', 'howtodisability' ),
        'priority'    => 30,
        'description' => __( 'Customize the homepage hero section', 'howtodisability' ),
    ) );

    // Hero Title
    $wp_customize->add_setting( 'hero_title', array(
        'default'           => 'Navigate Disability Benefits with Confidence',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ) );

    $wp_customize->add_control( 'hero_title', array(
        'label'    => __( 'Hero Title', 'howtodisability' ),
        'section'  => 'hero_section',
        'type'     => 'text',
    ) );

    // Hero Subtitle
    $wp_customize->add_setting( 'hero_subtitle', array(
        'default'           => 'Expert guidance on SSDI and SSI claims to help you understand the process and maximize your chances of approval',
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'postMessage',
    ) );

    $wp_customize->add_control( 'hero_subtitle', array(
        'label'    => __( 'Hero Subtitle', 'howtodisability' ),
        'section'  => 'hero_section',
        'type'     => 'textarea',
    ) );

    // Hero Button Text
    $wp_customize->add_setting( 'hero_button_text', array(
        'default'           => 'Get Started',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ) );

    $wp_customize->add_control( 'hero_button_text', array(
        'label'    => __( 'Hero Button Text', 'howtodisability' ),
        'section'  => 'hero_section',
        'type'     => 'text',
    ) );

    // Hero Button URL
    $wp_customize->add_setting( 'hero_button_url', array(
        'default'           => '#resources',
        'sanitize_callback' => 'esc_url_raw',
    ) );

    $wp_customize->add_control( 'hero_button_url', array(
        'label'    => __( 'Hero Button URL', 'howtodisability' ),
        'section'  => 'hero_section',
        'type'     => 'url',
    ) );

    // Social Media Section
    $wp_customize->add_section( 'social_media', array(
        'title'    => __( 'Social Media Links', 'howtodisability' ),
        'priority' => 40,
    ) );

    // YouTube URL
    $wp_customize->add_setting( 'youtube_url', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
    ) );

    $wp_customize->add_control( 'youtube_url', array(
        'label'    => __( 'YouTube URL', 'howtodisability' ),
        'section'  => 'social_media',
        'type'     => 'url',
    ) );

    // TikTok URL
    $wp_customize->add_setting( 'tiktok_url', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
    ) );

    $wp_customize->add_control( 'tiktok_url', array(
        'label'    => __( 'TikTok URL', 'howtodisability' ),
        'section'  => 'social_media',
        'type'     => 'url',
    ) );

    // Footer Section
    $wp_customize->add_section( 'footer_settings', array(
        'title'    => __( 'Footer Settings', 'howtodisability' ),
        'priority' => 50,
    ) );

    // Footer Disclaimer
    $wp_customize->add_setting( 'footer_disclaimer', array(
        'default'           => 'This website provides educational information only and does not constitute legal advice.',
        'sanitize_callback' => 'sanitize_textarea_field',
    ) );

    $wp_customize->add_control( 'footer_disclaimer', array(
        'label'    => __( 'Footer Disclaimer', 'howtodisability' ),
        'section'  => 'footer_settings',
        'type'     => 'textarea',
    ) );
}
add_action( 'customize_register', 'howtodisability_customize_register' );

/**
 * Render the site title for the selective refresh partial.
 */
function howtodisability_customize_partial_blogname() {
    bloginfo( 'name' );
}

/**
 * Render the site tagline for the selective refresh partial.
 */
function howtodisability_customize_partial_blogdescription() {
    bloginfo( 'description' );
}

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function howtodisability_customize_preview_js() {
    wp_enqueue_script( 'howtodisability-customizer', get_template_directory_uri() . '/js/customizer.js', array( 'customize-preview' ), '1.0.0', true );
}
add_action( 'customize_preview_init', 'howtodisability_customize_preview_js' );