export declare class HTMLDashboardGenerator {
    private reports;
    private dashboardData;
    constructor();
    collectReports(): Promise<void>;
    analyzeReports(): void;
    generateHtmlReport(): string;
    generateAndSaveDashboard(filename?: string): Promise<void>;
}
