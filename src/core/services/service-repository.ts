/**
 * Sahayak AI — Verified Service Repository
 * 
 * Source of Truth: docs/source-of-truth/ARCHITECTURE.md Section 11 & DATA-CONTRACTS.md Section 8-9
 * Phase: P05 — Services & Deterministic Task Guidance
 * 
 * Provides deterministic retrieval, multilingual keyword search, and category filtering
 * for verified Maharashtra public services. All data is sourced from verified registries.
 * Anti-hallucination invariant: Never invents or generates unverified services or URLs.
 */

import type { Service, Language, ServiceDiscoveryResult } from "../shared/types";
import { getServices, getServiceById, getServicesByCategory } from "../shared/data-loader";

export class ServiceRepository {
  /**
   * Retrieves all verified Maharashtra public services.
   */
  public static getAllServices(): Service[] {
    return getServices();
  }

  /**
   * Retrieves a verified service by unique identifier.
   */
  public static getServiceById(id: string): Service | undefined {
    return getServiceById(id);
  }

  /**
   * Retrieves all unique categories present in the verified service registry.
   */
  public static getCategories(): string[] {
    const services = getServices();
    const categories = new Set<string>();
    for (const service of services) {
      if (service.category) {
        categories.add(service.category);
      }
    }
    return Array.from(categories);
  }

  /**
   * Filters services by verified category.
   */
  public static filterByCategory(category: string): Service[] {
    if (!category || category === "all" || category === "All") {
      return getServices();
    }
    return getServicesByCategory(category);
  }

  /**
   * Searches verified services by multilingual keyword or phrase.
   * Matches across English, Marathi, and Hindi names, descriptions, categories, and documents.
   */
  public static searchServices(query: string, language?: Language): Service[] {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return getServices();
    }

    const services = getServices();

    return services.filter((service) => {
      // 1. Direct ID match
      if (service.id.toLowerCase().includes(trimmed)) {
        return true;
      }

      // 2. Multilingual Name match
      if (
        service.name.en.toLowerCase().includes(trimmed) ||
        service.name.mr.toLowerCase().includes(trimmed) ||
        service.name.hi.toLowerCase().includes(trimmed)
      ) {
        return true;
      }

      // 3. Category match
      if (service.category.toLowerCase().includes(trimmed)) {
        return true;
      }

      // 4. Multilingual Description match
      if (
        service.description.en.toLowerCase().includes(trimmed) ||
        service.description.mr.toLowerCase().includes(trimmed) ||
        service.description.hi.toLowerCase().includes(trimmed)
      ) {
        return true;
      }

      // 5. Document requirement match
      const docMatch = service.documents.some((doc) =>
        doc.toLowerCase().includes(trimmed)
      );
      if (docMatch) {
        return true;
      }

      // 6. Step titles match
      const stepMatch = service.steps.some(
        (step) =>
          step.title.en.toLowerCase().includes(trimmed) ||
          step.title.mr.toLowerCase().includes(trimmed) ||
          step.title.hi.toLowerCase().includes(trimmed)
      );
      if (stepMatch) {
        return true;
      }

      // Language-specific fallback if specified
      if (language && service.name[language]) {
        if (service.name[language].toLowerCase().includes(trimmed)) {
          return true;
        }
      }

      return false;
    });
  }

  /**
   * Performs service discovery matching the canonical ServiceDiscoveryResult contract.
   */
  public static discoverServices(
    query: string,
    language: Language
  ): ServiceDiscoveryResult {
    const matching = this.searchServices(query, language);
    return {
      services: matching,
      query,
      language,
    };
  }
}

// Standalone function exports for convenient functional usage
export const getAllServices = ServiceRepository.getAllServices;
export const getService = ServiceRepository.getServiceById;
export const searchServices = ServiceRepository.searchServices;
export const filterServicesByCategory = ServiceRepository.filterByCategory;
export const getServiceCategories = ServiceRepository.getCategories;
export const discoverServices = ServiceRepository.discoverServices;
