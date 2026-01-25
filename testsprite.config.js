/**
 * COMPREHENSIVE TESTSPRITE CONFIGURATION
 * Tests EVERY page, component, button, link, and navigation element
 * No shortcuts - complete UI/UX testing
 */

module.exports = {
  projectName: "MRF Educational Platform",
  testType: "frontend",
  baseUrl: "http://localhost:3000",
  
  // Core test configuration
  testScope: {
    mode: "comprehensive", // Test everything
    coverage: "100%",
    skipBackend: true, // UI/Frontend only
  },

  // Browser and viewport testing
  browsers: ["chromium", "firefox", "webkit"],
  viewports: [
    { name: "mobile", width: 375, height: 667 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1920, height: 1080 },
  ],

  // ============================================================================
  // PAGES TO TEST - ALL 45+ PAGES
  // ============================================================================
  pages: [
    // ========== MAIN PAGES ==========
    {
      path: "/ar",
      name: "Homepage",
      priority: "critical",
      tests: [
        "hero_section_renders",
        "navigation_visible",
        "all_links_work",
        "cta_buttons_clickable",
        "stats_display_correctly",
        "features_section_visible",
        "instructor_profile_shown",
        "testimonials_carousel",
        "footer_links_work",
        "theme_toggle_works",
        "mobile_menu_functional",
        "rtl_layout_correct",
      ],
    },

    // ========== AUTHENTICATION PAGES ==========
    {
      path: "/ar/auth/login",
      name: "Login Page",
      priority: "critical",
      tests: [
        "form_renders",
        "email_input_works",
        "password_input_works",
        "show_password_toggle",
        "remember_me_checkbox",
        "submit_button_enabled",
        "forgot_password_link",
        "register_link_works",
        "form_validation",
        "error_messages_display",
        "loading_state_shown",
        "social_login_buttons",
      ],
    },
    {
      path: "/ar/auth/register",
      name: "Register Page",
      priority: "critical",
      tests: [
        "registration_form_renders",
        "all_input_fields_work",
        "grade_selection_dropdown",
        "password_strength_meter",
        "terms_checkbox",
        "submit_button_validation",
        "login_link_works",
        "otp_verification_flow",
        "error_handling",
        "success_message",
      ],
    },
    {
      path: "/ar/auth/forgot-password",
      name: "Forgot Password",
      priority: "high",
      tests: [
        "email_input_renders",
        "submit_button_works",
        "back_to_login_link",
        "success_confirmation",
        "email_validation",
      ],
    },

    // ========== DASHBOARD & PROFILE ==========
    {
      path: "/ar/dashboard",
      name: "Student Dashboard",
      priority: "critical",
      tests: [
        "dashboard_layout_renders",
        "stats_cards_visible",
        "xp_progress_shown",
        "level_badge_displays",
        "streak_counter_works",
        "recent_lessons_list",
        "upcoming_quests",
        "achievement_cards",
        "charts_render",
        "navigation_sidebar",
        "quick_actions_menu",
        "performance_metrics",
        "study_time_tracker",
        "goal_progress_bars",
      ],
    },
    {
      path: "/ar/profile",
      name: "User Profile",
      priority: "high",
      tests: [
        "profile_information_display",
        "avatar_upload_button",
        "edit_profile_form",
        "save_changes_button",
        "password_change_section",
        "notification_settings",
        "language_toggle",
        "theme_preference",
        "achievements_grid",
        "badges_collection",
      ],
    },
    {
      path: "/ar/settings",
      name: "Settings Page",
      priority: "high",
      tests: [
        "settings_tabs_render",
        "account_settings_section",
        "privacy_settings",
        "notification_toggles",
        "language_selector",
        "theme_switcher",
        "save_button_works",
        "cancel_button_works",
      ],
    },

    // ========== LEARNING PAGES ==========
    {
      path: "/ar/lessons",
      name: "Lessons List",
      priority: "critical",
      tests: [
        "lessons_grid_renders",
        "lesson_cards_clickable",
        "filter_buttons_work",
        "sort_dropdown_functional",
        "search_bar_works",
        "grade_filter_works",
        "difficulty_badges",
        "progress_indicators",
        "locked_lessons_shown",
        "continue_learning_cta",
        "pagination_works",
      ],
    },
    {
      path: "/ar/lessons/1",
      name: "Lesson Detail Page",
      priority: "critical",
      tests: [
        "lesson_title_displays",
        "video_player_renders",
        "play_pause_buttons",
        "progress_bar_works",
        "quality_selector",
        "speed_controls",
        "fullscreen_button",
        "notes_panel_toggle",
        "bookmarks_feature",
        "next_lesson_button",
        "previous_lesson_button",
        "completion_tracking",
        "quiz_trigger_button",
      ],
    },
    {
      path: "/ar/lectures",
      name: "Lectures Page",
      priority: "high",
      tests: [
        "lectures_list_renders",
        "lecture_cards_visible",
        "thumbnail_images_load",
        "duration_displayed",
        "grade_labels_shown",
        "filter_by_grade",
        "search_lectures",
        "watch_buttons_work",
      ],
    },
    {
      path: "/ar/lectures/1",
      name: "Lecture Detail",
      priority: "high",
      tests: [
        "lecture_video_player",
        "lecture_description",
        "related_materials",
        "download_button",
        "share_button",
        "like_button",
        "comments_section",
      ],
    },

    // ========== QUIZ & ASSESSMENT ==========
    {
      path: "/ar/quizzes",
      name: "Quizzes List",
      priority: "critical",
      tests: [
        "quiz_cards_render",
        "quiz_titles_visible",
        "difficulty_indicators",
        "time_duration_shown",
        "questions_count",
        "start_quiz_buttons",
        "past_attempts_shown",
        "score_history",
        "filter_by_subject",
      ],
    },
    {
      path: "/ar/exercises",
      name: "Exercises Page",
      priority: "high",
      tests: [
        "exercise_list_renders",
        "exercise_cards_clickable",
        "difficulty_levels",
        "completion_status",
        "start_button_works",
      ],
    },

    // ========== GAMIFICATION ==========
    {
      path: "/ar/achievements",
      name: "Achievements Page",
      priority: "high",
      tests: [
        "achievements_grid_renders",
        "locked_achievements_shown",
        "unlocked_achievements_highlighted",
        "achievement_progress_bars",
        "achievement_descriptions",
        "badges_display",
        "share_achievement_button",
      ],
    },
    {
      path: "/ar/leaderboard",
      name: "Leaderboard",
      priority: "high",
      tests: [
        "leaderboard_table_renders",
        "user_rankings_display",
        "user_avatars_shown",
        "xp_scores_visible",
        "current_user_highlighted",
        "filter_by_timeframe",
        "filter_by_grade",
        "pagination_controls",
      ],
    },
    {
      path: "/ar/quests",
      name: "Quests Page",
      priority: "high",
      tests: [
        "daily_quests_section",
        "weekly_quests_section",
        "quest_cards_render",
        "progress_bars_work",
        "reward_badges_shown",
        "claim_reward_button",
        "quest_timer_countdown",
        "completed_quests_list",
      ],
    },

    // ========== SHOP & COMMERCE ==========
    {
      path: "/ar/shop",
      name: "Shop Page",
      priority: "high",
      tests: [
        "product_grid_renders",
        "product_images_load",
        "prices_display",
        "add_to_cart_buttons",
        "product_filters",
        "search_products",
        "category_navigation",
        "sale_badges",
      ],
    },
    {
      path: "/ar/books",
      name: "Books Store",
      priority: "high",
      tests: [
        "books_catalog_renders",
        "book_covers_display",
        "book_titles_visible",
        "prices_shown",
        "grade_filters",
        "add_to_cart_buttons",
        "preview_button",
      ],
    },
    {
      path: "/ar/packages",
      name: "Packages Page",
      priority: "high",
      tests: [
        "package_cards_render",
        "pricing_visible",
        "features_list",
        "subscribe_buttons",
        "comparison_table",
        "recommended_badge",
      ],
    },
    {
      path: "/ar/cart",
      name: "Shopping Cart",
      priority: "high",
      tests: [
        "cart_items_display",
        "item_quantities",
        "remove_item_button",
        "update_quantity_controls",
        "subtotal_calculation",
        "checkout_button",
        "continue_shopping_link",
        "empty_cart_state",
      ],
    },
    {
      path: "/ar/checkout",
      name: "Checkout Page",
      priority: "high",
      tests: [
        "checkout_form_renders",
        "billing_information_fields",
        "payment_method_selection",
        "order_summary_shown",
        "total_price_visible",
        "place_order_button",
        "terms_checkbox",
        "back_to_cart_link",
      ],
    },

    // ========== CONTENT PAGES ==========
    {
      path: "/ar/homework",
      name: "Homework Page",
      priority: "high",
      tests: [
        "homework_assignments_list",
        "due_dates_visible",
        "status_indicators",
        "submit_button",
        "file_upload_works",
        "overdue_warnings",
      ],
    },
    {
      path: "/ar/materials",
      name: "Study Materials",
      priority: "high",
      tests: [
        "materials_list_renders",
        "download_buttons",
        "file_type_icons",
        "file_sizes_shown",
        "filter_by_type",
        "search_materials",
      ],
    },
    {
      path: "/ar/review",
      name: "Review Page",
      priority: "medium",
      tests: [
        "review_content_renders",
        "flashcards_work",
        "spaced_repetition",
        "mark_as_known_button",
        "difficulty_rating",
        "progress_tracker",
      ],
    },
    {
      path: "/ar/tips",
      name: "Study Tips",
      priority: "medium",
      tests: [
        "tips_cards_render",
        "tip_categories",
        "filter_tips",
        "bookmark_tip_button",
        "share_tip_button",
      ],
    },
    {
      path: "/ar/essay",
      name: "Essay Writing",
      priority: "medium",
      tests: [
        "essay_editor_renders",
        "text_formatting_toolbar",
        "word_count_display",
        "save_draft_button",
        "submit_essay_button",
        "guidelines_sidebar",
      ],
    },
    {
      path: "/ar/courses",
      name: "Courses Page",
      priority: "high",
      tests: [
        "courses_grid_renders",
        "course_cards_clickable",
        "enrollment_buttons",
        "course_progress",
        "instructor_info",
        "course_duration",
      ],
    },

    // ========== INFORMATIONAL PAGES ==========
    {
      path: "/ar/about",
      name: "About Page",
      priority: "medium",
      tests: [
        "about_content_renders",
        "instructor_bio_visible",
        "achievements_section",
        "experience_highlights",
        "contact_info_shown",
        "social_media_links",
      ],
    },
    {
      path: "/ar/help",
      name: "Help Center",
      priority: "medium",
      tests: [
        "faq_accordion_works",
        "search_help_topics",
        "category_navigation",
        "contact_support_button",
        "helpful_vote_buttons",
      ],
    },
    {
      path: "/ar/announcements",
      name: "Announcements",
      priority: "medium",
      tests: [
        "announcements_list_renders",
        "announcement_cards",
        "date_stamps_visible",
        "read_more_buttons",
        "filter_by_category",
      ],
    },

    // ========== BUSINESS PAGES ==========
    {
      path: "/ar/distributor",
      name: "Become Distributor",
      priority: "low",
      tests: [
        "application_form_renders",
        "form_fields_work",
        "submit_application_button",
        "terms_conditions",
        "benefits_section",
      ],
    },
    {
      path: "/ar/sales-points",
      name: "Sales Points",
      priority: "low",
      tests: [
        "locations_map_renders",
        "sales_points_list",
        "filter_by_location",
        "contact_information",
        "directions_link",
      ],
    },
    {
      path: "/ar/subscription",
      name: "Subscription Plans",
      priority: "high",
      tests: [
        "plans_comparison_table",
        "pricing_cards",
        "feature_lists",
        "subscribe_buttons",
        "billing_cycle_toggle",
        "trial_information",
      ],
    },

    // ========== SPECIAL FEATURES ==========
    {
      path: "/ar/adaptive",
      name: "Adaptive Learning",
      priority: "medium",
      tests: [
        "adaptive_system_info",
        "personalization_settings",
        "learning_path_display",
        "recommendations_section",
      ],
    },
    {
      path: "/ar/contact",
      name: "Contact Page",
      priority: "medium",
      tests: [
        "contact_form_renders",
        "all_form_fields_work",
        "submit_button_enabled",
        "contact_info_visible",
        "map_location",
        "social_links",
      ],
    },

    // ========== LEGAL PAGES ==========
    {
      path: "/ar/privacy",
      name: "Privacy Policy",
      priority: "low",
      tests: [
        "privacy_content_renders",
        "sections_navigable",
        "last_updated_date",
        "table_of_contents",
      ],
    },
    {
      path: "/ar/terms",
      name: "Terms of Service",
      priority: "low",
      tests: [
        "terms_content_renders",
        "sections_organized",
        "accept_terms_button",
        "print_version_link",
      ],
    },
  ],

  // ============================================================================
  // COMPONENT TESTING - ALL 100+ COMPONENTS
  // ============================================================================
  components: [
    // ========== UI COMPONENTS (70+ components) ==========
    {
      name: "Button Component",
      path: "src/components/ui/button.tsx",
      tests: [
        "renders_all_variants",
        "primary_button_style",
        "secondary_button_style",
        "outline_button_style",
        "ghost_button_style",
        "destructive_button_style",
        "disabled_state_works",
        "loading_state_shows",
        "icon_placement_correct",
        "click_handler_fires",
        "hover_effect_visible",
        "focus_state_accessible",
        "rtl_spacing_correct",
      ],
    },
    {
      name: "Card Component",
      path: "src/components/ui/card.tsx",
      tests: [
        "card_renders_correctly",
        "header_section_works",
        "body_content_displays",
        "footer_section_renders",
        "hover_effects",
        "shadow_styling",
        "border_radius",
        "responsive_sizing",
      ],
    },
    {
      name: "Input Component",
      path: "src/components/ui/input.tsx",
      tests: [
        "input_field_renders",
        "placeholder_shows",
        "value_updates",
        "error_state_styling",
        "disabled_state",
        "icon_addon_works",
        "rtl_text_direction",
        "focus_ring_visible",
      ],
    },
    {
      name: "Checkbox Component",
      path: "src/components/ui/checkbox.tsx",
      tests: [
        "checkbox_renders",
        "check_uncheck_works",
        "indeterminate_state",
        "label_association",
        "disabled_state",
        "keyboard_accessible",
      ],
    },
    {
      name: "Radio Group",
      path: "src/components/ui/radio-group.tsx",
      tests: [
        "radio_buttons_render",
        "single_selection_works",
        "selected_state_visible",
        "keyboard_navigation",
        "rtl_layout",
      ],
    },
    {
      name: "Select Component",
      path: "src/components/ui/select.tsx",
      tests: [
        "dropdown_renders",
        "options_list_displays",
        "selection_works",
        "search_filtering",
        "placeholder_text",
        "disabled_options",
        "multiple_selection",
      ],
    },
    {
      name: "Switch Component",
      path: "src/components/ui/switch.tsx",
      tests: [
        "switch_renders",
        "toggle_works",
        "on_off_states",
        "disabled_state",
        "label_positioning",
        "smooth_animation",
      ],
    },
    {
      name: "Slider Component",
      path: "src/components/ui/slider.tsx",
      tests: [
        "slider_renders",
        "drag_works",
        "value_updates",
        "min_max_range",
        "step_increments",
        "keyboard_controls",
      ],
    },
    {
      name: "Textarea Component",
      path: "src/components/ui/textarea.tsx",
      tests: [
        "textarea_renders",
        "multiline_input_works",
        "auto_resize",
        "character_counter",
        "max_length_limit",
        "rtl_text",
      ],
    },
    {
      name: "Badge Component",
      path: "src/components/ui/badge.tsx",
      tests: [
        "badge_renders",
        "all_color_variants",
        "sizes_display_correctly",
        "icon_badge_works",
        "notification_dot",
      ],
    },
    {
      name: "Avatar Component",
      path: "src/components/ui/avatar.tsx",
      tests: [
        "avatar_image_loads",
        "fallback_initials_show",
        "different_sizes",
        "online_status_indicator",
        "rounded_styling",
      ],
    },
    {
      name: "Alert Component",
      path: "src/components/ui/alert.tsx",
      tests: [
        "alert_renders",
        "info_variant",
        "success_variant",
        "warning_variant",
        "error_variant",
        "close_button_works",
        "icon_displays",
        "rtl_layout",
      ],
    },
    {
      name: "Toast Component",
      path: "src/components/ui/toast.tsx",
      tests: [
        "toast_appears",
        "auto_dismiss_timer",
        "close_button_works",
        "multiple_toasts_stack",
        "success_toast_style",
        "error_toast_style",
        "position_variants",
      ],
    },
    {
      name: "Dialog Component",
      path: "src/components/ui/dialog.tsx",
      tests: [
        "dialog_opens",
        "dialog_closes",
        "backdrop_click_closes",
        "escape_key_closes",
        "header_renders",
        "footer_actions",
        "scroll_behavior",
        "focus_trap_works",
      ],
    },
    {
      name: "Dropdown Menu",
      path: "src/components/ui/dropdown-menu.tsx",
      tests: [
        "menu_opens_on_click",
        "menu_items_render",
        "item_selection_works",
        "submenu_opens",
        "keyboard_navigation",
        "close_on_select",
        "rtl_positioning",
      ],
    },
    {
      name: "Context Menu",
      path: "src/components/ui/context-menu.tsx",
      tests: [
        "right_click_opens",
        "menu_items_visible",
        "actions_trigger",
        "close_on_action",
        "position_adjusts",
      ],
    },
    {
      name: "Tooltip Component",
      path: "src/components/ui/tooltip.tsx",
      tests: [
        "tooltip_shows_on_hover",
        "tooltip_content_renders",
        "positioning_works",
        "arrow_points_correctly",
        "delay_timing",
        "rtl_positioning",
      ],
    },
    {
      name: "Tabs Component",
      path: "src/components/ui/tabs.tsx",
      tests: [
        "tabs_render",
        "tab_switching_works",
        "active_tab_highlighted",
        "keyboard_navigation",
        "content_panel_updates",
        "disabled_tabs",
      ],
    },
    {
      name: "Accordion Component",
      path: "src/components/ui/accordion.tsx",
      tests: [
        "accordion_renders",
        "expand_collapse_works",
        "single_expand_mode",
        "multiple_expand_mode",
        "smooth_animation",
        "keyboard_accessible",
      ],
    },
    {
      name: "Progress Bar",
      path: "src/components/ui/progress.tsx",
      tests: [
        "progress_bar_renders",
        "percentage_accurate",
        "color_variants",
        "animated_progress",
        "label_displays",
      ],
    },
    {
      name: "Progress Ring",
      path: "src/components/gamification/progress-ring.tsx",
      tests: [
        "ring_renders",
        "percentage_circle",
        "color_changes",
        "animation_smooth",
        "center_text_shows",
      ],
    },
    {
      name: "Loading Spinner",
      path: "src/components/ui/loading-spinner.tsx",
      tests: [
        "spinner_animates",
        "different_sizes",
        "color_variants",
        "centered_positioning",
      ],
    },
    {
      name: "Loading Skeleton",
      path: "src/components/ui/loading-skeleton.tsx",
      tests: [
        "skeleton_renders",
        "shimmer_animation",
        "different_shapes",
        "multiple_lines",
        "card_skeleton",
      ],
    },
    {
      name: "Empty State",
      path: "src/components/ui/empty-state.tsx",
      tests: [
        "empty_state_renders",
        "illustration_shows",
        "message_displays",
        "cta_button_visible",
        "icon_correct",
      ],
    },
    {
      name: "Pagination Component",
      path: "src/components/ui/pagination.tsx",
      tests: [
        "page_numbers_render",
        "next_prev_buttons",
        "current_page_highlighted",
        "page_change_works",
        "ellipsis_for_many_pages",
        "first_last_buttons",
      ],
    },
    {
      name: "Breadcrumb Component",
      path: "src/components/ui/breadcrumb.tsx",
      tests: [
        "breadcrumb_trail_renders",
        "links_clickable",
        "separators_shown",
        "current_page_not_link",
        "rtl_direction",
      ],
    },
    {
      name: "Stepper Component",
      path: "src/components/ui/stepper.tsx",
      tests: [
        "steps_render",
        "current_step_highlighted",
        "completed_steps_marked",
        "step_navigation_works",
        "vertical_horizontal_layouts",
      ],
    },
    {
      name: "Carousel Component",
      path: "src/components/ui/carousel.tsx",
      tests: [
        "carousel_renders",
        "slides_navigate",
        "dots_indicator",
        "arrow_buttons",
        "auto_play_works",
        "swipe_gestures",
      ],
    },
    {
      name: "Theme Toggle",
      path: "src/components/ui/theme-toggle.tsx",
      tests: [
        "toggle_button_renders",
        "switches_themes",
        "icon_changes",
        "persists_preference",
        "smooth_transition",
      ],
    },

    // ========== NAVIGATION COMPONENTS ==========
    {
      name: "Header Navigation",
      path: "src/components/layout/header.tsx",
      tests: [
        "header_renders",
        "logo_clickable",
        "nav_links_visible",
        "user_menu_works",
        "notifications_icon",
        "search_bar_functional",
        "mobile_responsive",
        "sticky_on_scroll",
      ],
    },
    {
      name: "Footer Component",
      path: "src/components/layout/footer.tsx",
      tests: [
        "footer_renders",
        "footer_links_work",
        "social_icons_clickable",
        "copyright_text",
        "newsletter_signup",
        "columns_responsive",
      ],
    },
    {
      name: "Bottom Navigation",
      path: "src/components/ui/bottom-navigation.tsx",
      tests: [
        "bottom_nav_renders",
        "nav_items_clickable",
        "active_item_highlighted",
        "icons_display",
        "labels_show",
        "mobile_only_visible",
      ],
    },
    {
      name: "Sidebar Navigation",
      path: "src/components/layout/navigation.tsx",
      tests: [
        "sidebar_renders",
        "menu_items_organized",
        "expandable_sections",
        "active_link_highlighted",
        "collapse_expand_works",
        "responsive_drawer",
      ],
    },

    // ========== AUTHENTICATION COMPONENTS ==========
    {
      name: "Login Form",
      path: "src/components/auth/login-form.tsx",
      tests: [
        "form_renders",
        "email_validation",
        "password_validation",
        "submit_disabled_when_invalid",
        "error_messages_show",
        "loading_state",
        "success_redirect",
      ],
    },
    {
      name: "Register Form",
      path: "src/components/auth/register-form.tsx",
      tests: [
        "registration_form_renders",
        "all_fields_validate",
        "password_match_check",
        "terms_acceptance_required",
        "form_submission_works",
        "field_error_messages",
      ],
    },
    {
      name: "OTP Form",
      path: "src/components/auth/otp-form.tsx",
      tests: [
        "otp_inputs_render",
        "auto_focus_next_input",
        "paste_otp_works",
        "backspace_navigation",
        "submit_when_complete",
        "resend_code_button",
      ],
    },

    // ========== GAMIFICATION COMPONENTS ==========
    {
      name: "XP Badge",
      path: "src/components/gamification/xp-badge.tsx",
      tests: [
        "xp_badge_renders",
        "points_display_correctly",
        "animation_on_gain",
        "color_by_level",
        "tooltip_shows_details",
      ],
    },
    {
      name: "Level Badge",
      path: "src/components/gamification/level-badge.tsx",
      tests: [
        "level_badge_renders",
        "current_level_shown",
        "progress_to_next_level",
        "badge_icon_correct",
        "color_gradient",
      ],
    },
    {
      name: "Daily Streak",
      path: "src/components/gamification/daily-streak.tsx",
      tests: [
        "streak_counter_renders",
        "fire_icon_shows",
        "streak_days_accurate",
        "freeze_indicator",
        "animation_on_maintain",
      ],
    },
    {
      name: "Achievement Card",
      path: "src/components/gamification/achievement-card.tsx",
      tests: [
        "achievement_card_renders",
        "locked_state_styling",
        "unlocked_celebration",
        "progress_bar_shown",
        "description_readable",
        "share_button_works",
      ],
    },
    {
      name: "Leaderboard Display",
      path: "src/components/gamification/LeaderboardDisplay.tsx",
      tests: [
        "leaderboard_renders",
        "rankings_ordered",
        "user_highlighted",
        "avatars_load",
        "scores_formatted",
        "rank_badges",
      ],
    },
    {
      name: "Quest Display",
      path: "src/components/gamification/QuestDisplay.tsx",
      tests: [
        "quest_cards_render",
        "progress_bars_accurate",
        "reward_icons_show",
        "timer_countdown",
        "claim_button_enabled",
        "completed_quests_marked",
      ],
    },
    {
      name: "Rewards Modal",
      path: "src/components/gamification/rewards-modal.tsx",
      tests: [
        "modal_opens",
        "reward_animation",
        "confetti_effect",
        "reward_details_shown",
        "claim_button_works",
        "close_modal",
      ],
    },

    // ========== QUIZ COMPONENTS ==========
    {
      name: "Quiz Engine",
      path: "src/components/quiz/quiz-engine.tsx",
      tests: [
        "quiz_renders",
        "question_displays",
        "answer_options_clickable",
        "selection_highlights",
        "next_button_enabled",
        "progress_indicator",
        "timer_countdown",
        "submit_quiz_works",
        "results_shown",
      ],
    },
    {
      name: "Quiz Card",
      path: "src/components/quiz/quiz-card.tsx",
      tests: [
        "quiz_card_renders",
        "title_visible",
        "difficulty_badge",
        "questions_count",
        "duration_shown",
        "start_button_clickable",
        "score_display",
      ],
    },

    // ========== VIDEO COMPONENTS ==========
    {
      name: "Video Player",
      path: "src/components/video/video-player.tsx",
      tests: [
        "video_player_renders",
        "play_pause_works",
        "progress_bar_functional",
        "volume_control",
        "fullscreen_toggle",
        "quality_selector",
        "playback_speed",
        "subtitles_toggle",
      ],
    },
    {
      name: "Interactive Video Player",
      path: "src/components/video/InteractiveVideoPlayer.tsx",
      tests: [
        "player_renders",
        "interactive_questions_popup",
        "answer_selection_works",
        "progress_saved",
        "notes_feature",
        "bookmarks_work",
      ],
    },

    // ========== LESSON COMPONENTS ==========
    {
      name: "Lesson Card",
      path: "src/components/lessons/LessonCard.tsx",
      tests: [
        "lesson_card_renders",
        "thumbnail_loads",
        "title_displays",
        "duration_shown",
        "difficulty_indicator",
        "locked_unlocked_state",
        "progress_percentage",
        "click_navigates",
      ],
    },
    {
      name: "Lesson Progress",
      path: "src/components/lesson/lesson-progress.tsx",
      tests: [
        "progress_tracker_renders",
        "completed_lessons_marked",
        "current_lesson_highlighted",
        "next_lesson_shown",
        "percentage_accurate",
      ],
    },
    {
      name: "Notes Panel",
      path: "src/components/lesson/notes-panel.tsx",
      tests: [
        "notes_panel_toggles",
        "text_editor_works",
        "save_notes_button",
        "timestamp_markers",
        "search_notes",
        "delete_note_works",
      ],
    },

    // ========== DASHBOARD COMPONENTS ==========
    {
      name: "Animated Stats",
      path: "src/components/dashboard/AnimatedStats.tsx",
      tests: [
        "stats_cards_render",
        "numbers_animate_up",
        "icons_display",
        "trend_indicators",
        "color_coding",
      ],
    },
    {
      name: "Progress Chart",
      path: "src/components/dashboard/ProgressChart.tsx",
      tests: [
        "chart_renders",
        "data_points_accurate",
        "axes_labeled",
        "tooltips_show",
        "responsive_sizing",
        "legend_visible",
      ],
    },
    {
      name: "Performance Breakdown",
      path: "src/components/dashboard/PerformanceBreakdown.tsx",
      tests: [
        "breakdown_charts_render",
        "subject_scores_shown",
        "color_coded_bars",
        "percentages_accurate",
        "interactive_tooltips",
      ],
    },

    // ========== ANIMATION COMPONENTS ==========
    {
      name: "Success Celebration",
      path: "src/components/animations/SuccessCelebration.tsx",
      tests: [
        "celebration_triggers",
        "confetti_animation",
        "sound_effect",
        "message_displays",
        "auto_dismiss",
      ],
    },
    {
      name: "Micro Animations",
      path: "src/components/animations/MicroAnimations.tsx",
      tests: [
        "hover_animations_work",
        "click_feedback",
        "smooth_transitions",
        "duration_appropriate",
        "reduced_motion_respected",
      ],
    },

    // ========== SEARCH COMPONENTS ==========
    {
      name: "Search Modal",
      path: "src/components/search/search-modal.tsx",
      tests: [
        "search_modal_opens",
        "search_input_works",
        "results_display",
        "keyboard_navigation",
        "recent_searches",
        "close_modal",
      ],
    },
    {
      name: "Global Search",
      path: "src/components/ui/global-search.tsx",
      tests: [
        "search_bar_renders",
        "autocomplete_works",
        "search_suggestions",
        "filter_options",
        "search_results_page",
      ],
    },

    // ========== PROFILE COMPONENTS ==========
    {
      name: "Profile Card",
      path: "src/components/ui/profile-card.tsx",
      tests: [
        "profile_card_renders",
        "avatar_displays",
        "user_info_shown",
        "stats_visible",
        "badges_displayed",
        "edit_button_works",
      ],
    },
    {
      name: "Goal Tracker",
      path: "src/components/profile/GoalTracker.tsx",
      tests: [
        "goals_list_renders",
        "progress_bars_shown",
        "add_goal_button",
        "edit_goal_works",
        "delete_goal_works",
        "completion_celebration",
      ],
    },

    // ========== ERROR & LOADING COMPONENTS ==========
    {
      name: "Error Boundary",
      path: "src/components/error-boundary/error-boundary.tsx",
      tests: [
        "catches_errors",
        "error_message_displays",
        "retry_button_works",
        "fallback_ui_shows",
        "error_logged",
      ],
    },
    {
      name: "Page Loader",
      path: "src/components/ui/page-loader.tsx",
      tests: [
        "loader_displays",
        "loading_animation",
        "centered_properly",
        "timeout_handling",
      ],
    },

    // ========== ACCESSIBILITY COMPONENTS ==========
    {
      name: "Skip Links",
      path: "src/components/accessibility/skip-links.tsx",
      tests: [
        "skip_links_present",
        "keyboard_accessible",
        "navigation_works",
        "hidden_until_focus",
      ],
    },
    {
      name: "Focus Trap",
      path: "src/components/accessibility/focus-trap.tsx",
      tests: [
        "focus_contained",
        "tab_cycles_within",
        "escape_releases",
        "initial_focus_set",
      ],
    },
  ],

  // ============================================================================
  // UI ELEMENT TESTING
  // ============================================================================
  uiElements: {
    // Test all interactive elements
    buttons: {
      tests: [
        "all_buttons_clickable",
        "disabled_buttons_not_clickable",
        "loading_buttons_show_spinner",
        "icon_buttons_have_labels",
        "button_hover_effects",
        "button_focus_indicators",
        "button_sizes_consistent",
        "rtl_button_alignment",
      ],
    },
    links: {
      tests: [
        "all_links_navigable",
        "external_links_open_new_tab",
        "active_links_highlighted",
        "link_hover_underline",
        "visited_links_styled",
        "broken_links_none",
        "rtl_link_direction",
      ],
    },
    forms: {
      tests: [
        "all_inputs_accessible",
        "labels_associated",
        "validation_messages_clear",
        "required_fields_marked",
        "error_states_visible",
        "success_states_shown",
        "autocomplete_appropriate",
        "rtl_form_layout",
      ],
    },
    navigation: {
      tests: [
        "main_nav_accessible",
        "mobile_menu_works",
        "breadcrumbs_accurate",
        "back_button_functional",
        "dropdown_menus_work",
        "keyboard_navigation",
        "current_page_indicated",
        "rtl_navigation_correct",
      ],
    },
    images: {
      tests: [
        "all_images_load",
        "alt_text_present",
        "lazy_loading_works",
        "responsive_images",
        "broken_images_handled",
        "image_aspect_ratios",
      ],
    },
    icons: {
      tests: [
        "all_icons_render",
        "icon_sizes_consistent",
        "icon_colors_appropriate",
        "icon_alignment_correct",
        "rtl_icons_mirrored",
      ],
    },
  },

  // ============================================================================
  // ACCESSIBILITY TESTING
  // ============================================================================
  accessibility: {
    enabled: true,
    standards: ["WCAG2.1", "WCAG2.2"],
    level: "AA",
    tests: [
      "color_contrast_ratios",
      "keyboard_navigation_complete",
      "focus_indicators_visible",
      "aria_labels_present",
      "heading_hierarchy",
      "alt_text_descriptive",
      "form_labels_associated",
      "error_identification",
      "skip_navigation_links",
      "language_attribute",
      "rtl_support",
      "screen_reader_friendly",
    ],
  },

  // ============================================================================
  // RESPONSIVE TESTING
  // ============================================================================
  responsive: {
    enabled: true,
    breakpoints: [
      { name: "mobile-small", width: 320 },
      { name: "mobile", width: 375 },
      { name: "mobile-large", width: 428 },
      { name: "tablet", width: 768 },
      { name: "tablet-large", width: 1024 },
      { name: "desktop", width: 1280 },
      { name: "desktop-large", width: 1920 },
      { name: "desktop-xl", width: 2560 },
    ],
    tests: [
      "layout_adapts",
      "text_readable",
      "images_scale",
      "navigation_responsive",
      "touch_targets_adequate",
      "horizontal_scroll_none",
      "content_fits_viewport",
    ],
  },

  // ============================================================================
  // VISUAL TESTING
  // ============================================================================
  visual: {
    enabled: true,
    tests: [
      "theme_consistency",
      "color_scheme_correct",
      "typography_consistent",
      "spacing_uniform",
      "alignment_proper",
      "shadows_appropriate",
      "borders_consistent",
      "animations_smooth",
      "dark_light_themes",
      "rtl_ltr_layouts",
    ],
  },

  // ============================================================================
  // PERFORMANCE TESTING
  // ============================================================================
  performance: {
    enabled: true,
    metrics: [
      "page_load_time",
      "time_to_interactive",
      "first_contentful_paint",
      "largest_contentful_paint",
      "cumulative_layout_shift",
      "total_blocking_time",
    ],
    thresholds: {
      loadTime: 3000, // 3 seconds
      interactive: 3500,
      fcp: 1800,
      lcp: 2500,
      cls: 0.1,
      tbt: 200,
    },
  },

  // ============================================================================
  // RTL/LTR TESTING (Arabic/English)
  // ============================================================================
  internationalization: {
    enabled: true,
    languages: ["ar", "en"],
    tests: [
      "rtl_layout_correct",
      "text_direction_proper",
      "icons_mirrored_appropriately",
      "navigation_reversed",
      "forms_aligned_correctly",
      "tables_direction_correct",
      "charts_orientation",
      "animations_direction",
    ],
  },

  // ============================================================================
  // CROSS-BROWSER TESTING
  // ============================================================================
  browsers: {
    chrome: { enabled: true, versions: ["latest", "latest-1"] },
    firefox: { enabled: true, versions: ["latest"] },
    safari: { enabled: true, versions: ["latest"] },
    edge: { enabled: true, versions: ["latest"] },
  },

  // Test execution settings
  execution: {
    parallel: true,
    maxWorkers: 4,
    retries: 2,
    timeout: 30000,
    screenshots: "on-failure",
    video: "on-failure",
    trace: "on-failure",
  },

  // Reporting
  reporting: {
    console: true,
    html: true,
    json: true,
    outputDir: "./test-results",
    detailedReport: true,
  },
};

