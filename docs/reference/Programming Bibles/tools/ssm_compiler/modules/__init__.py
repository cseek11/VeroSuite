"""
SSM Compiler Modules

Modular architecture for Markdown → SSM compilation:
- parser_markdown: Streaming markdown parser → AST
- parser_ssm: AST → SSM v2 blocks
- extractor_*: Various extraction modules
- enrichment_v3: Version 3 enrichment capabilities
- plugins: Language-specific plugins
"""

__version__ = "3.0.0"

