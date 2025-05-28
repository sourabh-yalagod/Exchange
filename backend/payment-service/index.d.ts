declare module "@sourabhyalagod/helper";
interface DepositeRecord {
  amount: number;
  method: string;
  status: {
    enum: ["pending", "completed", "failed"];
  };
  createdAt: Date;
}
