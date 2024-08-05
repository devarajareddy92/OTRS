export type OTPValidate = {
  otp: number;
  uniqueID: string;
  userName: string;
};

export type Tickets = {
  ticket_id: number;
  customer_id: number;
  customer_name: string;
  type: string;
  raised_at: string;
  title: string;
  description: string;
  severity: string;
  priority: string;
  data: string;
  raised_by_id: string;
  bucket: string;
  status: string;
  file_paths: string;
  canPick: boolean;
  canAssign: boolean;
  assignedToMe: boolean;
};
