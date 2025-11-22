import React from 'react';

export interface BlobConfig {
  id: string;
  color: string;
  top: string;
  left: string;
  width: string;
  height: string;
  animationDuration: string;
}

export interface IconProps {
  className?: string;
  strokeWidth?: number;
}

export interface NewsItem {
    id: number;
    title: string;
    date: string;
    content?: string; // Markdown content support
}

export interface PageData {
  title: string;
  icon: React.FC<IconProps>;
  description: string;
  content: string[];
}

export type PageKey = 'home' | 'computer' | 'phone' | 'secondhand' | 'code' | 'hardware' | 'news' | 'admin' | 'tools-geo' | 'news-full' | 'news-detail';
