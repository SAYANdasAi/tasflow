"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { FileUp, BarChart2, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import { Bar, Pie } from "react-chartjs-2"
import { toast } from "sonner"

import styles from "@/styles/comparison.module.css"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

export default function ComparisonTool() {
  const [file, setFile] = useState<File | null>(null)
  const [referenceText, setReferenceText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      toast.success("File uploaded successfully", {
        description: `${e.target.files[0].name} (${(e.target.files[0].size / 1024 / 1024).toFixed(2)} MB)`,
      })
    }
  }

  const handleAnalyze = () => {
    if (!file || !referenceText) return

    setIsAnalyzing(true)
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setShowResults(true)
          toast.success("Analysis complete", {
            description: "Your document has been analyzed successfully.",
          })
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleReset = () => {
    setFile(null)
    setReferenceText("")
    setShowResults(false)
    setProgress(0)
    toast.info("Form reset", {
      description: "All fields have been cleared.",
    })
  }

  // Sample chart data
  const barData = {
    labels: ["Keyword Matches", "Sentence Structure", "Content Accuracy", "Grammar", "Overall Score"],
    datasets: [
      {
        label: "Score (%)",
        data: [85, 72, 90, 95, 85],
        backgroundColor: "rgba(37, 99, 235, 0.6)",
      },
    ],
  }

  const pieData = {
    labels: ["Matched Content", "Missing Content", "Extra Content"],
    datasets: [
      {
        data: [70, 20, 10],
        backgroundColor: ["rgba(37, 99, 235, 0.6)", "rgba(239, 68, 68, 0.6)", "rgba(245, 158, 11, 0.6)"],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="mx-auto max-w-5xl">
      {!showResults ? (
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Upload Answer Script</CardTitle>
              <CardDescription>Upload PDF, JPG, or DOCS file to analyze</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 ${styles.uploadArea}`}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.doc,.docx"
                />
                <label
                  htmlFor="file-upload"
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                >
                  <FileUp className="mb-4 h-10 w-10 text-muted-foreground" />
                  {file ? (
                    <div className="text-center">
                      <p className="font-medium text-primary">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB · Click or drag to replace
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="font-medium">Drag & drop file here or click to browse</p>
                      <p className="text-sm text-muted-foreground">Supports PDF, JPG, DOC, and DOCX</p>
                    </div>
                  )}
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle>Reference Answer</CardTitle>
              <CardDescription>Paste the reference answer to compare against</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your reference answer here..."
                className="h-64 resize-none"
                value={referenceText}
                onChange={(e) => setReferenceText(e.target.value)}
              />
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            {isAnalyzing ? (
              <div className="space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <h3 className="text-lg font-medium">Analyzing document...</h3>
                <Progress value={progress} className="h-2 w-full" />
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="gap-2" onClick={handleAnalyze} disabled={!file || !referenceText}>
                  <BarChart2 className="h-5 w-5" />
                  Analyze Now
                </Button>
                <Button size="lg" variant="outline" className="gap-2" onClick={handleReset}>
                  <RefreshCw className="h-5 w-5" />
                  Reset
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>Comparison between your document and the reference answer</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="mb-6 grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
                <TabsTrigger value="text">Text Comparison</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="h-80">
                    <h3 className="mb-4 text-lg font-medium">Score Breakdown</h3>
                    <Bar
                      data={barData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="h-80">
                    <h3 className="mb-4 text-lg font-medium">Content Analysis</h3>
                    <Pie
                      data={pieData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="mb-4 text-lg font-medium">Summary</h3>
                  <p>
                    Your answer matches 85% with the reference answer. The main strengths are in grammar and content
                    accuracy, while sentence structure could be improved. There are 5 key concepts missing from your
                    answer.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="details">
                <div className="space-y-6">
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="mb-4 text-lg font-medium">Keyword Analysis</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Present Keywords (15/20)</span>
                        <span className="text-green-500">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </div>
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="mb-4 text-lg font-medium">Missing Concepts</h3>
                    <ul className="list-inside list-disc space-y-2">
                      <li>Definition of quantum entanglement</li>
                      <li>Einstein-Podolsky-Rosen paradox</li>
                      <li>Bell's inequality explanation</li>
                      <li>Quantum decoherence concept</li>
                      <li>Practical applications in quantum computing</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="text">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="mb-4 text-lg font-medium">Your Answer</h3>
                    <div className="max-h-96 overflow-y-auto">
                      <p className="whitespace-pre-wrap">
                        {file?.name} content would be displayed here after actual processing. This is a simulation of
                        the comparison feature.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="mb-4 text-lg font-medium">Reference Answer</h3>
                    <div className="max-h-96 overflow-y-auto">
                      <p className="whitespace-pre-wrap">{referenceText}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" className="gap-2" onClick={handleReset}>
                <RefreshCw className="h-4 w-4" />
                Analyze Another Document
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

