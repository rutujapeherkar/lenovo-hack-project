/**
 * Sahayak AI — Typed Data Loader for Verified Government Registries
 * 
 * Source of Truth: docs/source-of-truth/DATA-CONTRACTS.md & docs/source-of-truth/OFFICIAL-SOURCES.md
 * Status: Frozen for MVP
 * 
 * Provides validated, typed accessors to verified static JSON registries.
 */

import type { Portal, Service, Scheme } from "./types";
import { isPortal, isService, isScheme } from "./validators";

import portalsJson from "../../data/maharashtra/portals.json";
import servicesJson from "../../data/maharashtra/services.json";
import schemesJson from "../../data/maharashtra/schemes.json";

// Validate data integrity upon module initialization to guarantee runtime safety
const validatedPortals: Portal[] = (portalsJson as unknown[]).map((entry, index) => {
  if (!isPortal(entry)) {
    throw new Error(`Invalid Portal entry in portals.json at index ${index}`);
  }
  return entry;
});

const validatedServices: Service[] = (servicesJson as unknown[]).map((entry, index) => {
  if (!isService(entry)) {
    throw new Error(`Invalid Service entry in services.json at index ${index}`);
  }
  return entry;
});

const validatedSchemes: Scheme[] = (schemesJson as unknown[]).map((entry, index) => {
  if (!isScheme(entry)) {
    throw new Error(`Invalid Scheme entry in schemes.json at index ${index}`);
  }
  return entry;
});

// ============================================================================
// Portal Accessors
// ============================================================================

/** Returns all verified government portals */
export function getPortals(): Portal[] {
  return [...validatedPortals];
}

/** Looks up a verified portal by unique ID */
export function getPortalById(id: string): Portal | undefined {
  return validatedPortals.find((portal) => portal.id === id);
}

/** Looks up a portal by official domain */
export function getPortalByDomain(domain: string): Portal | undefined {
  const normalized = domain.toLowerCase();
  return validatedPortals.find((portal) => portal.domain.toLowerCase() === normalized);
}

/** Returns total number of registered portals */
export function getVerifiedPortalsCount(): number {
  return validatedPortals.length;
}

// ============================================================================
// Service Accessors
// ============================================================================

/** Returns all verified Maharashtra public services */
export function getServices(): Service[] {
  return [...validatedServices];
}

/** Looks up a verified service by unique ID */
export function getServiceById(id: string): Service | undefined {
  return validatedServices.find((service) => service.id === id);
}

/** Filters verified services by category */
export function getServicesByCategory(category: string): Service[] {
  return validatedServices.filter((service) => service.category === category);
}

/** Returns total count of verified public services */
export function getVerifiedServicesCount(): number {
  return validatedServices.length;
}

// ============================================================================
// Scheme Accessors
// ============================================================================

/** Returns all verified Maharashtra welfare schemes */
export function getSchemes(): Scheme[] {
  return [...validatedSchemes];
}

/** Looks up a verified scheme by unique ID */
export function getSchemeById(id: string): Scheme | undefined {
  return validatedSchemes.find((scheme) => scheme.id === id);
}

/** Filters verified schemes by category */
export function getSchemesByCategory(category: string): Scheme[] {
  return validatedSchemes.filter((scheme) => scheme.category === category);
}

/** Returns total count of verified welfare schemes */
export function getVerifiedSchemesCount(): number {
  return validatedSchemes.length;
}
