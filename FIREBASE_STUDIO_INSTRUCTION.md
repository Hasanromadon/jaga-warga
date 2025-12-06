# Project Overview

This project is a comprehensive management system for residential complexes, designed to simplify administrative tasks and improve communication between residents and property managers. The primary users of this application are property managers, who will use the dashboard to manage billing, resident data, and financial records.

# Grand Design UI

## Color Palette:

- **Primary:** Blue (variants like `#3973C4`, `#E0EDFF`, `#F0F7FF`)
- **Secondary:** Neutral grays and blacks for text and backgrounds (e.g., `#0F172A`, `#64748B`, `#F1F5F9`)
- **Accent:** Green for success states (`#10B981`), red for error states (`#EF4444`), and orange/purple for informational elements.

## Typography:

- **Font:** The application uses a sans-serif font, likely Inter or a similar modern typeface.
- **Sizing:** Headings should be larger and bolder than body text. Use a consistent type scale to maintain visual hierarchy.
- **Weight:** Use font weight to emphasize important information. For example, use bold for card titles and key metrics.

## Component Styling:

- **Cards:** Use rounded corners and subtle drop shadows to create a sense of depth and separation from the background.
- **Buttons:** Buttons should have clear states (default, hover, active, disabled) and use the primary color for primary actions.
- **Forms:** Form elements should be well-spaced and have clear labels. Use consistent styling for inputs, selects, and text areas.

# Focusing

The application's core functionalities revolve around the following user flows:

- **Dashboard:** Provide a quick overview of the residential complex's financial status, including income, expenses, and pending bills.
- **Billing:** Allow property managers to create, view, and manage bills for residents.
- **Resident Management:** Provide a way to add, view, and edit resident information.
- **Financial Records:** Enable property managers to track income and expenses.
- **Reporting:** Generate reports on financial activity and other key metrics.

# AI Guide

## File Naming Conventions:

- **Components:** Use PascalCase for component file names (e.g., `ResidentList.tsx`).
- **Hooks:** Use camelCase with the `use` prefix for custom hooks (e.g., `useResidents.ts`).
- **Utilities:** Use camelCase for utility files (e.g., `formatDate.ts`).

## Component Creation:

- **Structure:** Components should be well-structured and easy to read. Use functional components with hooks.
- **Props:** Use TypeScript to define component props for type safety.
- **Styling:** Use Tailwind CSS for styling. Keep styling consistent with the grand design principles.

## Code Style:

- **Formatting:** Use a consistent code style. Use a tool like Prettier to automate code formatting.
- **Comments:** Add comments to explain complex logic or important decisions.
- **Imports:** Keep imports organized and easy to read.
- **Error Handling:** Implement proper error handling to provide a good user experience.
- **API Calls:** Use custom hooks to encapsulate API calls and data fetching logic.

By following these guidelines, we can ensure that the project remains consistent, maintainable, and easy to work with for all contributors, including AI assistants.
