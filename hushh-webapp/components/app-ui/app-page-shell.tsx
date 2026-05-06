"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Standard styles used for measuring shell dimensions and setting base theme colors.
 */
export const APP_MEASURE_STYLES = "min-h-screen bg-background text-foreground";
export const APP_SHELL_FRAME_CLASSNAME = "flex flex-col w-full";
export const APP_SHELL_FRAME_STYLE = { minHeight: "100vh" };

export type AppPageShellWidth = "full" | "content" | "narrow";

interface AppPageShellProps {
  children: React.ReactNode;
  className?: string;
  width?: AppPageShellWidth;
  /**
   * Optional integration testing markers for CI/Playwright.
   */
  nativeTest?: {
    routeId?: string;
    marker?: string;
    authState?: "authenticated" | "pending" | "anonymous";
    dataState?: "loading" | "loaded" | "error";
  };
}

/**
 * The root wrapper for all application pages. 
 * Provides the base layout structure and integration test hooks.
 */
export function AppPageShell({
  children,
  className,
  width = "full",
  nativeTest,
}: AppPageShellProps) {
  const widthClass = 
    width === "content" ? "max-w-7xl mx-auto" : 
    width === "narrow" ? "max-w-3xl mx-auto" : "w-full";

  return (
    <div
      className={cn(APP_SHELL_FRAME_CLASSNAME, APP_MEASURE_STYLES, className)}
      style={APP_SHELL_FRAME_STYLE}
      // These attributes are read by the Integration Check to prevent timeouts
      data-native-route={nativeTest?.routeId}
      data-testid={nativeTest?.marker}
      data-auth-state={nativeTest?.authState}
      data-state={nativeTest?.dataState}
    >
      <div className={cn("flex flex-col flex-1", widthClass)}>
        {children}
      </div>
    </div>
  );
}

/**
 * Header region for page-specific navigation, titles, and actions.
 */
export function AppPageHeaderRegion({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <header className={cn("border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10", className)}>
      {children}
    </header>
  );
}

/**
 * Main scrollable content area.
 */
export function AppPageContentRegion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("flex-1 px-4 py-6 sm:px-6 lg:px-8", className)}>
      {children}
    </main>
  );
}