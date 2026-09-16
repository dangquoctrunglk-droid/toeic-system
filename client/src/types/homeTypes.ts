import type { LucideIcon } from 'lucide-react';

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  badge: string;
  link: string;
}

export interface StatItemConfig {
  target: number;
  label: string;
  prefix?: string;
  suffix: string;
  icon: LucideIcon;
  color: string;
}

export interface StepItem {
  num: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  color: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  score: string;
  content: string;
  avatar: string;
  color: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  unit?: string;
  desc: string;
  popular: boolean;
  color: string;
  features: string[];
  cta: string;
  ctaLink: string;
}

export interface FooterGroup {
  title: string;
  links: { label: string; href: string }[];
}
