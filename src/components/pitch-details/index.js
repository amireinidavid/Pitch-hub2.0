"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  BarChart,
  PieChart,
  XAxis,
  YAxis
} from "recharts";
import { 
  Briefcase,
  Users,
  Landmark,
  MapPin,
  FileText,
  CircleDollarSign,
  Rocket,
  Star,
  Download,
  Share2,
  MessageCircle,
  Linkedin,
  Twitter,
  Github,
  FileSearch
} from "lucide-react";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bar, Line } from "react-chartjs-2";
import { Tooltip } from "chart.js";

const financialChartData = [
  { name: 'Q1', revenue: 4000, expenses: 2400 },
  { name: 'Q2', revenue: 3000, expenses: 1398 },
  { name: 'Q3', revenue: 9800, expenses: 2000 },
  { name: 'Q4', revenue: 3908, expenses: 2780 },
];

const PitchDetails = ({ pitch, user, profileInfo }) => {
  // Animation variants
  const staggerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerVariants}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Loading Skeleton */}
      {!pitch && (
        <div className="space-y-8">
          <Skeleton className="h-12 w-1/2 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      )}

      {pitch && (
        <AnimatePresence>
          {/* Header Section */}
          <motion.div variants={fadeIn} className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  {pitch.title}
                </h1>
                <p className="text-xl text-muted-foreground mt-2">
                  {pitch.tagline}
                </p>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {pitch.status}
              </Badge>
            </div>

            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
            >
              <Avatar className="h-16 w-16">
                <AvatarImage src={pitch.creator?.image} />
                <AvatarFallback className="text-2xl">
                  {pitch.creator?.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-lg">{pitch.creator?.name}</p>
                <p className="text-muted-foreground">
                  Created {new Date(pitch.createdAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            variants={fadeIn}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-sm">Funding Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${pitch.fundingGoal}</div>
                <LineChart
                  width={100}
                  height={40}
                  data={financialChartData}
                  margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                >
                  <Line
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                  />
                </LineChart>
              </CardContent>
            </Card>

            {/* Add other stat cards similarly */}
          </motion.div>

          {/* Main Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <motion.div variants={fadeIn}>
              <TabsList className="grid w-full grid-cols-8 h-12 gap-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="traction">Traction</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="investment">Investment</TabsTrigger>
                <TabsTrigger value="qa">Q&A</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>
            </motion.div>

            <AnimatePresence mode="wait">
              {/* Financials Tab */}
              <TabsContent value="financials">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BarChart
                        width={800}
                        height={400}
                        data={financialChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#2563eb" />
                        <Bar dataKey="expenses" fill="#dc2626" />
                      </BarChart>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Team Tab */}
              <TabsContent value="team">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pitch.team?.map((member) => (
                      <motion.div 
                        key={member.id}
                        whileHover={{ y: -5 }}
                        className="relative group"
                      >
                        <Card className="h-full">
                          <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center">
                              <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={member.image} />
                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                              </Avatar>
                              <h3 className="text-lg font-semibold">
                                {member.name}
                              </h3>
                              <p className="text-muted-foreground">
                                {member.role}
                              </p>
                              <div className="flex gap-2 mt-4">
                                {member.linkedin && (
                                  <Button variant="ghost" size="icon">
                                    <Linkedin className="h-5 w-5" />
                                  </Button>
                                )}
                                {member.twitter && (
                                  <Button variant="ghost" size="icon">
                                    <Twitter className="h-5 w-5" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>

              {/* Q&A Tab */}
              <TabsContent value="qa">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Questions & Answers</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {pitch.qa?.map((qa) => (
                        <motion.div 
                          key={qa.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-4 rounded-lg bg-muted/50"
                        >
                          <div className="flex gap-4">
                            <Avatar>
                              <AvatarImage src={qa.user.image} />
                              <AvatarFallback>?</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-medium">{qa.user.name}</div>
                              <p className="text-muted-foreground">{qa.question}</p>
                              {qa.answer && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="mt-2 pl-4 border-l-2 border-primary"
                                >
                                  <div className="text-sm text-muted-foreground">
                                    Founder's Answer:
                                  </div>
                                  <p>{qa.answer}</p>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pitch.documents?.map((doc) => (
                      <motion.div 
                        key={doc.id}
                        whileHover={{ scale: 1.02 }}
                        className="relative"
                      >
                        <Card className="h-full">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="p-3 rounded-lg bg-primary/10">
                                <FileSearch className="h-8 w-8 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{doc.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {doc.type}
                                </p>
                              </div>
                            </div>
                            <iframe 
                              src={doc.url}
                              className="w-full h-64 mt-4 rounded-lg"
                              title={doc.name}
                            />
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>

              {/* Comments Tab */}
              <TabsContent value="comments">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Comments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <Textarea
                          placeholder="Add your comment..."
                          className="min-h-[100px]"
                        />
                        <Button>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Post Comment
                        </Button>
                        
                        <ScrollArea className="h-[400px]">
                          {pitch.comments?.map((comment) => (
                            <motion.div
                              key={comment.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="py-4"
                            >
                              <div className="flex gap-4">
                                <Avatar>
                                  <AvatarImage src={comment.user.image} />
                                  <AvatarFallback>
                                    {comment.user.name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="font-medium">
                                    {comment.user.name}
                                  </div>
                                  <p className="text-muted-foreground">
                                    {comment.text}
                                  </p>
                                </div>
                              </div>
                              <Separator className="my-4" />
                            </motion.div>
                          ))}
                        </ScrollArea>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Add other tabs similarly */}
              
            </AnimatePresence>
          </Tabs>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default PitchDetails;