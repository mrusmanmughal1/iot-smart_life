export interface Automation {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: {
    type: string;
    device: string;
    condition: string;
  };
  action: {
    type: string;
    target: string;
    value: string;
  };
  lastTriggered?: Date;
  executionCount: number;
  status: 'active' | 'inactive' | 'error';
}

export type TriggerType = 'threshold' | 'state' | 'schedule' | 'event';
