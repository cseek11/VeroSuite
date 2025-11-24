package ux_test

import rego.v1
import data.verofield.ux

# ============================================================================
# R20: UX Consistency Tests
# ============================================================================

# Test: R20-W01 - Custom spacing values detected
test_r20_w01_custom_spacing if {
    result := ux.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/pages/CreateCustomer.tsx",
                "diff": "className=\"p-[12px] mb-[20px]\""
            }
        ]
    }
    
    some warning in result
    contains(warning, "WARNING [UX/R20]: File frontend/src/pages/CreateCustomer.tsx uses custom spacing values")
    contains(warning, "p-[12px]")
    contains(warning, "Use standard Tailwind utilities")
}

# Test: R20-W01 - No warning if standard spacing used
test_r20_w01_no_warning_standard_spacing if {
    result := ux.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/pages/CreateCustomer.tsx",
                "diff": "className=\"p-3 mb-4\""
            }
        ]
    }
    
    count([warning | some warning in result; contains(warning, "WARNING [UX/R20]: File frontend/src/pages/CreateCustomer.tsx uses custom spacing values")]) == 0
}

# Test: R20-W02 - Spacing inconsistent with similar pages
test_r20_w02_spacing_inconsistent if {
    result := ux.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/pages/CreateInvoice.tsx",
                "spacing_class": "p-4",
                "similar_page_path": "frontend/src/pages/CreateCustomer.tsx",
                "similar_page_spacing_class": "p-3"
            }
        ]
    }
    
    some warning in result
    contains(warning, "WARNING [UX/R20]: File frontend/src/pages/CreateInvoice.tsx uses spacing 'p-4' but similar page")
    contains(warning, "CreateCustomer.tsx")
}

# Test: R20-W03 - Spacing doesn't match design system
test_r20_w03_spacing_design_system if {
    result := ux.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/pages/CreateCustomer.tsx",
                "spacing_class": "p-5",
                "design_system_spacing_class": "p-3"
            }
        ]
    }
    
    some warning in result
    contains(warning, "WARNING [UX/R20]: File frontend/src/pages/CreateCustomer.tsx uses spacing 'p-5' but design system specifies 'p-3'")
}

# Test: R20-W04 - Custom typography values detected
test_r20_w04_custom_typography if {
    result := ux.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/pages/CreateCustomer.tsx",
                "diff": "className=\"text-[18px]\""
            }
        ]
    }
    
    some warning in result
    contains(warning, "WARNING [UX/R20]: File frontend/src/pages/CreateCustomer.tsx uses custom typography values")
    contains(warning, "text-[18px]")
    contains(warning, "Use design system typography scale")
}

# Test: R20-W04 - No warning if standard typography used
test_r20_w04_no_warning_standard_typography if {
    result := ux.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/pages/CreateCustomer.tsx",
                "diff": "className=\"text-2xl font-bold\""
            }
        ]
    }
    
    count([warning | some warning in result; contains(warning, "WARNING [UX/R20]: File frontend/src/pages/CreateCustomer.tsx uses custom typography values")]) == 0
}

# Test: R20-W05 - Typography inconsistent with similar pages
test_r20_w05_typography_inconsistent if {
    result := ux.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/pages/CreateInvoice.tsx",
                "typography_class": "text-xl",
                "similar_page_path": "frontend/src/pages/CreateCustomer.tsx",
                "similar_page_typography_class": "text-2xl"
            }
        ]
    }
    
    some warning in result
    contains(warning, "WARNING [UX/R20]: File frontend/src/pages/CreateInvoice.tsx uses typography 'text-xl' but similar page")
    contains(warning, "CreateCustomer.tsx")
}

# Test: R20-W06 - Typography doesn't match design system
test_r20_w06_typography_design_system if {
    result := ux.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/pages/CreateCustomer.tsx",
                "typography_class": "text-xl",
                "design_system_typography_class": "text-2xl"
            }
        ]
    }
    
    some warning in result
    contains(warning, "WARNING [UX/R20]: File frontend/src/pages/CreateCustomer.tsx uses typography 'text-xl' but design system specifies 'text-2xl'")
}

# Test: R20-W07 - Component not from design system
test_r20_w07_relative_import if {
    result := ux.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/pages/CreateCustomer.tsx",
                "diff": "import Button from '../components/Button'"
            }
        ]
    }
    
    some warning in result
    contains(warning, "WARNING [UX/R20]: File frontend/src/pages/CreateCustomer.tsx imports components from relative path")
    contains(warning, "Use '@/components/ui/' imports")
}

# Test: R20-W07 - No warning if design system import used
test_r20_w07_no_warning_design_system_import if {
    result := ux.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/pages/CreateCustomer.tsx",
                "diff": "import Button from '@/components/ui/Button'"
            }
        ]
    }
    
    count([warning | some warning in result; contains(warning, "WARNING [UX/R20]: File frontend/src/pages/CreateCustomer.tsx imports components from relative path")]) == 0
}

# Test: R20-W08 - Component not in component library catalog
test_r20_w08_component_not_in_catalog if {
    result := ux.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/pages/CreateCustomer.tsx",
                "component_name": "CustomButton",
                "component_in_catalog": false
            }
        ]
    }
    
    some warning in result
    contains(warning, "WARNING [UX/R20]: File frontend/src/pages/CreateCustomer.tsx uses component 'CustomButton' that is not in component library catalog")
}

# Test: R20-W09 - Duplicate component detected
test_r20_w09_duplicate_component if {
    result := ux.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/components/CustomButton.tsx",
                "is_new_component": true,
                "component_name": "CustomButton",
                "similar_component_exists": true,
                "similar_component_name": "Button"
            }
        ]
    }
    
    some warning in result
    contains(warning, "WARNING [UX/R20]: File frontend/src/components/CustomButton.tsx creates new component 'CustomButton' but similar component 'Button' already exists")
}

# Test: R20-W10 - Basic Select used instead of CustomerSearchSelector
test_r20_w10_customer_field_component if {
    result := ux.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/pages/CreateWorkOrder.tsx",
                "has_customer_field": true,
                "uses_basic_select": true,
                "uses_customer_search_selector": false
            }
        ]
    }
    
    some warning in result
    contains(warning, "WARNING [UX/R20]: File frontend/src/pages/CreateWorkOrder.tsx uses basic Select for customer field")
    contains(warning, "Use CustomerSearchSelector component")
}

# Test: R20-W10 - No warning if CustomerSearchSelector used
test_r20_w10_no_warning_customer_search_selector if {
    result := ux.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/pages/CreateWorkOrder.tsx",
                "has_customer_field": true,
                "uses_basic_select": false,
                "uses_customer_search_selector": true
            }
        ]
    }
    
    count([warning | some warning in result; contains(warning, "WARNING [UX/R20]: File frontend/src/pages/CreateWorkOrder.tsx uses basic Select for customer field")]) == 0
}

# Test: R20-W11 - Custom color variants detected
test_r20_w11_custom_color if {
    result := ux.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/pages/CreateCustomer.tsx",
                "diff": "className=\"bg-[#FF6B6B] text-white\""
            }
        ]
    }
    
    some warning in result
    contains(warning, "WARNING [UX/R20]: File frontend/src/pages/CreateCustomer.tsx uses custom color values")
    contains(warning, "bg-[#custom-color]")
    contains(warning, "Use standard component variants")
}

# Test: R20-W11 - No warning if standard variant used
test_r20_w11_no_warning_standard_variant if {
    result := ux.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/pages/CreateCustomer.tsx",
                "diff": "<Button variant=\"primary\">Save</Button>"
            }
        ]
    }
    
    count([warning | some warning in result; contains(warning, "WARNING [UX/R20]: File frontend/src/pages/CreateCustomer.tsx uses custom color values")]) == 0
}

# Test: R20-W12 - Component variant doesn't match design system
test_r20_w12_variant_design_system if {
    result := ux.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/pages/CreateCustomer.tsx",
                "variant_class": "bg-blue-500",
                "design_system_variant_class": "variant=\"primary\""
            }
        ]
    }
    
    some warning in result
    contains(warning, "WARNING [UX/R20]: File frontend/src/pages/CreateCustomer.tsx uses variant 'bg-blue-500' but design system specifies 'variant=\"primary\"'")
}

# Test: Multiple violations in same file
test_r20_multiple_violations if {
    result := ux.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/pages/CreateCustomer.tsx",
                "diff": "className=\"p-[12px] text-[18px] bg-[#FF6B6B]\"",
                "spacing_class": "p-[12px]",
                "typography_class": "text-[18px]",
                "variant_class": "bg-[#FF6B6B]"
            }
        ]
    }
    
    # Should have multiple warnings
    count([warning | some warning in result; contains(warning, "WARNING [UX/R20]")]) >= 3
}

# Test: No violations
test_r20_no_violations if {
    result := ux.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/pages/CreateCustomer.tsx",
                "diff": "className=\"p-3 text-2xl\"",
                "spacing_class": "p-3",
                "typography_class": "text-2xl",
                "component_in_catalog": true,
                "uses_customer_search_selector": true
            }
        ]
    }
    
    count([warning | some warning in result; contains(warning, "WARNING [UX/R20]")]) == 0
}

