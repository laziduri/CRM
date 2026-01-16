# Resources Pages - Complete URL Structure

## 📁 Page Structure Overview

All resources are organized under the `/resources` route structure:

```
/app/resources/
  ├── page.tsx                    # Main Resources Hub
  └── education/
      ├── page.tsx                # Education Hub Listing
      └── [slug]/
          └── page.tsx            # Individual Education Articles
```

## 🔗 All Resource Pages URLs

### Main Resources Hub
- **URL:** `/resources`
- **File:** `/app/resources/page.tsx`
- **Description:** Main hub combining Blog and Education sections with tabs

### Education Hub
- **URL:** `/resources/education`
- **File:** `/app/resources/education/page.tsx`
- **Description:** Education articles listing page with category filters

### Education Articles (Individual Pages)
Currently **7 articles completed** (out of 18 planned):

1. **Personal Loan Interest**
   - URL: `/resources/education/personal-loan-interest-singapore`
   - Slug: `personal-loan-interest-singapore`

2. **Personal Loan Eligibility**
   - URL: `/resources/education/personal-loan-eligibility-banks`
   - Slug: `personal-loan-eligibility-banks`

3. **Documents Checklist**
   - URL: `/resources/education/personal-loan-documents-checklist`
   - Slug: `personal-loan-documents-checklist`

4. **Prepayment & Early Settlement**
   - URL: `/resources/education/personal-loan-prepayment-early-settlement`
   - Slug: `personal-loan-prepayment-early-settlement`

5. **Credit Scores**
   - URL: `/resources/education/credit-scores-personal-loans-singapore`
   - Slug: `credit-scores-personal-loans-singapore`

6. **Types of Business Loans**
   - URL: `/resources/education/types-business-loans-singapore`
   - Slug: `types-business-loans-singapore`

7. **Banks Evaluate SME Applications**
   - URL: `/resources/education/banks-evaluate-sme-loan-applications`
   - Slug: `banks-evaluate-sme-loan-applications`

### Blog Articles (Existing Structure)
- **Blog Listing:** `/blog`
- **Blog Articles:** `/blog/[slug]`

**Existing Blog Articles:**
- `/blog/effective-interest-rate-calculation-singapore`
- `/blog/debt-service-ratio-assessment-personal-loans`
- `/blog/loan-tenure-optimisation-strategies`
- `/blog/secured-versus-unsecured-personal-loans`
- `/blog/credit-score-impact-personal-loan-eligibility`
- `/blog/early-repayment-penalties-personal-loans`
- `/blog/income-verification-requirements-personal-loans`
- `/blog/loan-consolidation-strategies-singapore`
- `/blog/guarantor-requirements-personal-loans`
- `/blog/working-capital-financing-singapore-smes`
- `/blog/business-loan-collateral-requirements-singapore`
- `/blog/government-assisted-loan-schemes-singapore`
- `/blog/cash-flow-forecasting-business-loan-applications`
- `/blog/revolving-versus-term-loan-structures`
- `/blog/business-loan-covenants-compliance-requirements`

## 📊 Navigation Structure

### Header Navigation
- **Resources Link:** `/resources` (main hub)

### Footer Navigation  
- **Resources Link:** `/resources` (in Company section)

### Internal Navigation
- Resources Hub → Links to `/blog` and `/resources/education`
- Education Hub → Links back to `/resources`
- Individual articles → Links back to `/resources/education`

## ⏳ Remaining Work

### Education Articles Still Needed (11 articles):
8. Enterprise Financing Scheme (EFS) Explained
9. Working Capital Loan Insights
10. Managing Director Credit Exposure
11. How Bank Credit Assessments Work
12. Why Loans Get Rejected & What to Do
13. Bank Risk Appetite by Industry
14. Bank Documentation Standards & Best Practices
15. Cashflow Planning for Loan Approvals
16. Debt Consolidation: Safe Strategies
17. Building Financial Discipline (SME Focus)
18. Preparing for Bank Meetings & Interviews

## 📝 File Locations

### Main Pages
- Resources Hub: `app/resources/page.tsx`
- Education Listing: `app/resources/education/page.tsx`
- Education Article Template: `app/resources/education/[slug]/page.tsx`
- Blog Listing: `app/blog/page.tsx` (existing)
- Blog Article Template: `app/blog/[slug]/page.tsx` (existing)

### Data Files
- Education Articles Data: `lib/education.ts`
- Blog Articles Data: `lib/resources.ts`

## 🎯 Quick Access URLs

**Development URLs (localhost:3000):**
- Main Hub: `http://localhost:3000/resources`
- Education: `http://localhost:3000/resources/education`
- Blog: `http://localhost:3000/blog`
- Article Example: `http://localhost:3000/resources/education/personal-loan-interest-singapore`

**Production URLs (your domain):**
- Main Hub: `https://yourdomain.com/resources`
- Education: `https://yourdomain.com/resources/education`
- Blog: `https://yourdomain.com/blog`
