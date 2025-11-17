export declare const kpiTemplates: ({
    name: string;
    description: string;
    category: string;
    template_type: string;
    formula_expression: string;
    formula_fields: {
        field_name: string;
        field_type: string;
        table_name: string;
        column_name: string;
        aggregation_type: string;
        display_name: string;
        description: string;
    }[];
    threshold_config: {
        green: number;
        yellow: number;
        red: number;
        unit: string;
    };
    chart_config: {
        type: string;
        colorScheme: string[];
    };
    data_source_config: {
        table: string;
        timeRange: string;
    };
    tags: string[];
    is_public: boolean;
    is_featured: boolean;
    id?: never;
} | {
    id: string;
    name: string;
    description: string;
    category: string;
    template_type: string;
    formula_expression: string;
    formula_fields: {
        field_name: string;
        field_type: string;
        table_name: string;
        column_name: string;
        aggregation_type: string;
        display_name: string;
        description: string;
    }[];
    threshold_config: {
        green: number;
        yellow: number;
        red: number;
        unit: string;
    };
    chart_config: {
        type: string;
        colorScheme: string[];
    };
    data_source_config: {
        table: string;
        timeRange: string;
    };
    tags: string[];
    is_public: boolean;
    is_featured: boolean;
})[];
export default kpiTemplates;
