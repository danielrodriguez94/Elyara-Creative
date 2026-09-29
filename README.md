# ELYARA Creative — Website v1

This is a responsive static website prepared for the same stack used on the other projects: GitHub + Cloudflare Pages + Supabase + Google OAuth. Stripe can be connected later when prices/packages are defined.

## Included
- Elegant ELYARA visual system based on the supplied logo: navy, copper/rose-gold, cream.
- Responsive desktop/tablet/mobile layout.
- Languages: English, Spanish, Portuguese, Italian, French and Simplified Chinese.
- Google sign-in wiring through Supabase Auth.
- Contact/quote form wired for a Supabase `inquiries` table.
- Service catalog.
- Marketing section for Facebook, Instagram and TikTok advertising.
- Portfolio links for:
  - mezcalchuparrosa.com
  - sandrasfamilychildcare.com
  - cumbredeidentidad.com
- Search overlay and mobile menu.

## Before publishing
1. Create a new Supabase project for ELYARA Creative.
2. Run `supabase.sql` in Supabase SQL Editor.
3. In Supabase Authentication > Providers, enable Google.
4. In Google Cloud, create/configure the OAuth client and authorized redirect URI supplied by Supabase.
5. Paste your Supabase URL and anon key in `config.js`.
6. Add the real ELYARA email and phone/WhatsApp in `config.js`.
7. Upload the project to a new GitHub repository.
8. Connect that repository to Cloudflare Pages.
9. Add the final domain in Cloudflare and also add it to Supabase Auth redirect URLs.

## Important
The page works visually without Supabase. Google login and contact-form storage activate after the keys are added to `config.js`.
