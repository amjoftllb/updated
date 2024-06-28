import { ApexOptions } from "apexcharts";
import { ReactNode } from "react";

export type MessageType = {
  id: string;
  content: string;
  date: Date;
  side: MessageSide;
  type: "column" | "text";
  chat_id?: string;
  time_of_message?: Date;
  message_content?: any;
  role?: string;
  message_id: string;
};

export type Messege = {
  time_of_message: Date;
  message_content: string;
  role: string;
};
export interface InsightType {
  insight: string;
}

export interface GraphDataType {
  graph_data: {
    title: string;
    graph_type: string;
    description: string;
    series: {
      name: string;
      type: string;
      data: any;
    };
  };
  insights: InsightType[];
  
}
export type ConversationType = {
  id: string;
  content: string;
  date: Date;
  side: MessageSide;
  type: "column" | "text";
};

export type StatusType = {
  id: string;
  message_content: string;
  date: Date;
  role: MessageSide;
  type: "column" | "text";
};

export type UserConversation = {
  id: string;
  title: string;
};

export type MessageSide = "user" | "system";

export type SuggestionType = {
  content: string;
};

type ApexSeries = { name?: string; data: any[] };

export type ChartData = {
  options: ApexOptions;
  series: ApexSeries[];
};

export type KeyInsight = { title: string; content: string };

// export type UserConversation = { title: string; id: string }

export type ProviderProps = {
  children: ReactNode;
};

export type DataFileType = {
  id: string;
  name: string;
  summary: string;
  updatedBy: string;
  lastUpdated: Date;
  originalFile: File;
};
export type TagType = "like" | "dislike" | "confirm" | "close";
export type TagButton = { image: string; name: TagType };
export type ToastType = "success" | "alert";
