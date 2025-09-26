# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Shopify Storefront Web Components landing page project. It creates a product showcase website using Shopify's web components to display products from the store c2da09-15.myshopify.com.

## Development Setup

The project uses vanilla HTML, CSS, and JavaScript with Shopify Storefront Web Components loaded from CDN. No build tools or package managers are required - simply open index.html in a browser.

## Commands

No build commands needed. To develop:
- Open index.html in a web browser to view the landing page
- Edit HTML/CSS directly for styling changes
- Update product handles in shopify-context components to display different products

## Architecture

- **index.html**: Main landing page with Shopify Web Components
- **Shopify Components Used**:
  - `shopify-store`: Store configuration (c2da09-15.myshopify.com)
  - `shopify-context`: Product data context
  - `shopify-data`: Display product information
  - `shopify-media`: Product images
  - `shopify-money`: Price formatting
  - `shopify-variant-selector`: Product options
  - `shopify-cart`: Shopping cart functionality

## Configuration

- Store domain: c2da09-15.myshopify.com
- Locale: US/English
- Claude Code permissions: MCP bash commands and Shopify.dev documentation access
- Project is not currently a git repository

## Product Setup

To display actual products, replace 'sample-product-handle' in shopify-context components with real product handles from your Shopify store. Add access tokens if displaying inventory or private product data.