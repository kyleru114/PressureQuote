<?php
/**
 * The template for displaying the footer
 *
 * @package HowToDisability
 */
?>

<footer id="colophon" class="site-footer">
    <div class="container">
        <div class="footer-content">
            <?php if ( is_active_sidebar( 'footer-widgets' ) ) : ?>
                <?php dynamic_sidebar( 'footer-widgets' ); ?>
            <?php else : ?>
                <div class="footer-widget">
                    <h3>About How to Disability</h3>
                    <p>Expert guidance on SSDI and SSI claims to help you understand the process and maximize your chances of approval.</p>
                </div>
                
                <div class="footer-widget">
                    <h3>Quick Links</h3>
                    <?php
                    wp_nav_menu( array(
                        'theme_location' => 'footer',
                        'menu_id'        => 'footer-menu',
                        'fallback_cb'    => false,
                        'depth'          => 1,
                    ) );
                    ?>
                </div>
                
                <div class="footer-widget">
                    <h3>Resources</h3>
                    <ul>
                        <li><a href="/resources/ssdi-guide">SSDI Guide</a></li>
                        <li><a href="/resources/ssi-guide">SSI Guide</a></li>
                        <li><a href="/resources/appeals-process">Appeals Process</a></li>
                        <li><a href="/resources/medical-evidence">Medical Evidence</a></li>
                    </ul>
                </div>
                
                <div class="footer-widget">
                    <h3>Connect</h3>
                    <ul>
                        <li><a href="https://youtube.com/@howtodisability" target="_blank" rel="noopener">YouTube</a></li>
                        <li><a href="https://tiktok.com/@howtodisability" target="_blank" rel="noopener">TikTok</a></li>
                        <li><a href="/newsletter">Email Newsletter</a></li>
                        <li><a href="/contact">Contact Us</a></li>
                    </ul>
                </div>
            <?php endif; ?>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; <?php echo date('Y'); ?> <?php bloginfo( 'name' ); ?>. All rights reserved.</p>
            <p>This website provides educational information only and does not constitute legal advice.</p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>

</body>
</html>