"use client";
import React, { useState } from "react";

// ======= Brand + Pricing Constants =======
const BRAND = {
  primary: "#16a34a",
  primaryDark: "#15803d",
  accent: "#0f766e",
};

const PRICING = {
  fsbo: [
    {
      name: "Basic",
      price: "$49",
      tag: "Flat-fee listing",
      features: [
        "30-day listing on Guyana Home Hub",
        "No agent fees – keep 100% of your sale price",
        "Up to 10 photos",
        "AI-assisted description",
        "Email support",
      ],
      ctaLabel: "Start Basic",
      href: "https://portalhomehub.com/register?audience=fsbo&plan=basic",
      popular: false,
    },
    {
      name: "Plus",
      price: "$99",
      tag: "Best for most",
      features: [
        "90-day listing + featured placement (rotating)",
        "No agent fees – flat fee only",
        "Up to 25 photos + 1 video",
        "Priority review (24–48h)",
        "Social boost across GHH channels",
      ],
      ctaLabel: "Choose Plus",
      href: "https://portalhomehub.com/register?audience=fsbo&plan=plus",
      popular: true,
    },
    {
      name: "Premium",
      price: "$199",
      tag: "Maximum visibility",
      features: [
        "180-day listing + homepage highlight",
        "No agent fees – flat fee only",
        "Unlimited photos + 3 videos",
        "Pro photo tips + AI image cleanup",
        "Concierge onboarding call",
      ],
      ctaLabel: "Go Premium",
      href: "https://portalhomehub.com/register?audience=fsbo&plan=premium",
      popular: false,
    },
  ],
  rentals: [
    {
      name: "Basic",
      price: "$29",
      tag: "Single unit",
      features: [
        "30-day rental listing",
        "No agent fees – flat rate",
        "Up to 8 photos",
        "AI description",
        "Email support",
      ],
      ctaLabel: "Start Basic",
      href: "https://portalhomehub.com/register?audience=landlord&plan=basic",
      popular: false,
    },
    {
      name: "Plus",
      price: "$59",
      tag: "Faster leasing",
      features: [
        "60-day listing + featured placement (rotating)",
        "No agent fees – flat rate",
        "Up to 20 photos + video",
        "Lead inbox + quick replies",
        "Priority review (24–48h)",
      ],
      ctaLabel: "Choose Plus",
      href: "https://portalhomehub.com/register?audience=landlord&plan=plus",
      popular: true,
    },
    {
      name: "Portfolio",
      price: "$149",
      tag: "3 listings bundle",
      features: [
        "3 concurrent listings (60 days)",
        "Portfolio badge for credibility",
        "Unlimited photos + 3 videos",
        "CSV import (coming soon)",
        "Concierge onboarding call",
      ],
      ctaLabel: "Start Portfolio",
      href: "https://portalhomehub.com/register?audience=landlord&plan=premium",
      popular: false,
    },
  ],
};

// ======= Reasons Constants (FSBO / Rentals) =======
const REASONS = {
  fsbo: [
    { title: "No Agent Fees", body: "Pay a simple flat fee. Keep 100% of your sale price—no commissions." },
    { title: "Serious Visibility", body: "Your property appears on a reputable, locally-focused portal trusted by buyers." },
    { title: "Easy Listing Management", body: "Update photos, price, and details anytime in a simple dashboard." },
    { title: "AI-Assisted Marketing", body: "Generate polished descriptions and highlight compelling features in seconds." },
    { title: "Verified Interest", body: "Screened inquiries and optional ID checks reduce time-wasters." },
    { title: "Multi-Channel Boost", body: "Optional social & email boosts to accelerate exposure to real buyers." },
  ],
  rentals: [
    { title: "Flat-Rate Pricing", body: "No agent fees. Predictable cost per unit helps your NOI." },
    { title: "Qualified Leads", body: "Attract genuine tenants via a trusted marketplace with local reach." },
    { title: "Portfolio Tools", body: "Manage multiple units, duplicate listings, and refresh availability quickly." },
    { title: "AI Descriptions", body: "Instantly craft clear, attractive rental summaries tenants understand." },
    { title: "Fast Publishing", body: "Priority review ensures your vacancies go live within 24–48 hours." },
    { title: "Team Support", body: "Email + concierge options to keep your pipeline moving." },
  ],
};

function PrimaryButton({ href, children }) {
  return (
    <a href={href} className="inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold shadow-sm transition hover:opacity-95" style={{ backgroundColor: BRAND.primary, color: "white" }}>{children}</a>
  );
}

function OutlineButton({ href, children }) {
  return (
    <a href={href} className="inline-flex items-center justify-center rounded-2xl border px-6 py-3 font-semibold transition hover:bg-gray-50" style={{ borderColor: BRAND.primary, color: BRAND.primary }}>{children}</a>
  );
}

// ======= Main Export =======
export default function EnterpriseListingFunnel() {
  const [audience, setAudience] = useState("fsbo");
  const reasons = audience === "fsbo" ? REASONS.fsbo : REASONS.rentals;
  const plans = audience === "fsbo" ? PRICING.fsbo : PRICING.rentals;

  return (
    <div className="bg-gray-50">
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">List on a trusted marketplace. <span style={{ color: BRAND.primary }}>No agent fees.</span></h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryButton href={`https://portalhomehub.com/register?audience=${audience}&plan=basic`}>Get Started</PrimaryButton>
            <OutlineButton href={`https://portalhomehub.com/register?audience=${audience}`}>Compare Plans</OutlineButton>
            <OutlineButton href={`https://portalhomehub.com/register?audience=${audience}&plan=premium`}>Talk to Onboarding</OutlineButton>
          </div>
        </div>
      </section>
    </div>
  );
}
