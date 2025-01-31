import qs from "query-string";

export const InvestorOnboardFormControls = [
  {
    label: "Name",
    name: "name",
    placeholder: "Enter your name",
    componentType: "input",
  },
  {
    label: "Company Name",
    name: "companyName",
    placeholder: "Enter your company name",
    componentType: "input",
  },
  {
    label: "Company Role",
    name: "companyRole",
    placeholder: "Enter your company role",
    componentType: "input",
  },
  {
    label: "Networth",
    name: "networth",
    placeholder: "Enter your Networth",
    componentType: "input",
  },
];

export const initialInvestorsFormData = {
  name: "",
  companyName: "",
  companyRole: "",
  networth: "",
};

export const pitcherOnboardFormControls = [
  {
    label: "Name",
    name: "name",
    placeholder: "Enter your name",
    componentType: "input",
  },
  {
    label: "Business",
    name: "businessName",
    placeholder: "Enter your Business name",
    componentType: "input",
  },
  {
    label: "Business Loacation",
    name: "businessLocation",
    placeholder: "Enter your business location",
    componentType: "input",
  },

  {
    label: "Pitcher Salary",
    name: "pitcherSalary",
    placeholder: "Enter your yearly income",
    componentType: "input",
  },

  {
    label: "Total Experience",
    name: "totalExperience",
    placeholder: "Enter your total experience of work",
    componentType: "input",
  },
  {
    label: "College",
    name: "college",
    placeholder: "Enter your college",
    componentType: "input",
  },
  {
    label: "College Location",
    name: "collegeLocation",
    placeholder: "Enter your college location",
    componentType: "input",
  },
  {
    label: "Graduated Year",
    name: "graduatedYear",
    placeholder: "Enter your graduated year",
    componentType: "input",
  },
  {
    label: "Linkedin Profile",
    name: "linkedinProfile",
    placeholder: "Enter your linkedin profile",
    componentType: "input",
  },
];

export const initialPitcherFormData = {
  name: "",
  businessName: "",
  businessLocation: "",
  pitcherSalary: "",
  totalExperience: "",
  college: "",
  collegeLocation: "",
  graduatedYear: "",
  linkedinProfile: "",
};

export const initialPitcherAccountFormData = {
  name: "",
  companyName: "",
  companyRole: "",
  networth: "",
};
export const postNewPitchFormControls = [
  {
    label: "Business Name",
    name: "businessName",
    placeholder: "Business Name",
    componentType: "input",
  },
  {
    label: "Tagline",
    name: "tagline",
    placeholder: "Tagline",
    componentType: "input",
  },
  {
    label: "Problem Statement",
    name: "problemStatement",
    placeholder: "Problem Statement",
    componentType: "textarea",
  },
  {
    label: "Solution",
    name: "solution",
    placeholder: "Solution",
    componentType: "textarea",
  },
  {
    label: "Market Opportunity",
    name: "marketOpportunity",
    placeholder: "Market Opportunity",
    componentType: "textarea",
  },
  {
    label: "Unique Value Proposition",
    name: "uniqueValueProposition",
    placeholder: "Unique Value Proposition",
    componentType: "textarea",
  },
  {
    label: "Business Model",
    name: "businessModel",
    placeholder: "Business Model",
    componentType: "textarea",
  },
  {
    label: "Traction",
    name: "traction",
    placeholder: "Traction",
    componentType: "textarea",
  },
  {
    label: "Marketing Strategy",
    name: "marketingStrategy",
    placeholder: "Marketing and Sales Strategy",
    componentType: "textarea",
  },

  {
    label: "Financial Projections",
    name: "financialProjections",
    placeholder: "Financial Projections",
    componentType: "textarea",
  },
  {
    label: "Funding Requirements",
    name: "fundingRequirements",
    placeholder: "Funding Requirements",
    componentType: "textarea",
  },
  {
    label: "Contact Information",
    name: "contactInformation",
    placeholder: "Contact Information",
    componentType: "textarea",
  },
  {
    label: "Type",
    name: "type",
    placeholder: "Business Type",
    componentType: "input",
  },
  {
    label: "Location",
    name: "location",
    placeholder: "Business Location",
    componentType: "input",
  },
  {
    label: "Pitch",
    name: "pitch",
    placeholder: "Type your pitch here",
    componentType: "textarea",
  },
  {
    label: "Slides/Presentation",
    name: "slides",
    placeholder: "Upload your slides or PDF",
    componentType: "file",
  },
  {
    label: "Video Demonstration",
    name: "video",
    placeholder: "Upload your video demonstration",
    componentType: "file",
  },
];

export const initialPostNewPitchFormData = {
  businessName: "",
  tagline: "",
  problemStatement: "",
  solution: "",
  marketOpportunity: "",
  uniqueValueProposition: "",
  businessModel: "",
  traction: "",
  marketingStrategy: "",
  financialProjections: "",
  fundingRequirements: "",
  contactInformation: "",
  type: "",
  location: "",
  pitch: "",
  slides: null,
  video: null,
};

export const filterMenuDataArray = [
  {
    id: "businessName",
    label: "Business Name",
  },
  {
    id: "type",
    label: "Type",
  },
  {
    id: "location",
    label: "Location",
  },
];

export function formUrlQuery({ params, dataToAdd }) {
  let currentURL = qs.parse(params);

  if (Object.keys(dataToAdd).length > 0) {
    Object.keys(dataToAdd).map((key) => {
      if (dataToAdd[key].length === 0) delete currentURL[key];
      else currentURL[key] = dataToAdd[key].join(",");
    });
  }

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentURL,
    },
    {
      skipNull: true,
    }
  );
}

export const membershipPlans = [
  {
    heading: "Gold",
    price: 100,
    type: "gold",
    bgColor: "bg-gradient-to-br from-orange-400 to-yellow-500",
  },
  {
    heading: "Bronze",
    price: 1000,
    type: "bronze",
    bgColor: "bg-gradient-to-br from-blue-300 to-green-600",
  },
  {
    heading: "Diamond",
    price: 5000,
    type: "diamond",
    bgColor: "bg-gradient-to-br from-blue-300 to-red-500",
  },
];

export const tiers = [
  {
    tier: "Tier 1",
    description: "Basic Membership",
  },
  {
    tier: "Tier 2",
    description: "Pro Membership",
  },
  {
    tier: "Tier 3",
    description: "Elite Membership",
  },
  {
    tier: "Tier 4",
    description: "Pro plusMembership",
    bgColor: "bg-gradient-to-br from-yellow-300 to-blue-500",
  },
];
