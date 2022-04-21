export interface ScanInfo {
  flowId: string;
  reportId: string;
  link: string;
  name: string;
  hash: string;
  created: Date;
  verdict: string;
  status: string;
}

export type MenuItemType = {
  title: string;
  tab: string;
  component: CallableFunction;
}
