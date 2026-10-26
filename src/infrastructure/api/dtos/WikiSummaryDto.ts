export interface WikiSummaryDto {
  title: string;
  thumbnail?: { source: string };
  originalimage?: { source: string };
  extract_html?: string;
  extract?: string;
}
