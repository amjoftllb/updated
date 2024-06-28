import React, { useMemo } from "react";
import "./message.css";
import {
  GraphDataType,
  MessageSide,
  MessageType,
  Messege,
} from "../../../types";
import moment from "moment";
import clsx from "clsx";
import FColumnChart from "../../FColumnChart";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Suggestions from "../Suggestions";
import Tagger from "../Tagger";

interface MessageProps {
  message: MessageType;
  index: number;
  // addMessage: (message: MessageType) => void;
}

type CustomTabPanelProps = {
  children?: React.ReactNode;
  value: number;
  index: number;
};

interface GraphMessageProps {
  content: GraphDataType;
}
const Message = ({ message, index }: MessageProps) => {
  const { message_content, time_of_message, role } = message;
  const dateMemo = useMemo(
    () => moment(time_of_message).format("D MMM, YYYY"),
    [time_of_message]
  );
  const roleAsMessageSide: MessageSide =
    role === "user" || role === "system" ? role : "system";

  return (
    <div className="message-container">
      {index === 0 && (
        <div className="date-container">
          <span className="date-label">{dateMemo}</span>
        </div>
      )}
      {typeof message_content === "string" ? (
        <TextMessage side={roleAsMessageSide} content={message_content} />
      ) : message_content &&
        Array.isArray(message_content) &&
        message_content?.length > 0 ? (
        <GraphMessage content={message_content[0]} />
      ) : null}

      {role === "assistant" &&
      message_content &&
      Array.isArray(message_content) &&
      message_content.length > 0 &&
      message_content[0].followup_suggestions ? (
        <Suggestions
          username="Sagiv"
          callback={() => {}}
          firstMessage={false}
          suggestions={message_content[0].followup_suggestions}
        />
      ) : null}
    </div>
  );
};

export default Message;

const CustomTabPanel = ({
  children,
  value,
  index,
  ...other
}: CustomTabPanelProps) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...other}
  >
    {value === index && (
      <Box sx={{ p: 3 }}>
        <Typography>{children}</Typography>
      </Box>
    )}
  </div>
);

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const GraphMessage: React.FC<GraphMessageProps> = ({ content }) => {
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTabIndex(newValue);
  };

  return (
    <div className={clsx("message system-message graph")}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ position: "absolute", top: "-23px", left: "0px" }}>
          <Tabs
            TabIndicatorProps={{ hidden: true }}
            value={selectedTabIndex}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              label="Preview"
              tabIndex={0}
              {...a11yProps(0)}
              classes={{ root: "tab-btn" }}
            />
            <Tab
              label="Data"
              tabIndex={1}
              {...a11yProps(1)}
              classes={{ root: "tab-btn" }}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={selectedTabIndex} index={0}>
          <ColumnGraph content={content} />
          <Tagger />
        </CustomTabPanel>
        <CustomTabPanel value={selectedTabIndex} index={1}>
          <TableGraph content={content} />
          <Tagger />
        </CustomTabPanel>
      </Box>
    </div>
  );
};

const ColumnGraph: React.FC<GraphMessageProps> = ({ content }) => {
  return (
    <div className="graph-message">
      <FColumnChart graphData={content?.graph_data} />
      <div className="insights-container">
        <span className="insights-list-title">Key Insights Overview:</span>
        <div className="insights-list"> 
          {content.insights.map((insight:any, index) => (
            <div key={index} className="key-insight">
              <span className="key-insight-title">• Insight {index + 1}: </span>
              <span className="key-insight-content">{insight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TableGraph = ({ content }: { content: GraphDataType }) => {
  const rows = content?.graph_data?.series?.data.map(
    (data: any, index: string) => ({
      id: index + 1,
      data,
    })
  );
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "data", headerName: content.graph_data.title, width: 150 },
  ];

  return (
    <div className="graph-message">
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        hideFooter
        classes={{ row: "table-row" }}
        rowHeight={25}
        columnHeaderHeight={35}
      />
      <div className="insights-container">
        <span className="insights-list-title">
          Data Source & Analysis Criteria:
        </span>
        <div className="insights-list">
          {content.insights.map((insight:any, index) => (
            <div key={index} className="key-insight">
              <span className="key-insight-title">• Insight {index + 1}: </span>
              <span className="key-insight-content">{insight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TextMessage = ({
  side,
  content,
}: {
  side: MessageSide;
  content: string;
}) => {
  const isUserMessage = useMemo(() => side === "user", [side]);

  return (
    <div
      className={clsx(
        "message",
        isUserMessage ? "user-message" : "system-message"
      )}
    >
      {content}
    </div>
  );
};

