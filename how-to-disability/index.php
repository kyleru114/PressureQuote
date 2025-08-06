<?php
/**
 * The main template file
 *
 * @package HowToDisability
 */

get_header(); ?>

<main id="primary" class="site-main">
    <div class="container">
        <?php if ( is_home() && ! is_front_page() ) : ?>
            <header class="page-header">
                <h1 class="page-title"><?php single_post_title(); ?></h1>
            </header>
        <?php endif; ?>

        <div class="blog-grid">
            <?php
            if ( have_posts() ) :
                while ( have_posts() ) :
                    the_post(); ?>
                    
                    <article id="post-<?php the_ID(); ?>" <?php post_class( 'post-card' ); ?>>

                        <?php if ( has_post_thumbnail() ) : ?>
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail( 'medium_large', array( 'class' => 'post-thumbnail' ) ); ?>
                            </a>
                        <?php endif; ?>

                        <div class="post-content">
                            <div class="post-meta">
                                <?php echo esc_html( get_the_date() ); ?> • 
                                <?php the_category( ', ' ); ?>
                            </div>

                            <h2 class="post-title">
                                <a href="<?php the_permalink(); ?>">
                                    <?php the_title(); ?>
                                </a>
                            </h2>

                            <div class="post-excerpt">
                                <?php the_excerpt(); ?>
                            </div>

                            <a href="<?php the_permalink(); ?>" class="read-more">
                                Read More →
                            </a>
                        </div>
                    </article>

                <?php endwhile;

                the_posts_pagination( array(
                    'mid_size'  => 2,
                    'prev_text' => __( '← Previous', 'howtodisability' ),
                    'next_text' => __( 'Next →', 'howtodisability' ),
                ) );

            else : ?>
                <div class="no-posts">
                    <h2><?php esc_html_e( 'Nothing Found', 'howtodisability' ); ?></h2>
                    <p><?php esc_html_e( 'It seems we can\'t find what you\'re looking for. Perhaps searching can help.', 'howtodisability' ); ?></p>
                    <?php get_search_form(); ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
</main>

<?php get_footer(); ?>
