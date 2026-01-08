
# Project Overview

# Tech Stack
---

# Features Documentation
---

# Page & Information Architecture
---

# Step-by-Step Page Content Descriptions

Below is a step-by-step breakdown of the content and user flow for each main page in the Jaga Warga application:

## 1. Landing/Home (`/`)
1. Display header with logo and complex name.
2. Show feature highlights and promo preview.
3. Provide action buttons for resident bill check and login.
4. Footer with copyright.

## 2. Login (`/login`)
1. Show logo and app name.
2. Display login form for admin/manager credentials.
3. Show info about secure access.
4. On successful login, redirect to dashboard.

## 3. Resident Bill Search (`/warga`)
1. Display header and search form (block, house number, month, year).
2. On search, fetch bill data from Firestore.
3. Show bill details if found.
4. Allow resident to upload payment proof.
5. Show feedback (success/error) via toast.

## 4. Resident Info (`/warga/[residential_id]`)
1. Display management contacts and complex info.
2. Show resident list and search.
3. Allow bill search and payment upload as above.

## 5. Bills List (`/bills`)
1. Show list of bills for admin/manager.
2. Allow filtering, searching, and viewing details.
3. Link to bill detail page for payment confirmation.

## 6. Bill Detail (`/bills/[id]`)
1. Show bill details (amount, due date, resident info).
2. Allow upload of payment proof.
3. Show confirmation status.

## 7. Dashboard (`/dashboard`)
1. Display summary cards (income, expenses, pending bills).
2. Show quick links to main features (bills, residents, finance, reports, ads).
3. Provide recent activity and notifications.

## 8. Bill Management (`/dashboard/tagihan`)
1. List all bills with status.
2. Allow creation, editing, and deletion of bills.
3. Bulk import bills via CSV.
4. Confirm payments and upload proof.

## 9. Financial Records (`/dashboard/keuangan`)
1. List all transactions (income/expense).
2. Filter and summarize data.
3. Link to add new finance record.

## 10. Add Finance Record (`/dashboard/catat-keuangan`)
1. Show form to add new transaction.
2. Validate and submit data to Firestore.
3. Show feedback (success/error).

## 11. Reports (`/dashboard/laporan`)
1. Display monthly and custom financial reports.
2. Allow export/print of reports.

## 12. Promo & Ads (`/dashboard/iklan`)
1. List all ads and promos.
2. Show ad generator modal for new ad creation.
3. Allow editing and publishing of ads.

## 13. Resident Management (`/dashboard/warga`)
1. List all residents with search/filter.
2. Add, edit, and delete resident data.
3. View resident profiles.

## 14. Profile (`/dashboard/profil`)
1. Show admin/manager profile card.
2. Allow editing of profile info and password.

## 15. Bill Confirmation (`/dashboard/konfirmasi`)
1. List bills awaiting confirmation.
2. View payment proof and confirm/reject payments.

## 16. Demo/Preview (`/dashboard?demo=true`)
1. Simulate dashboard and resident data for demo purposes.
2. Allow exploration of features without affecting real data.

---
---

# Public & Private Route Architecture

This section clarifies which routes are public (accessible to all users) and which are private (protected, require authentication):

## Public Routes

Accessible to all users (residents, guests, unauthenticated):

- `/` — Landing/Home: General info, feature highlights, promo preview
- `/warga` — Resident bill search, bill details, payment upload
- `/warga/[residential_id]` — Resident-specific info, management contacts, bill search, payment upload
- `/promo` — Public promo/ad preview
- `/login` — Login page for admins/managers
- `/bills/[id]` — Bill detail and payment upload (if accessed via public link)

## Private (Protected) Routes

Require authentication (admin/manager):

- `/dashboard` — Main dashboard overview
- `/dashboard/tagihan` — Bill management (create, edit, confirm, bulk import)
- `/dashboard/keuangan` — Financial records and transaction management
- `/dashboard/laporan` — Financial reports and summaries
- `/dashboard/iklan` — Promo/ad management and generator
- `/dashboard/profil` — Admin/manager profile management
- `/dashboard/warga` — Resident management (add, edit, view)
- `/dashboard/konfirmasi` — Bill payment confirmation
- `/dashboard/catat-keuangan` — Add finance record
- `/bills` — Bill list (admin view)
- `/laporan` — Reports (admin view)

## Route Protection

- All `/dashboard/*`, `/bills`, `/laporan` routes are protected by authentication and role checks.
- Public routes are accessible without login, but some may show limited data or require resident identification.

---

This section describes the main pages of the Jaga Warga application, their purposes, and how users navigate between them:

## Main Pages

### 1. Dashboard (`/dashboard`)
- Overview of financial status, key metrics, and quick actions.
- Entry point for most management tasks.

### 2. Bills (`/bills`)
- List, create, edit, and confirm bills for residents.
- Bulk import and payment confirmation features.

### 3. Residents (`/warga`)
- View, add, edit, and search resident data.
- Resident profile details and management.

### 4. Financial Records (`/dashboard/keuangan`)
- Add and view general transactions (income/expense).
- Filter and summarize financial data.

### 5. Reports (`/dashboard/laporan`)
- Monthly and custom financial reports.
- Export and print options for accounting.

### 6. Promo & Ads (`/dashboard/iklan`)
- Create and manage promotional content and resident ads.
- Ad generator modal for easy creation.

### 7. Profile (`/dashboard/profil`)
- View and edit property manager/admin profile.
- Change password and update contact info.

### 8. Login (`/login`)
- Secure login for property managers and admins.
- Redirects to dashboard upon successful authentication.

### 9. Demo/Preview (`/dashboard?demo=true`)
- Preview mode for demo purposes, simulating data and features.

## Navigation Structure

- Main navigation is accessible via sidebar and top bar on desktop, and a drawer/menu on mobile.
- Quick links and summary cards on the dashboard for fast access to key features.
- Protected routes ensure only authenticated users can access management pages.

## Information Flow

- Data flows from Firestore collections to custom hooks, then to page components.
- Actions (add, edit, delete) are performed via forms and modals, with feedback through toasts and overlays.
- All pages are designed to be responsive and accessible.

For more details, see the folder structure in `src/app` and the related components in `src/components`.

Below is a list of main features implemented in the Jaga Warga project, along with a brief description of each:

## 1. Dashboard
- Displays an overview of the residential complex’s financial status, including total income, expenses, pending bills, and key statistics.
- Quick access to important actions and summary cards for fast navigation.

## 2. Billing Management
- Create, view, edit, and delete bills for residents.
- Bulk import bills via CSV template.
- Confirm bill payments and upload proof of payment.
- Bill status tracking (paid/unpaid/confirmed).

## 3. Resident Management
- Add, view, edit, and delete resident data.
- Resident list with search and filter capabilities.
- Resident profile cards and details.

## 4. Financial Records
- Add, view, and manage general transactions (income/expense).
- Finance list with filtering and summary.
- Add finance records via form.

## 5. Reporting
- Generate and view monthly financial summaries.
- Export reports for accounting and management purposes.

## 6. Promo & Ads
- Create and manage promotional content and resident ads.
- Ad generator modal for easy ad creation.

## 7. Authentication & Authorization
- Login page for property managers and admins.
- Auth provider and protected routes for secure access.
- Redirect logic for authenticated users.

## 8. File Uploads
- Upload images (logo, proof of payment, ads) to Firebase Storage.
- File preview and validation.

## 9. Accessibility & UI Enhancements
- Accessible dialogs and modals with screen reader support.
- Responsive design for mobile and desktop.
- Consistent use of Tailwind CSS and shadcn/ui components.

## 10. Error Handling & Feedback
- Toast notifications for success/error states.
- Loading overlays and skeletons for async actions.

## 11. Data Fetching & State Management
- Custom hooks for fetching and managing data (residents, bills, dashboard stats, etc).
- React Query for caching and background updates.

## 12. Demo & Preview Modes
- Preview mode for dashboard and resident pages to simulate data for demo purposes.

For more details and code references, see the related components and hooks in the `src/components` and `src/hooks` folders.

This project uses the following main technologies:

- **Next.js 15** — React-based framework for server-side rendering and routing
- **React 18** — UI library for building interactive interfaces
- **TypeScript** — Static type checking for JavaScript
- **Tailwind CSS** — Utility-first CSS framework for styling
- **Firebase** (Firestore, Storage, Auth) — Backend as a Service for database, file storage, and authentication
- **shadcn/ui** — Component library for modern UI elements
- **lucide-react** — Icon library for consistent iconography
- **react-hook-form** — Form state management
- **@tanstack/react-query** — Data fetching and caching

Other supporting tools:
- **Prettier** — Code formatter
- **ESLint** — Linting and code quality
- **PostCSS** — CSS processing

This stack enables rapid development, scalability, and maintainability for both frontend and backend needs.

**Note:**
If you need to add a new UI component from shadcn/ui, use the following command:

```powershell
npx shadcn-ui@latest add <component>
```
Replace `<component>` with the desired component name (e.g., `button`, `dialog`).

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

# Project Structure Documentation: Jaga Warga

## Brand Identity

- **Product Name:** Jaga Warga
- **Logo:**
  - Stored in `/public/logo.svg` and the `logo` field in the `residential_info` collection (Firebase Storage URL)
  - ![Jaga Warga Logo](public/logo.svg)
- **Primary Colors:**
  - Blue: `#2563eb` (Tailwind: `blue-600`), `#1e40af` (Tailwind: `blue-900`)
  - White: `#ffffff`
  - Gray: `#f1f5f9` (Tailwind: `slate-100`), `#64748b` (Tailwind: `slate-500`)
  - Emerald: `#10b981` (Tailwind: `emerald-500`)
  - Rose: `#f43f5e` (Tailwind: `rose-500`)
- **Font:**
  - Sans-serif (Tailwind: `font-sans`)
- **Icons:**
  - Lucide Icons (see `lucide-react`)
- **Tone & Voice:**
  - Friendly, informative, easy to understand for residents

### Brand Usage Examples

- **Page Header**
  ```jsx
  <header className="bg-blue-600 text-white font-sans p-4 rounded-b-2xl shadow-lg">
    <img src="/logo.svg" alt="Logo Jaga Warga" className="h-8 inline mr-2" />
    <span className="font-bold text-lg">Jaga Warga</span>
  </header>
  ```
- **Primary Button**
  ```jsx
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow">
    Tambah Data
  </button>
  ```
- **Finance**
  ```jsx
  <span className="text-emerald-600 font-bold">+Rp 100.000</span>
  <span className="text-rose-600 font-bold">-Rp 50.000</span>
  ```
- **Dialog/Modal**
  ```jsx
  <DialogTitle className="text-blue-900 font-bold text-lg">
    Tambah Warga
  </DialogTitle>
  ```
- **Card/Box**
  ```jsx
  <div className="bg-white rounded-2xl shadow p-4 border border-slate-100">
    ...
  </div>
  ```

---

## 1. Main Folder Structure

```
/
├── public/                  # Static files (logo, manifest, sw.js, etc)
├── src/
│   ├── app/                 # Next.js routing (main pages, dashboard, login, etc)
│   │   └── [feature]/       # Each main feature (dashboard, residents, bills, reports, promo, login, etc)
│   ├── components/          # Reusable UI components (Card, Dialog, Form, List, etc)
│   ├── context/             # Context Providers (Auth, Query, Modal)
│   ├── hooks/               # Custom React Hooks (useAuth, useResidents, useDashboard, etc)
│   ├── lib/                 # Utility/helper functions
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions (format, error, protectedRoute, etc)
├── package.json             # Dependency & scripts
├── next.config.js/mjs/ts    # Next.js config
├── tailwind.config.js       # Tailwind CSS config
├── tsconfig.json            # TypeScript config
└── ...
```

---

## 2. Firestore Collection Structure (Example)

---

# Firestore Collection Structure: Detailed Documentation

Below is a detailed description of each Firestore collection, including field names, data types, and relationships:

## 1. users
Stores user and admin data.

**Document ID:** `uid` (string, Firebase Auth UID)
**Fields:**
- `name` (string): Full name of the user
- `email` (string): Email address
- `role` (string): User role (`admin`, `manager`, etc)
- `residential_id` (string): Reference to the managed residential complex
- `phoneNumber` (string, optional): Contact number
- `created_at` (timestamp): Account creation date

## 2. residential_info
Stores information about each residential complex.

**Document ID:** `residential_id` (string)
**Fields:**
- `name` (string): Name of the complex
- `address` (string): Address
- `logo` (string): URL to logo image (Firebase Storage)
- `management` (object): Management info (e.g., chairman, treasurer)
- `current_balance` (number): Current financial balance
- `created_at` (timestamp): Date added

## 3. residents
Stores resident data, organized by residential complex.

**Collection Path:** `residents/{residential_id}/{resident_id}`
**Fields:**
- `name` (string): Resident’s name
- `block` (string): Block/section
- `houseNumber` (string): House number
- `phoneNumber` (string): Contact number
- `email` (string, optional): Email address
- `status` (string): Active/inactive
- `created_at` (timestamp): Date added

## 4. general_transactions
Stores financial transactions (income/expense).

**Document ID:** `id` (string, auto-generated)
**Fields:**
- `residential_id` (string): Reference to complex
- `type` (string): Transaction type (`income`, `expense`)
- `amount` (number): Amount in Rupiah
- `description` (string): Description
- `date` (timestamp): Transaction date
- `created_at` (timestamp): Date added

## 5. monthly_summaries
Stores monthly financial summaries per complex.

**Collection Path:** `monthly_summaries/{residential_id}/{year}/{month}`
**Fields:**
- `totalIncome` (number): Total income for the month
- `totalExpenses` (number): Total expenses for the month
- `month` (number): Month (1-12)
- `year` (number): Year

## 6. ads
Stores resident ads and promotional content.

**Document ID:** `id` (string, auto-generated)
**Fields:**
- `residential_id` (string): Reference to complex
- `resident_id` (string): Reference to resident
- `image` (string): URL to ad image (Firebase Storage)
- `content` (string): Ad text/content
- `created_at` (timestamp): Date added

---

## Relationships & Usage

- `users.residential_id` links users to a residential complex in `residential_info`.
- `residents` are grouped by `residential_id` for each complex.
- `general_transactions` and `monthly_summaries` reference `residential_id` for financial tracking.
- `ads` reference both `residential_id` and `resident_id` for targeted promotions.

**Best Practices:**
- Always use `residential_id` to filter and query data for a specific complex.
- Store images in Firebase Storage and save the URL in the relevant field.
- Use server timestamps for `created_at` and `date` fields for consistency.

For more details, see the code references and hooks in the `src/hooks` and `src/components` folders.

---

# Data Relations & Global Store

This section explains the data relationships in Firestore and how global state is managed in the application.

## Data Relations

The application uses Firestore as the primary database, with the following key relationships:

### 1. Hierarchical Structure
- **Residential Complex as Root:** All data is scoped by `residential_id`.
  - `residential_info` holds complex metadata.
  - `users` reference `residential_id` for admin access.
  - `residents` are subcollections under `residential_id`.
  - `general_transactions` and `monthly_summaries` filter by `residential_id`.
  - `ads` link to both `residential_id` and `resident_id`.

### 2. One-to-Many Relationships
- **One Complex to Many Residents:** `residential_info` → `residents/{residential_id}/{resident_id}`
- **One Complex to Many Transactions:** `residential_info` → `general_transactions` (filtered by `residential_id`)
- **One Complex to Many Summaries:** `residential_info` → `monthly_summaries/{residential_id}/{year}/{month}`
- **One Resident to Many Ads:** `residents` → `ads` (filtered by `resident_id`)

### 3. Reference Fields
- `users.residential_id` → `residential_info.documentId`
- `general_transactions.residential_id` → `residential_info.documentId`
- `ads.residential_id` → `residential_info.documentId`
- `ads.resident_id` → `residents.documentId`

### 4. Data Integrity
- All queries use `residential_id` to ensure data isolation per complex.
- Timestamps (`created_at`, `date`) ensure chronological ordering.
- Images stored in Firebase Storage with URLs in Firestore fields.

## Global Store

The application uses a combination of React Context and React Query for global state management:

### 1. React Context Providers
- **AuthProvider:** Manages user authentication state (login/logout, user data).
  - Located in `src/context/AuthProvider.tsx`
  - Provides `user`, `login`, `logout` globally.
- **ReactQueryProvider:** Wraps the app with React Query client for data caching.
  - Located in `src/context/ReactQueryProvider.tsx`
  - Enables background refetching and optimistic updates.

### 2. React Query (Global Cache)
- **Purpose:** Caches API responses to reduce Firestore calls and improve performance.
- **Key Features:**
  - Automatic background updates.
  - Stale-while-revalidate strategy.
  - Error handling and retry logic.
- **Usage in Hooks:**
  - `useResidentialInfo`: Caches complex info.
  - `useResidents`: Caches resident list.
  - `useBills`: Caches bill data.
  - `useDashboard`: Caches summary stats.

### 3. Custom Hooks as Data Layer
- Hooks encapsulate data fetching and mutations.
- Examples:
  - `useAddBillMutation`: Adds bills to Firestore.
  - `useConfirmBillMutations`: Updates bill status.
  - `useGenerateAdMutation`: Creates ads.
- Mutations invalidate queries to update cache.

### 4. State Flow
1. **User Action:** Triggers hook (e.g., `useAddBillMutation`).
2. **API Call:** Hook calls Firestore via Firebase SDK.
3. **Cache Update:** React Query invalidates and refetches data.
4. **UI Update:** Components re-render with new data.
5. **Feedback:** Toast notifications for success/error.

### 5. Best Practices
- Use `residential_id` in all queries for data scoping.
- Leverage React Query's caching to minimize reads.
- Handle loading states with skeletons/overlays.
- Use server timestamps for consistency.

This setup ensures efficient data management and a smooth user experience across the application.

---

# TypeScript Types: Complete Reference

This section provides a complete reference to all TypeScript types used in the Jaga Warga project, located in `src/types/`.

## 1. Bill Type (`src/types/bill.ts`)

```typescript
import type { Timestamp } from 'firebase/firestore';

export type Bill = {
  id: string;                    // Unique bill identifier
  amount: number;                // Bill amount in Rupiah
  block: string;                 // Resident's block/section
  houseNumber: string;           // Resident's house number
  month: string;                 // Billing month (e.g., "01", "12")
  year: string;                  // Billing year (e.g., "2025")
  status: 'unpaid' | 'pending' | 'paid' | 'rejected' | 'approved';  // Payment status
  proofUrl?: string;             // URL to payment proof image (optional)
  rejectReason?: string;         // Reason for rejection (optional)
  createdAt: Timestamp;          // Firestore timestamp for creation
  remark?: string;               // Additional notes (optional)
  phoneNumber?: string | null;   // Resident's phone number (optional)
  residentName?: string | null;  // Resident's name (optional)
  residential_id?: string | null; // Reference to residential complex (optional)
};
```

**Usage:** Represents a bill entity, used in bill lists, forms, and confirmations.

## 2. Resident Type (`src/types/resident.ts`)

```typescript
export type Resident = {
  id: string;          // Unique resident identifier
  userId: string;      // Reference to user/auth ID
  block: string;       // Resident's block/section
  houseNumber: string; // Resident's house number
  name: string;        // Resident's full name
};
```

**Usage:** Represents a resident entity, used in resident lists, forms, and management.

## 3. Other Types (Inferred from Code)

### Transaction Type (from `general_transactions` collection)
```typescript
export type Transaction = {
  id: string;                    // Auto-generated ID
  residential_id: string;        // Complex reference
  type: 'income' | 'expense';    // Transaction type
  amount: number;                // Amount in Rupiah
  description: string;           // Description
  date: Timestamp;               // Transaction date
  created_at: Timestamp;         // Creation timestamp
};
```

### Ad Type (from `ads` collection)
```typescript
export type Ad = {
  id: string;                    // Auto-generated ID
  residential_id: string;        // Complex reference
  resident_id: string;           // Resident reference
  image: string;                 // Image URL (Firebase Storage)
  content: string;               // Ad text/content
  created_at: Timestamp;         // Creation timestamp
};
```

### User Type (from `users` collection)
```typescript
export type User = {
  uid: string;                   // Firebase Auth UID
  name: string;                  // Full name
  email: string;                 // Email address
  role: string;                  // Role (e.g., 'admin', 'manager')
  residential_id: string;        // Complex reference
  phoneNumber?: string;          // Phone number (optional)
  created_at: Timestamp;         // Creation timestamp
};
```

### Residential Info Type (from `residential_info` collection)
```typescript
export type ResidentialInfo = {
  name: string;                  // Complex name
  address: string;               // Address
  logo: string;                  // Logo URL (Firebase Storage)
  management: object;            // Management details (e.g., chairman, treasurer)
  current_balance: number;       // Current balance
  created_at: Timestamp;         // Creation timestamp
};
```

## Type Usage Guidelines

- **Strict Typing:** All components and hooks use these types for props and data.
- **Optional Fields:** Marked with `?` for fields that may not always be present.
- **Firestore Integration:** Types align with Firestore document structures.
- **Validation:** Use these types in forms (e.g., with `react-hook-form`) for type safety.
- **Extensions:** Add new types in `src/types/` as the project grows.

For more details, see the type definitions and their usage in components and hooks.

---

- **Prompting** can be done on main collections (e.g., `residential_info`, `general_transactions`, `ads`) to:
  - Add/update fields (e.g., update balance, add ad, etc)
  - Query/filter data by `residential_id`, `type`, etc
  - Adjust data so the frontend can read it correctly (see field structure above)

### Prompting Examples

- **Update global balance**:
  > Update the `current_balance` field in the document `residential_info/[residential_id]`.
- **Add transaction**:
  > Add a new document to `general_transactions` with fields: `residential_id`, `type`, `amount`, `description`, `date`, `created_at`.
- **Add resident**:
  > Add a document to the subcollection `residents/[residential_id]`.

---

## 4. Notes

- Ensure fields and document structure match what the frontend expects (see related hooks and components).
- Use the `residential_id` field to filter housing data.
- For image uploads (logo, ads), use Firebase Storage and store the URL in the document field.

---

## 4a. Checking for TypeScript Errors

To ensure code quality and prevent runtime issues, always check for TypeScript errors before deploying or merging code.

**How to check for TypeScript errors:**

- Using the terminal, run:
  ```powershell
  npx tsc --noEmit
  ```
  or if you have TypeScript installed globally:
  ```powershell
  tsc --noEmit
  ```
- This command will analyze your code and display any type errors without generating output files.

**Why check for TypeScript errors?**
- TypeScript errors help catch bugs early, ensure type safety, and improve maintainability.
- Fixing these errors before deployment reduces the risk of issues in production.

**Tip:**
- Integrate TypeScript checks into your CI/CD pipeline for automated error detection.

---

**Code References:**

- `src/hooks/useResidentialInfo.ts`
- `src/hooks/useDashboard.ts`
- `src/components/AddFinanceRecordForm.tsx`
- `src/components/ResidentForm.tsx`
- `src/app/dashboard/iklan/page.tsx`

---

## 5. Example Hooks & Components (Prompting Reference)

### Example Custom Hook: Fetch Housing Info

````typescript
// src/hooks/useResidentialInfo.ts
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export function useResidentialInfo(residentialId?: string) {
  return useQuery({
    queryKey: ['residentialInfo', residentialId],
    queryFn: async () => {
      if (!residentialId) return null;
      const docRef = doc(db, 'residential_info', residentialId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;
      return snap.data();
    },
    enabled: !!residentialId,
  });
---

## 3a. Label Language Guideline

**When adding or editing labels (such as field names, button text, or UI labels), use Bahasa Indonesia.**

- All user-facing labels in the app should be written in Bahasa Indonesia to ensure clarity and accessibility for Indonesian users.
- Example: Use `Tambah Data` instead of `Add Data`, `Simpan` instead of `Save`, `Nama Warga` instead of `Resident Name`.
- This applies to:
  - Button labels
  - Form field labels
  - Dialog/modal titles
  - Table headers
  - Any other UI text visible to users

**Rationale:**
> Using Bahasa Indonesia for all labels ensures the application is user-friendly and accessible for its primary audience.

**Example:**
```jsx
<button className="bg-blue-600 text-white">Tambah Data</button>
<label htmlFor="name">Nama Warga</label>
<DialogTitle>Simpan Perubahan</DialogTitle>
````

````
### Example Component: Add Finance Record Form

```tsx
// src/components/AddFinanceRecordForm.tsx
import { useForm, Controller } from 'react-hook-form';
import { Button } from './ui/button';
import { db } from '../firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function AddFinanceRecordForm() {
  const { handleSubmit, control } = useForm();
  const onSubmit = async (data) => {
    await addDoc(collection(db, 'general_transactions'), {
      ...data,
      created_at: serverTimestamp(),
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="amount"
        control={control}
        render={({ field }) => <input type="number" placeholder="Jumlah" {...field} />}
      />
      <Button type="submit">Simpan</Button>
    </form>
  );
}
```

### Example Component: Resident List

```tsx
// src/components/ResidentList.tsx
import { useResidents } from '../hooks/useResidents';
export default function ResidentList() {
  const { data: residents = [] } = useResidents();
  return (
    <ul>
      {residents.map((r) => (
        <li key={r.id}>
          {r.name} - Blok {r.block}/No. {r.houseNumber}
        </li>
      ))}
    </ul>
  );
}
```

---

# User Stories & Project Flow

This section outlines the complete user stories and workflows for the Jaga Warga application, covering both resident and admin/manager perspectives.

## Resident User Stories

### 1. As a Resident, I want to check my bills so that I can see what I owe.
- **Steps:**
  1. Visit `/warga` or `/warga/[residential_id]`.
  2. Enter block, house number, month, and year.
  3. Click "Cari Tagihan" to search.
  4. View bill details (amount, due date, status).
  5. If bill is found, proceed to payment.

### 2. As a Resident, I want to pay my bills so that I can settle my dues.
- **Steps:**
  1. After finding the bill, upload payment proof (image).
  2. Click "Upload Bukti Bayar".
  3. Wait for confirmation from admin.
  4. Receive notification of payment status.

### 3. As a Resident, I want to view complex info so that I can contact management.
- **Steps:**
  1. Visit `/warga/[residential_id]`.
  2. View management contacts and complex details.
  3. Use contact info for inquiries.

## Admin/Manager User Stories

### 1. As an Admin, I want to log in securely so that I can access management features.
- **Steps:**
  1. Visit `/login`.
  2. Enter email and password.
  3. Click "Masuk".
  4. Redirect to `/dashboard` if successful.

### 2. As an Admin, I want to manage bills so that I can create, edit, and confirm payments.
- **Steps:**
  1. Log in and go to `/dashboard/tagihan`.
  2. View list of bills.
  3. Add new bill: Fill form and submit.
  4. Edit existing bill: Click edit, modify, save.
  5. Confirm payment: Go to `/dashboard/konfirmasi`, view proof, approve/reject.

### 3. As an Admin, I want to manage residents so that I can add, edit, and view resident data.
- **Steps:**
  1. Go to `/dashboard/warga`.
  2. View resident list with search/filter.
  3. Add resident: Fill form and submit.
  4. Edit resident: Select, modify, save.
  5. Delete resident: Confirm deletion.

### 4. As an Admin, I want to track finances so that I can monitor income and expenses.
- **Steps:**
  1. Visit `/dashboard/keuangan`.
  2. View transaction list.
  3. Add transaction: Go to `/dashboard/catat-keuangan`, fill form, submit.
  4. Filter and summarize data.

### 5. As an Admin, I want to generate reports so that I can review financial summaries.
- **Steps:**
  1. Go to `/dashboard/laporan`.
  2. Select month/year or custom range.
  3. View report data.
  4. Export/print if needed.

### 6. As an Admin, I want to create ads so that I can promote services to residents.
- **Steps:**
  1. Visit `/dashboard/iklan`.
  2. Use ad generator modal to create content.
  3. Upload image if needed.
  4. Publish ad to Firestore.

### 7. As an Admin, I want to manage my profile so that I can update my info.
- **Steps:**
  1. Go to `/dashboard/profil`.
  2. View current profile.
  3. Edit details and save.

## Overall Project Flow

### Resident Flow:
1. **Discovery:** Visit landing page or direct link.
2. **Bill Check:** Search for bills using resident info.
3. **Payment:** Upload proof of payment.
4. **Confirmation:** Wait for admin approval.

### Admin Flow:
1. **Login:** Authenticate to access dashboard.
2. **Management:** Use dashboard to navigate to bills, residents, finance, etc.
3. **Operations:** Perform CRUD operations on data.
4. **Monitoring:** View reports and confirm payments.
5. **Promotion:** Create and manage ads.

### Data Flow:
- User actions trigger API calls to Firestore via custom hooks.
- Data is cached with React Query for performance.
- Changes are reflected in real-time where applicable.
- All actions provide feedback via toasts and overlays.

This completes the user stories and project flow documentation.
