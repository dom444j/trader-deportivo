export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  description?: string;
  children?: NavItem[];
  roles?: string[];
}

export interface NavigationConfig {
  main: NavItem[];
  footer?: NavItem[];
}