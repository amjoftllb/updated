import { GridColDef, GridRowsProp } from "@mui/x-data-grid"
import {
  DataFileType,
  KeyInsight,
  SuggestionType,
  UserConversation
} from "../types"

export const DUMMY_CSV = `
Model,mpg,cyl,disp,hp,drat,wt,qsec,vs,am,gear,carb
Mazda RX4,21,6,160,110,3.9,2.62,16.46,0,1,4,4
Mazda RX4 Wag,21,6,160,110,3.9,2.875,17.02,0,1,4,4
Datsun 710,22.8,4,108,93,3.85,2.32,18.61,1,1,4,1
Hornet 4 Drive,21.4,6,258,110,3.08,3.215,19.44,1,0,3,1
Hornet Sportabout,18.7,8,360,175,3.15,3.44,17.02,0,0,3,2
Valiant,18.1,6,225,105,2.76,3.46,20.22,1,0,3,1
Duster 360,14.3,8,360,245,3.21,3.57,15.84,0,0,3,4
Merc 240D,24.4,4,146.7,62,3.69,3.19,20,1,0,4,2
Merc 230,22.8,4,140.8,95,3.92,3.15,22.9,1,0,4,2
Merc 280,19.2,6,167.6,123,3.92,3.44,18.3,1,0,4,4
Merc 280C,17.8,6,167.6,123,3.92,3.44,18.9,1,0,4,4
Merc 450SE,16.4,8,275.8,180,3.07,4.07,17.4,0,0,3,3
Merc 450SL,17.3,8,275.8,180,3.07,3.73,17.6,0,0,3,3
Merc 450SLC,15.2,8,275.8,180,3.07,3.78,18,0,0,3,3
Cadillac Fleetwood,10.4,8,472,205,2.93,5.25,17.98,0,0,3,4
Lincoln Continental,10.4,8,460,215,3,5.424,17.82,0,0,3,4
Chrysler Imperial,14.7,8,440,230,3.23,5.345,17.42,0,0,3,4
Fiat 128,32.4,4,78.7,66,4.08,2.2,19.47,1,1,4,1
`

const fileContent = DUMMY_CSV
const blob = new Blob([fileContent], { type: "text/csv" })
const fileName = "DUMMY_FILE.csv"
export const DUMMY_FILE = new File([blob], fileName, {
  type: blob.type,
  lastModified: new Date().getTime() // Optional, sets the file modification date to now
})

export const KEY_INSIGHTS_DUMMY_DATA: KeyInsight[] = [
  {
    title: "Data Scope",
    content:
      "Insights have been extracted from a comprehensive dataset of 22,458 leads, spanning the period from April 2, 2021, to February 25, 2024."
  },
  {
    title: "Timeframe Analyzed",
    content:
      "This analysis covers nearly three years of lead generation activities, providing a robust overview of trends and patterns."
  },
  {
    title: "Platform Insights",
    content:
      "Despite Facebook having the lowest conversion rates among the platforms analyzed, it's noteworthy that it leads in the total number of converted leads. This is attributed to its significant volume of leads generated, underscoring the platform's extensive reach and potential for lead acquisition."
  }
]

export const TABLE_KEY_INSIGHTS_DUMMY_DATA: KeyInsight[] = [
  {
    title: "Source File",
    content:
      "Insights have been extracted from a comprehensive dataset of 22,458 leads, spanning the period from April 2, 2021, to February 25, 2024."
  },
  {
    title: "Platform Identification",
    content:
      "The 'Platform' column was utilized to identify the source platform of each lead, enabling an analysis of platform-specific performance and impact."
  },
  {
    title: "Conversion Criteria",
    content:
      "The determination of a lead's conversion status was based on the 'סטטוס' (Status) column, allowing for a nuanced understanding of lead progression and outcomes."
  }
]

export const DUMMY_ROWS: GridRowsProp = [
  { id: 1, name: "Facebook", leads: 1685, converted: 41, rate: 0.0243 },
  { id: 2, name: "Poptin-Syllabus", leads: 298, converted: 21, rate: 0.071 },
  { id: 3, name: "PMAX", leads: 195, converted: 9, rate: 0.045 },
  { id: 4, name: "Google-Search", leads: 183, converted: 20, rate: 0.091 },
  { id: 5, name: "Organic", leads: 179, converted: 30, rate: 0.17 },
  { id: 6, name: "Call", leads: 68, converted: 4, rate: 0.058 },
  { id: 7, name: "LinkedIn", leads: 50, converted: 3, rate: 0.06 },
  { id: 8, name: "Colleges", leads: 48, converted: 0, rate: 0 },
  { id: 9, name: "FB Form", leads: 28, converted: 0, rate: 0 },
  { id: 10, name: "Total", leads: 2674, converted: 135, rate: 0.05 }
]

export const DUMMY_COLUMNS: GridColDef[] = [
  { field: "name", headerName: "Platform", width: 150 },
  { field: "leads", headerName: "Number of Leads", width: 145 },
  { field: "converted", headerName: "Converted Leads", width: 145 },
  { field: "rate", headerName: "Conversion Rate", width: 145 }
]

export const dummySuggestions: SuggestionType[] = [
  {
    content: "Which source provides the most converted leads?"
  },
  {
    content: "What ages are most likely to convert?"
  },
  {
    content: "Compare the conversion rates of the salesman"
  },
  {
    content: "Compare the conversion rates of the salesman"
  }
]

export const DUMMY_SMALL_SUGGESTIONS: SuggestionType[] = [
  {
    content: "What ages are most likely to convert?"
  },
  {
    content: "Compare the conversion rates of the salesman"
  }
]

export const DUMMY_USER_CONVERSATIONS_HISTORY: UserConversation[] = [
  { id: "0", title: "First user conversation" },
  { id: "1", title: "Second short" },
  { id: "2", title: "Third user conversation a long title" },
  { id: "3", title: "Fourth user conversation a very very very long title" }
]

export type QuestionFeature =
  | "input"
  | "textfield"
  | "submit"
  | "upload"
  | "confirm"
  | "fetch"

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

export type Question = {
  id: number
  content: string
  subtitle?: string
  features: PartialRecord<QuestionFeature, boolean>
  followupQuestion?: Question
}
export type OnboardingQuestion = {
  getQuestion: (param?: any) => Question
}

export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    getQuestion: (name: string) => ({
      id: 0,
      content: `Welcome ${name}, what do you call your business?`,
      features: { input: true, submit: true }
    })
  },
  {
    getQuestion: () => ({
      id: 1,
      content: `What your business specializes in? `,
      features: { input: true, submit: true }
    })
  },
  {
    getQuestion: () => ({
      id: 2,
      content: "Let's Get Your Data on Board",
      subtitle: "Upload your files",
      features: { upload: true, submit: true }
    })
  },
  {
    getQuestion: () => ({
      id: 3,
      content: "Let’s make sure we’re on the same page.",
      features: { fetch: true, confirm: true, textfield: true }
    })
  },
  {
    getQuestion: () => ({
      id: 4,
      content: "Let’s get started!",
      features: { submit: true }
    })
  }
]

export const DUMMY_DATA_FILES: DataFileType[] = [
  {
    id: "0",
    name: "Leads Status April 2024",
    lastUpdated: new Date(),
    summary: "AI-Generated File Summary",
    updatedBy: "Sagiv Mishaan",
    originalFile: DUMMY_FILE
  },
  {
    id: "1",
    name: "Courses Signups 2024",
    lastUpdated: new Date(),
    summary: "AI-Generated File Summary",
    updatedBy: "Sagiv Mishaan",
    originalFile: DUMMY_FILE
  }
]
