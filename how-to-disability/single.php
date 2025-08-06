<?php
/**
 * The template for displaying all single posts
 *
 * @package HowToDisability
 */

get_header(); ?>

<main id="primary" class="site-main">
    <div class="container">
        <div class="site-content">
            <div class="content-area">
                <?php
                while ( have_posts() ) :
                    the_post();
                    ?>
                    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                        <header class="single-post-header">
                            <h1 class="single-post-title"><?php the_title(); ?></h1>
                            <div class="post-meta-single">
                                <?php howtodisability_posted_on(); ?> • 
                                <?php the_category( ', ' ); ?> • 
                                <?php echo get_comments_number(); ?> Comments
                            </div>
                        </header>

                        <?php if ( has_post_thumbnail() ) : ?>
                            <div class="post-thumbnail-single">
                                <?php the_post_thumbnail( 'large' ); ?>
                            </div>
                        <?php endif; ?>

                        <div class="entry-content">
                            <?php the_content(); ?>
                            
                            <?php
                            wp_link_pages( array(
                                'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'howtodisability' ),
                                'after'  => '</div>',
                            ) );
                            ?>
                        </div>

                        <footer class="entry-footer">
                            <?php the_tags( '<div class="post-tags">Tags: ', ', ', '</div>' ); ?>
                            
                            <?php howtodisability_social_share(); ?>
                        </footer>

                        <?php
                        // Author bio
                        if ( get_the_author_meta( 'description' ) ) :
                            ?>
                            <div class="author-bio">
                                <h3>About the Author</h3>
                                <div class="author-bio-content">
                                    <?php echo get_avatar( get_the_author_meta( 'ID' ), 80 ); ?>
                                    <div class="author-bio-text">
                                        <h4><?php the_author(); ?></h4>
                                        <p><?php the_author_meta( 'description' ); ?></p>
                                    </div>
                                </div>
                            </div>
                            <?php
                        endif;
                        ?>

                        <?php
                        // Post navigation
                        the_post_navigation( array(
                            'prev_text' => '<span class="nav-subtitle">' . esc_html__( 'Previous:', 'howtodisability' ) . '</span> <span class="nav-title">%title</span>',
                            'next_text' => '<span class="nav-subtitle">' . esc_html__( 'Next:', 'howtodisability' ) . '</span> <span class="nav-title">%title</span>',
                        ) );
                        ?>
                    </article>

                    <?php
                    // If comments are open or we have at least one comment, load up the comment template
                    if ( comments_open() || get_comments_number() ) :
                        comments_template();
                    endif;

                endwhile;
                ?>
            </div>

            <?php get_sidebar(); ?>
        </div>
    </div>
</main>

<?php get_footer(); ?>