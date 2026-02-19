import { countryThemes } from './country-theme';
import { getCountryFromCookies } from './country-detection';

function getSiteName(): string {
  const code = getCountryFromCookies();
  return countryThemes[code]?.name || 'Home Hub';
}

export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[\s\-\+\(\)]/g, '');
}

interface PropertyMessageParams {
  recipientName?: string;
  propertyTitle: string;
  price?: string;
  location?: string;
  propertyId: string;
}

export function buildPropertyMessage(params: PropertyMessageParams): string {
  const siteName = getSiteName();
  const origin = window.location.origin;
  const name = params.recipientName || 'there';

  let msg = `🏡 *${siteName.toUpperCase()}* — Property Inquiry\n\n`;
  msg += `Hi ${name}! I'm interested in your property:\n\n`;
  msg += `${params.propertyTitle}\n`;
  if (params.price) msg += `💰 ${params.price}\n`;
  if (params.location) msg += `📍 ${params.location}\n`;
  msg += `\nView listing: ${origin}/properties/${params.propertyId}\n\n`;
  msg += `Could you provide more details?`;

  return msg;
}

export function buildBackupOfferMessage(params: PropertyMessageParams): string {
  const siteName = getSiteName();
  const origin = window.location.origin;
  const name = params.recipientName || 'there';

  let msg = `🏡 *${siteName.toUpperCase()}* — Backup Offer Inquiry\n\n`;
  msg += `Hi ${name}! I'm interested in backup offers for:\n\n`;
  msg += `${params.propertyTitle}\n`;
  if (params.price) msg += `💰 ${params.price}\n`;
  if (params.location) msg += `📍 ${params.location}\n`;
  msg += `\nView listing: ${origin}/properties/${params.propertyId}\n\n`;
  msg += `I understand it's under contract but would like to submit a backup offer.`;

  return msg;
}

interface DevelopmentMessageParams {
  developmentName: string;
  slug: string;
}

export function buildDevelopmentMessage(params: DevelopmentMessageParams): string {
  const siteName = getSiteName();
  const origin = window.location.origin;

  let msg = `🏡 *${siteName.toUpperCase()}* — Development Inquiry\n\n`;
  msg += `Hi! I'm interested in ${params.developmentName}.\n\n`;
  msg += `View development: ${origin}/properties/developments/${params.slug}\n\n`;
  msg += `Could you share more details?`;

  return msg;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const clean = cleanPhoneNumber(phone);
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}
