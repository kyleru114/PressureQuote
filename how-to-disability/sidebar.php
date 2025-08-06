<?php
/**
 * The sidebar containing the main widget area
 *
 * @package HowToDisability
 */

if ( ! is_active_sidebar( 'sidebar-1' ) ) {
    return;
}
?>

<aside id="secondary" class="widget-area">
    <?php dynamic_sidebar( 'sidebar-1' ); ?>
    
    <?php if ( ! is_active_sidebar( 'sidebar-1' ) ) : ?>
        <!-- Default widgets if sidebar is empty -->
        <section class="widget">
            <h2 class="widget-title">Free Resources</h2>
            <ul>
                <li><a href="/resources/sequential-evaluation-guide">Sequential Evaluation Guide</a></li>
                <li><a href="/resources/child-disability-guide">Child Disability Guide</a></li>
                <li><a href="/resources/medical-evidence-checklist">Medical Evidence Checklist</a></li>
                <li><a href="/resources/appeals-timeline">Appeals Timeline</a></li>
            </ul>
        </section>
        
        <section class="widget">
            <h2 class="widget-title">Recent Posts</h2>
            <ul>
                <?php
                $recent_posts = wp_get_recent_posts( array(
                    'numberposts' => 5,
                    'post_status' => 'publish',
                ) );
                
                foreach ( $recent_posts as $post ) :
                    ?>
                    <li>
                        <a href="<?php echo get_permalink( $post['ID'] ); ?>">
                            <?php echo $post['post_title']; ?>
                        </a>
                    </li>
                    <?php
                endforeach;
                ?>
            </ul>
        </section>
        
        <section class="widget">
            <h2 class="widget-title">Categories</h2>
            <ul>
                <?php
                wp_list_categories( array(
                    'orderby'    => 'count',
                    'order'      => 'DESC',
                    'show_count' => 1,
                    'title_li'   => '',
                    'number'     => 10,
                ) );
                ?>
            </ul>
        </section>
    <?php endif; ?>
</aside>