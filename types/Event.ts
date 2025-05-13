export interface Event {
  id: string;
  state: string;
  title: string;
  cover: string;
  pictures: string[];
  description: string;
  start?: number;
  end?: number;
  location: string;
  capacity: number;
  categories: string[];
  organizationID: string;
  subscribed: boolean;
}
