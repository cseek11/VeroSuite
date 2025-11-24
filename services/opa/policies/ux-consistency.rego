# R13: UX Consistency Policy
# Ensures consistent UI/UX patterns across the app
# Tier: 3 (WARNING)

# R19: Accessibility Requirements Policy
# Ensures UI components meet WCAG AA accessibility standards
# Tier: 3 (WARNING)

package verofield.ux

import future.keywords.if
import future.keywords.in

# Default decision
default allow := true

# ============================================================================
# R19: Accessibility Requirements
# WARNING-level enforcement (Tier 3 MAD)
# Ensures UI components meet WCAG AA accessibility standards
# ============================================================================

# Helper: Check if exemption has expired
accessibility_exemption_expired(exemption) if {
    expiration_date := time.parse_rfc3339_ns(exemption.expiration)
    current_date := time.now_ns()
    expiration_date < current_date
}

# Helper: Check if component has accessibility exemption
has_accessibility_exemption(component, exemptions) if {
    some exemption in exemptions
    exemption.component == component
}

# Helper: Check if contrast ratio meets WCAG AA
contrast_meets_wcag_aa(contrast_ratio, is_large_text) if {
    is_large_text
    contrast_ratio >= 3.0
}

contrast_meets_wcag_aa(contrast_ratio, is_large_text) if {
    not is_large_text
    contrast_ratio >= 4.5
}

# Helper: Get required contrast ratio for WCAG AA
get_required_contrast_ratio(is_large_text) := 3.0 if {
    is_large_text
}

get_required_contrast_ratio(is_large_text) := 4.5 if {
    not is_large_text
}

# Helper: Check if component is critical (auth, payment, checkout)
is_critical_component(component) if {
    contains(component, "auth")
}

is_critical_component(component) if {
    contains(component, "payment")
}

is_critical_component(component) if {
    contains(component, "checkout")
}

# Helper: Check if component is user-facing (not admin-only)
is_user_facing_component(component) if {
    not contains(component, "admin")
    not contains(component, "internal")
}

# R19-W01: Missing ARIA labels on interactive elements
accessibility_warnings[msg] if {
    some component in input.ui_components
    
    # Check if interactive element without visible text
    component.has_interactive_element
    not component.has_visible_text
    not component.has_aria_label
    not component.has_aria_labelledby
    
    # Check if no exemption exists
    not has_accessibility_exemption(component.path, input.accessibility_exemptions)
    
    msg := sprintf(
        "WARNING [UX/R19]: Component %s has interactive element without ARIA label. Add aria-label or aria-labelledby for screen reader support (WCAG AA 4.1.2).",
        [component.path]
    )
}

# R19-W02: Color contrast below WCAG AA
accessibility_warnings[msg] if {
    some component in input.ui_components
    
    # Check color contrast
    contrast_ratio := component.contrast_ratio
    is_large_text := component.is_large_text
    
    not contrast_meets_wcag_aa(contrast_ratio, is_large_text)
    
    # Check if no exemption exists
    not has_accessibility_exemption(component.path, input.accessibility_exemptions)
    
    # Get required ratio based on text size
    required_ratio := get_required_contrast_ratio(is_large_text)
    
    msg := sprintf(
        "WARNING [UX/R19]: Component %s has color contrast %.2f:1 (needs %.1f:1 for WCAG AA). Current: %s on %s. Improve contrast or add exemption (WCAG AA 1.4.3).",
        [component.path, contrast_ratio, required_ratio, component.foreground_color, component.background_color]
    )
}

# R19-W03: Missing keyboard navigation (mouse-only interactions)
accessibility_warnings[msg] if {
    some component in input.ui_components
    
    # Check if component has mouse-only interactions
    component.has_mouse_only_interaction
    not component.has_keyboard_support
    
    # Check if no exemption exists
    not has_accessibility_exemption(component.path, input.accessibility_exemptions)
    
    msg := sprintf(
        "WARNING [UX/R19]: Component %s has mouse-only interactions without keyboard support. Add keyboard navigation (Tab, Enter, Space, Arrow keys) for accessibility (WCAG AA 2.1.1).",
        [component.path]
    )
}

# R19-W04: Missing focus indicators
accessibility_warnings[msg] if {
    some component in input.ui_components
    
    # Check if component has interactive elements but no focus indicators
    component.has_interactive_element
    not component.has_focus_indicator
    
    # Check if no exemption exists
    not has_accessibility_exemption(component.path, input.accessibility_exemptions)
    
    msg := sprintf(
        "WARNING [UX/R19]: Component %s has interactive elements without visible focus indicators. Add focus styles (outline, border, or background change) for keyboard users (WCAG AA 2.4.7).",
        [component.path]
    )
}

# R19-W05: Accessibility exemption expired
accessibility_warnings[msg] if {
    some exemption in input.accessibility_exemptions
    accessibility_exemption_expired(exemption)
    
    msg := sprintf(
        "WARNING [UX/R19]: Accessibility exemption expired for %s. Expiration: %s. Update exemption or fix accessibility issue.",
        [exemption.component, exemption.expiration]
    )
}

# R19-W06: Accessibility exemption missing justification
accessibility_warnings[msg] if {
    some exemption in input.accessibility_exemptions
    # Check if justification is missing
    not exemption.justification
    
    msg := sprintf(
        "WARNING [UX/R19]: Accessibility exemption for %s is missing justification. Add justification explaining why exemption is needed.",
        [exemption.component]
    )
}

accessibility_warnings[msg] if {
    some exemption in input.accessibility_exemptions
    # Check if justification is empty string
    exemption.justification == ""
    
    msg := sprintf(
        "WARNING [UX/R19]: Accessibility exemption for %s is missing justification. Add justification explaining why exemption is needed.",
        [exemption.component]
    )
}

# R19-W07: Accessibility exemption missing remediation plan
accessibility_warnings[msg] if {
    some exemption in input.accessibility_exemptions
    # Check if remediation is missing
    not exemption.remediation
    
    msg := sprintf(
        "WARNING [UX/R19]: Accessibility exemption for %s is missing remediation plan. Add plan explaining how to improve accessibility.",
        [exemption.component]
    )
}

accessibility_warnings[msg] if {
    some exemption in input.accessibility_exemptions
    # Check if remediation is empty string
    exemption.remediation == ""
    
    msg := sprintf(
        "WARNING [UX/R19]: Accessibility exemption for %s is missing remediation plan. Add plan explaining how to improve accessibility.",
        [exemption.component]
    )
}

# R19-W08: High-priority accessibility issue identified (critical component)
accessibility_warnings[msg] if {
    some issue in input.accessibility_issues
    issue.priority == "high"
    is_critical_component(issue.component)
    
    msg := sprintf(
        "WARNING [UX/R19]: High-priority accessibility issue: %s. Issue: %s, WCAG: %s, Severity: %s, Impact: %s. Estimated Effort: %s.",
        [issue.component, issue.description, issue.wcag_criteria, issue.severity, issue.impact, issue.effort]
    )
}

# R19-W08: High-priority accessibility issue identified (user-facing component)
accessibility_warnings[msg] if {
    some issue in input.accessibility_issues
    issue.priority == "high"
    not is_critical_component(issue.component)
    is_user_facing_component(issue.component)
    
    msg := sprintf(
        "WARNING [UX/R19]: High-priority accessibility issue: %s. Issue: %s, WCAG: %s, Severity: %s, Impact: %s. Estimated Effort: %s.",
        [issue.component, issue.description, issue.wcag_criteria, issue.severity, issue.impact, issue.effort]
    )
}

# R19-W09: Accessibility report not generated
accessibility_warnings[msg] if {
    not input.accessibility_report_generated
    
    msg := "WARNING [UX/R19]: Enhanced accessibility report not generated. Run: python .cursor/scripts/check-accessibility.py --generate-report"
}

# R19-W10: Accessibility trend not tracked
accessibility_warnings[msg] if {
    some component in input.ui_components
    not input.accessibility_history[component.path]
    
    msg := sprintf(
        "WARNING [UX/R19]: Accessibility trend not tracked for %s. Add accessibility history to .accessibility/history.json.",
        [component.path]
    )
}

# R19-W11: Missing form labels
accessibility_warnings[msg] if {
    some component in input.ui_components
    
    # Check if component has form inputs without labels
    component.has_form_input
    not component.has_label
    not component.has_aria_label
    not component.has_aria_labelledby
    
    # Check if no exemption exists
    not has_accessibility_exemption(component.path, input.accessibility_exemptions)
    
    msg := sprintf(
        "WARNING [UX/R19]: Component %s has form input without label. Add <label> element or aria-label/aria-labelledby for screen reader support (WCAG AA 1.3.1, 4.1.2).",
        [component.path]
    )
}

# R19-W12: Missing focus trap in modal
accessibility_warnings[msg] if {
    some component in input.ui_components
    
    # Check if component is a modal/dialog
    component.is_modal
    not component.has_focus_trap
    
    # Check if no exemption exists
    not has_accessibility_exemption(component.path, input.accessibility_exemptions)
    
    msg := sprintf(
        "WARNING [UX/R19]: Component %s is a modal/dialog without focus trap. Implement focus trap to keep focus within modal for keyboard users (WCAG AA 2.4.3).",
        [component.path]
    )
}

# ============================================================================
# R20: UX Consistency
# WARNING-level enforcement (Tier 3 MAD)
# Ensures consistent UI/UX patterns across the app (spacing, typography, components, variants)
# ============================================================================

# Helper: Check if spacing class is custom (not standard Tailwind)
is_custom_spacing_class(class) if {
    regex.match(`^(p|m|px|py|mx|my|pt|pb|pl|pr|mt|mb|ml|mr|space-[xy])-\[`, class)
}

# Helper: Check if typography class is custom (not standard Tailwind)
is_custom_typography_class(class) if {
    regex.match(`^text-\[`, class)
}

# Helper: Check if color class is custom (not standard Tailwind)
is_custom_color_class(class) if {
    regex.match(`^(bg|text|border)-\[`, class)
}

# Helper: Check if component is from design system
is_design_system_component(import_path) if {
    startswith(import_path, "@/components/ui/")
}

# Helper: Check if component is CustomerSearchSelector (required for customer fields)
is_customer_search_selector(component_name) if {
    component_name == "CustomerSearchSelector"
}

# Helper: Check if page is similar (same type, same domain)
is_similar_page(page1, page2) if {
    page1.type == page2.type
    page1.domain == page2.domain
    page1.action == page2.action
}

# R20-W01: Custom spacing values detected (pattern matching) - .tsx files
ux_consistency_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".tsx")
    
    # Check for custom spacing classes in diff
    regex.match(`(p|m|px|py|mx|my|pt|pb|pl|pr|mt|mb|ml|mr|space-[xy])-\[`, file.diff)
    
    msg := sprintf(
        "WARNING [UX/R20]: File %s uses custom spacing values. Use standard Tailwind utilities (p-3, p-4, mb-4, space-y-4) instead of custom values (p-[12px], mb-[20px]).",
        [file.path]
    )
}

# R20-W01: Custom spacing values detected (pattern matching) - .ts files
ux_consistency_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".ts")
    
    # Check for custom spacing classes in diff
    regex.match(`(p|m|px|py|mx|my|pt|pb|pl|pr|mt|mb|ml|mr|space-[xy])-\[`, file.diff)
    
    msg := sprintf(
        "WARNING [UX/R20]: File %s uses custom spacing values. Use standard Tailwind utilities (p-3, p-4, mb-4, space-y-4) instead of custom values (p-[12px], mb-[20px]).",
        [file.path]
    )
}

# R20-W02: Spacing inconsistent with similar pages (comparison)
ux_consistency_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".tsx")
    
    # Check if spacing differs from similar pages
    file.spacing_class != file.similar_page_spacing_class
    file.similar_page_spacing_class != ""
    
    msg := sprintf(
        "WARNING [UX/R20]: File %s uses spacing '%s' but similar page '%s' uses '%s'. Consider matching spacing for consistency.",
        [file.path, file.spacing_class, file.similar_page_path, file.similar_page_spacing_class]
    )
}

# R20-W03: Spacing doesn't match design system (design system validation)
ux_consistency_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".tsx")
    
    # Check if spacing doesn't match design system
    file.spacing_class != file.design_system_spacing_class
    file.design_system_spacing_class != ""
    
    msg := sprintf(
        "WARNING [UX/R20]: File %s uses spacing '%s' but design system specifies '%s'. Update to match design system.",
        [file.path, file.spacing_class, file.design_system_spacing_class]
    )
}

# R20-W04: Custom typography values detected (pattern matching) - .tsx files
ux_consistency_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".tsx")
    
    # Check for custom typography classes in diff
    regex.match(`text-\[`, file.diff)
    
    msg := sprintf(
        "WARNING [UX/R20]: File %s uses custom typography values. Use design system typography scale (text-2xl, text-xl, text-lg, text-base, text-sm, text-xs) instead of custom values (text-[14px], text-[18px]).",
        [file.path]
    )
}

# R20-W04: Custom typography values detected (pattern matching) - .ts files
ux_consistency_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".ts")
    
    # Check for custom typography classes in diff
    regex.match(`text-\[`, file.diff)
    
    msg := sprintf(
        "WARNING [UX/R20]: File %s uses custom typography values. Use design system typography scale (text-2xl, text-xl, text-lg, text-base, text-sm, text-xs) instead of custom values (text-[14px], text-[18px]).",
        [file.path]
    )
}

# R20-W05: Typography inconsistent with similar pages (comparison)
ux_consistency_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".tsx")
    
    # Check if typography differs from similar pages
    file.typography_class != file.similar_page_typography_class
    file.similar_page_typography_class != ""
    
    msg := sprintf(
        "WARNING [UX/R20]: File %s uses typography '%s' but similar page '%s' uses '%s'. Consider matching typography for consistency.",
        [file.path, file.typography_class, file.similar_page_path, file.similar_page_typography_class]
    )
}

# R20-W06: Typography doesn't match design system (design system validation)
ux_consistency_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".tsx")
    
    # Check if typography doesn't match design system
    file.typography_class != file.design_system_typography_class
    file.design_system_typography_class != ""
    
    msg := sprintf(
        "WARNING [UX/R20]: File %s uses typography '%s' but design system specifies '%s'. Update to match design system.",
        [file.path, file.typography_class, file.design_system_typography_class]
    )
}

# R20-W07: Component not from design system (import checking) - .tsx files
ux_consistency_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".tsx")
    
    # Check for components not imported from design system
    regex.match(`import.*from.*['"]\.\.\/.*components`, file.diff)
    not regex.match(`import.*from.*['"]@/components/ui/`, file.diff)
    
    msg := sprintf(
        "WARNING [UX/R20]: File %s imports components from relative path instead of design system. Use '@/components/ui/' imports for design system components.",
        [file.path]
    )
}

# R20-W07: Component not from design system (import checking) - .ts files
ux_consistency_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".ts")
    
    # Check for components not imported from design system
    regex.match(`import.*from.*['"]\.\.\/.*components`, file.diff)
    not regex.match(`import.*from.*['"]@/components/ui/`, file.diff)
    
    msg := sprintf(
        "WARNING [UX/R20]: File %s imports components from relative path instead of design system. Use '@/components/ui/' imports for design system components.",
        [file.path]
    )
}

# R20-W08: Component not in component library catalog (catalog validation)
ux_consistency_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".tsx")
    
    # Check if component is not in catalog
    file.component_name != ""
    not file.component_in_catalog
    
    msg := sprintf(
        "WARNING [UX/R20]: File %s uses component '%s' that is not in component library catalog. Check docs/COMPONENT_LIBRARY_CATALOG.md for available components.",
        [file.path, file.component_name]
    )
}

# R20-W09: Duplicate component detected (duplicate detection)
ux_consistency_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".tsx")
    
    # Check if similar component already exists
    file.is_new_component
    file.similar_component_exists
    
    msg := sprintf(
        "WARNING [UX/R20]: File %s creates new component '%s' but similar component '%s' already exists. Consider reusing existing component instead.",
        [file.path, file.component_name, file.similar_component_name]
    )
}

# R20-W10: Basic Select used instead of CustomerSearchSelector for customer fields
ux_consistency_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".tsx")
    
    # Check if basic Select is used for customer field
    file.has_customer_field
    file.uses_basic_select
    not file.uses_customer_search_selector
    
    msg := sprintf(
        "WARNING [UX/R20]: File %s uses basic Select for customer field. Use CustomerSearchSelector component instead (from '@/components/ui/CustomerSearchSelector').",
        [file.path]
    )
}

# R20-W11: Custom color variants detected (pattern matching) - .tsx files
ux_consistency_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".tsx")
    
    # Check for custom color classes in diff
    regex.match(`(bg|text|border)-\[`, file.diff)
    
    msg := sprintf(
        "WARNING [UX/R20]: File %s uses custom color values. Use standard component variants (variant='primary', variant='secondary', variant='danger') instead of custom colors (bg-[#custom-color]).",
        [file.path]
    )
}

# R20-W11: Custom color variants detected (pattern matching) - .ts files
ux_consistency_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".ts")
    
    # Check for custom color classes in diff
    regex.match(`(bg|text|border)-\[`, file.diff)
    
    msg := sprintf(
        "WARNING [UX/R20]: File %s uses custom color values. Use standard component variants (variant='primary', variant='secondary', variant='danger') instead of custom colors (bg-[#custom-color]).",
        [file.path]
    )
}

# R20-W12: Component variant doesn't match design system (design system validation)
ux_consistency_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".tsx")
    
    # Check if variant doesn't match design system
    file.variant_class != file.design_system_variant_class
    file.design_system_variant_class != ""
    
    msg := sprintf(
        "WARNING [UX/R20]: File %s uses variant '%s' but design system specifies '%s'. Update to match design system.",
        [file.path, file.variant_class, file.design_system_variant_class]
    )
}

# Collect all warnings
warnings := [msg | accessibility_warnings[msg]]
ux_warnings := [msg | ux_consistency_warnings[msg]]

# Main warn rule - collects all warnings from R19 and R20
warn contains msg if {
    some warning in warnings
    msg := warning
}

warn contains msg if {
    some warning in ux_warnings
    msg := warning
}

